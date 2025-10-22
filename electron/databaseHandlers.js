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
            // Filtra apenas clientes ativos (ativo = 1)
            const query = 'SELECT * FROM clientes WHERE ativo = 1 ORDER BY name';
            return db.prepare(query).all();
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            throw new Error("Falha ao buscar clientes no banco de dados.");
        }
    });

    ipcMain.handle('list-all-clients', async () => {
        try {
            // Não filtra por ativo
            const query = 'SELECT * FROM clientes ORDER BY name';
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
                INSERT INTO clientes (name, email, phone, cpf, address, city, state, zipCode, observations, ativo)
                VALUES (@name, @email, @phone, @cpf, @address, @city, @state, @zipCode, @observations, 1)
            `;
            const result = db.prepare(query).run(client);

            const newClient = db.prepare('SELECT * FROM clientes WHERE id = ?').get(result.lastInsertRowid);
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
                UPDATE clientes 
                SET name = @name,
                    email = @email,
                    phone = @phone,
                    cpf = @cpf,
                    address = @address,
                    city = @city,
                    state = @state,
                    zipCode = @zipCode,
                    observations = @observations,
                    ativo = @ativo,
                    updatedAt = CURRENT_TIMESTAMP
                WHERE id = @id
            `;
            db.prepare(query).run(client);

            const updatedClient = db.prepare('SELECT * FROM clientes WHERE id = ?').get(client.id);
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
            const checkServicesQuery = 'SELECT COUNT(numeroOS) AS serviceCount FROM servico WHERE clientId = ?';
            const { serviceCount } = db.prepare(checkServicesQuery).get(id);

            // Variável booleana para simplificar a lógica
            const isSoftDelete = serviceCount > 0;

            // 2. Declaração ÚNICA com CONST, usando operador ternário para atribuir o valor
            const finalQuery = isSoftDelete
                ? 'UPDATE clientes SET ativo = 0, updatedAt = CURRENT_TIMESTAMP WHERE id = ?' // Soft Delete
                : 'DELETE FROM clientes WHERE id = ?'; // Hard Delete

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

    // Reativar cliente (setar ativo = 1 novamente)
    ipcMain.handle('reactivate-client', async (event, id) => {
        try {
            const query = 'UPDATE clientes SET ativo = 1, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
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
            const query = 'SELECT * FROM clientes WHERE id = ?';
            return db.prepare(query).get(id);
        } catch (error) {
            console.error("Erro ao buscar cliente por ID:", error);
            throw new Error("Falha ao buscar cliente por ID no banco de dados.");
        }
    });
}

// Exporta a função para que main.js possa chamá-la.
module.exports = { setupDatabaseHandlers };
