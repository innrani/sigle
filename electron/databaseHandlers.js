const { ipcMain } = require('electron');
const { initializeDatabase } = require('./database');

function setupDatabaseHandlers() {
    const db = initializeDatabase();

    // ------------------------------------
    // Handlers para Clientes
    // ------------------------------------

    // Listar todos os clientes ativos
    ipcMain.handle('list-clients', async () => {
        try {
            // Filtra apenas clientes is_actives (ativo = 1)
            const query = 'SELECT * FROM clients WHERE is_active = 1 ORDER BY name';
            return db.prepare(query).all();
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            throw new Error("Falha ao buscar clientes no banco de dados.");
        }
    });

    ipcMain.handle('list-all-clients', async () => {
        try {
            // Não filtra por ativo
            const query = 'SELECT * FROM clients ORDER BY name';
            return db.prepare(query).all();
        } catch (error) {
            console.error("Erro ao listar todos os clientes:", error);
            throw new Error("Falha ao buscar todos os clientes no banco de dados.");
        }
    });

    // Adicionar novo cliente
    ipcMain.handle('add-client', async (event, client) => {
        try {
            const query = `
                INSERT INTO clients (name, email, phone, cpf, address, city, state,observations, is_active)
                VALUES (@name, @email, @phone, @cpf, @address, @city, @state, @observations, 1)
            `;
            const result = db.prepare(query).run(client);

            const newClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid);
            return newClient;

        } catch (error) {
            console.error("Erro ao adicionar cliente:", error);
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new Error("Violação de restrição. Verifique se o CPF já está cadastrado.");
            }
            throw new Error("Falha ao salvar cliente no banco de dados.");
        }
    });

    // Atualizar cliente
    ipcMain.handle('update-client', async (event, client) => {
        try {
            const query = `
                UPDATE clients 
                SET name = @name,
                    email = @email,
                    phone = @phone,
                    cpf = @cpf,
                    address = @address,
                    city = @city,
                    state = @state,                    
                    observations = @observations,
                    is_active = @is_active,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = @id
            `;
            db.prepare(query).run(client);

            const updatedClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(client.id);
            return updatedClient;

        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            if (error.code === 'SQLITE_CONSTRAINT') {
                throw new Error("Violação de restrição. Verifique se o CPF já está cadastrado.");
            }
            throw new Error("Falha ao atualizar cliente no banco de dados.");
        }
    });

    // Deletar cliente (SOFT DELETE) - SOLUÇÃO DEFINITIVA CONTRA ERRO 'const'
    ipcMain.handle('delete-client', async (event, id) => {
        try {
            // 1. Verifica as Ordens de Serviço (OS) do cliente
            const checkServicesQuery = 'SELECT COUNT(order_number) AS serviceCount FROM service_orders WHERE client_id = ?';
            const { serviceCount } = db.prepare(checkServicesQuery).get(id);

            // Variável booleana para simplificar a lógica
            const isSoftDelete = serviceCount > 0;

            // 2. Declaração ÚNICA com CONST, usando operador ternário para atribuir o valor
            const finalQuery = isSoftDelete
                ? 'UPDATE clients SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?' // Soft Delete
                : 'DELETE FROM clients WHERE id = ?'; // Hard Delete

            const resultMessage = isSoftDelete
                ? { type: 'soft', message: `Cliente possui ${serviceCount} OS(s) e foi marcado como inativo. Seus dados foram preservados para histórico.` }
                : { type: 'hard', message: 'Cliente excluído permanentemente.' };

            // 3. Executa a query
            db.prepare(finalQuery).run(id);

            return resultMessage;

        } catch (error) {
            console.error("Erro ao deletar/inativar cliente:", error);
            throw new Error("Falha ao processar exclusão do cliente no banco de dados.");
        }
    });

    // Reativar cliente (setar is_active = 1 novamente)
    ipcMain.handle('reactivate-client', async (event, id) => {
        try {
            const query = 'UPDATE clients SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            db.prepare(query).run(id);
            return { success: true, message: 'Cliente reativado com sucesso.' };
        } catch (error) {
            console.error("Erro ao reativar cliente:", error);
            throw new Error("Falha ao reativar cliente no banco de dados.");
        }
    });

    // Buscar cliente por ID
    ipcMain.handle('get-client', async (event, id) => {
        try {
            const query = 'SELECT * FROM clients WHERE id = ?';
            return db.prepare(query).get(id);
        } catch (error) {
            console.error("Erro ao buscar cliente por ID:", error);
            throw new Error("Falha ao buscar cliente por ID no banco de dados.");
        }
    });

// ------------------------------------
// Handlers para Equipamentos (CORRIGIDO)
// ------------------------------------

// 1. Adicionar novo equipamento
ipcMain.handle('add-equipment', async (event, equipment) => {
    try {
        const query = `
            INSERT INTO equipment (serial_number, device_type, brand, model, accessories, is_active)
            VALUES (@serial_number, @device_type, @brand, @model, @accessories, 1)
        `;
        const result = db.prepare(query).run(equipment); 
        
        // Retorna o equipamento completo usando o ID gerado (equipment_id)
        const newEquipment = db.prepare('SELECT * FROM equipment WHERE equipment_id = ?').get(result.lastInsertRowid);
        return newEquipment;

    } catch (error) {
        // Assume que 'serial_number' é UNIQUE, o que é recomendado para equipamentos
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE' || error.message.includes('serial_number')) {
             throw new Error("Já existe um equipamento cadastrado com este Número de Série.");
        }
        console.error("Erro ao adicionar equipamento:", error);
        throw new Error("Falha ao cadastrar equipamento no banco de dados.");
    }
});

// 2. Listar SOMENTE equipamentos ativos (is_active = 1)
ipcMain.handle('list-active-equipments', async () => {
    try {
        const query = 'SELECT * FROM equipment WHERE is_active = 1 ORDER BY model';
        return db.prepare(query).all();
    } catch (error) {
        console.error("Erro ao listar equipamentos ativos:", error);
        throw new Error("Falha ao buscar equipamentos ativos no banco de dados.");
    }
});


// 3. Listar TODOS os equipamentos (ativos e inativos) - Para tela de gerenciamento
ipcMain.handle('list-all-equipments', async () => {
    try {
        const query = 'SELECT * FROM equipment ORDER BY model';
        return db.prepare(query).all();
    } catch (error) {
        console.error("Erro ao listar todos os equipamentos:", error);
        throw new Error("Falha ao buscar todos os equipamentos no banco de dados.");
    }
});


// 4. Deletar/Inativar equipamento (Soft Delete)
ipcMain.handle('delete-equipment', async (event, equipment_id) => {
    try {
        // 1. Obtém o serial_number, que é a chave de ligação com a tabela 'servico'
        const equipment = db.prepare('SELECT serial_number FROM equipment WHERE equipment_id = ?').get(equipment_id);
        
        if (!equipment) {
            throw new Error("Equipamento não encontrado para exclusão.");
        }
        
        const serialNumber = equipment.serial_number;

        // 2. Verifica se o equipamento tem serviços/OS associados
        const serviceCountQuery = 'SELECT COUNT(*) AS count FROM service_orders WHERE equipment_id = ?';
        const { count: serviceCount } = db.prepare(serviceCountQuery).get(serialNumber);

        const isSoftDelete = serviceCount > 0;

        // 3. Executa a exclusão (Soft ou Hard) usando o PK (equipment_id)
        const finalQuery = isSoftDelete
            ? 'UPDATE equipment SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE equipment_id = ?' // Soft Delete
            : 'DELETE FROM equipment WHERE equipment_id = ?'; // Hard Delete

        const resultMessage = isSoftDelete
            ? { type: 'soft', message: `Equipamento (SN: ${serialNumber}) possui ${serviceCount} OS(s) e foi inativado.` }
            : { type: 'hard', message: `Equipamento (ID: ${equipment_id}) excluído permanentemente.` };
        
        db.prepare(finalQuery).run(equipment_id);

        return resultMessage;

    } catch (error) {
        console.error("Erro ao deletar/inativar equipamento:", error);
        throw new Error("Falha ao processar exclusão do equipamento no banco de dados.");
    }
});

// 5. Reativar equipamento inativo
ipcMain.handle('reactivate-equipment', async (event, equipment_id) => {
    try {
        const query = 'UPDATE equipment SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE equipment_id = ?';
        db.prepare(query).run(equipment_id);
        return { success: true, message: 'Equipamento reativado com sucesso.' };
    } catch (error) {
        console.error("Erro ao reativar equipamento:", error);
        throw new Error("Falha ao reativar equipamento no banco de dados.");
    }
});

// 6. Atualizar equipamento
ipcMain.handle('update-equipment', async (event, equipment_id, updates) => {
    try {
        const query = `
            UPDATE equipment 
            SET device_type = @device,
                brand = @brand,
                model = @model,
                serial_number = @serialNumber,
                accessories = @notes,
                updated_at = CURRENT_TIMESTAMP
            WHERE equipment_id = @id
        `;
        db.prepare(query).run({ ...updates, id: equipment_id });
        
        const updatedEquipment = db.prepare('SELECT * FROM equipment WHERE equipment_id = ?').get(equipment_id);
        return updatedEquipment;
    } catch (error) {
        console.error("Erro ao atualizar equipamento:", error);
        throw new Error("Falha ao atualizar equipamento no banco de dados.");
    }
});

    // ------------------------------------
    // Handlers para Peças
    // ------------------------------------

    ipcMain.handle('create-part', async (event, part) => {
        try {
            const query = `
                INSERT INTO parts (type, name, description, quantity, price, unit, is_active)
                VALUES (@type, @name, @description, @quantity, @price, @unit, 1)
            `;
            const result = db.prepare(query).run(part);
            const newPart = db.prepare('SELECT * FROM parts WHERE id = ?').get(result.lastInsertRowid);
            return newPart;
        } catch (error) {
            console.error("Erro ao criar peça:", error);
            throw new Error("Falha ao cadastrar peça no banco de dados.");
        }
    });

    ipcMain.handle('list-parts', async () => {
        try {
            const query = 'SELECT * FROM parts WHERE is_active = 1 ORDER BY name';
            return db.prepare(query).all();
        } catch (error) {
            console.error("Erro ao listar peças:", error);
            throw new Error("Falha ao buscar peças no banco de dados.");
        }
    });

    ipcMain.handle('update-part', async (event, part) => {
        try {
            const query = `
                UPDATE parts 
                SET type = @type,
                    name = @name,
                    description = @description,
                    quantity = @quantity,
                    price = @price,
                    unit = @unit,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = @id
            `;
            db.prepare(query).run(part);
            const updatedPart = db.prepare('SELECT * FROM parts WHERE id = ?').get(part.id);
            return updatedPart;
        } catch (error) {
            console.error("Erro ao atualizar peça:", error);
            throw new Error("Falha ao atualizar peça no banco de dados.");
        }
    });

    ipcMain.handle('delete-part', async (event, id) => {
        try {
            // Soft delete
            const query = 'UPDATE parts SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            db.prepare(query).run(id);
            return { success: true, message: 'Peça inativada com sucesso.' };
        } catch (error) {
            console.error("Erro ao deletar peça:", error);
            throw new Error("Falha ao deletar peça no banco de dados.");
        }
    });

    // ------------------------------------
    // Handlers para Técnicos
    // ------------------------------------

    ipcMain.handle('create-technician', async (event, technician) => {
        try {
            const query = `
                INSERT INTO technicians (name, phone, specialty, is_active)
                VALUES (@name, @phone, @specialty, 1)
            `;
            const result = db.prepare(query).run(technician);
            const newTechnician = db.prepare('SELECT * FROM technicians WHERE id = ?').get(result.lastInsertRowid);
            return newTechnician;
        } catch (error) {
            console.error("Erro ao criar técnico:", error);
            throw new Error("Falha ao cadastrar técnico no banco de dados.");
        }
    });

    ipcMain.handle('list-technicians', async () => {
        try {
            const query = 'SELECT * FROM technicians WHERE is_active = 1 ORDER BY name';
            return db.prepare(query).all();
        } catch (error) {
            console.error("Erro ao listar técnicos:", error);
            throw new Error("Falha ao buscar técnicos no banco de dados.");
        }
    });

    ipcMain.handle('update-technician', async (event, technician) => {
        try {
            const query = `
                UPDATE technicians 
                SET name = @name,
                    phone = @phone,
                    specialty = @specialty,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = @id
            `;
            db.prepare(query).run(technician);
            const updatedTechnician = db.prepare('SELECT * FROM technicians WHERE id = ?').get(technician.id);
            return updatedTechnician;
        } catch (error) {
            console.error("Erro ao atualizar técnico:", error);
            throw new Error("Falha ao atualizar técnico no banco de dados.");
        }
    });

    ipcMain.handle('delete-technician', async (event, id) => {
        try {
            // Soft delete
            const query = 'UPDATE technicians SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            db.prepare(query).run(id);
            return { success: true, message: 'Técnico inativado com sucesso.' };
        } catch (error) {
            console.error("Erro ao deletar técnico:", error);
            throw new Error("Falha ao deletar técnico no banco de dados.");
        }
    });

}

// Exporta a função para que main.js possa chamá-la.
module.exports = { setupDatabaseHandlers };
