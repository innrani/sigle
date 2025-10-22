// electron/databaseHandlers.js

const { ipcMain } = require('electron');
const { initializeDatabase } = require('./database'); // Importa a função do arquivo database.js

function setupDatabaseHandlers() {
    // Inicializa o banco de dados. Isso deve ser feito APENAS UMA VEZ.
    const db = initializeDatabase();

    // ------------------------------------
    // Handlers para Clientes
    // ------------------------------------

    // Listar todos os clientes
    ipcMain.handle('list-clients', async () => {
        try {
            const query = 'SELECT * FROM clients ORDER BY name';
            return db.prepare(query).all();
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            throw new Error("Falha ao buscar clientes no banco de dados.");
        }
    });

    // Adicionar novo cliente
    ipcMain.handle('add-client', async (event, client) => {
        try {
            // A query usa placeholders nomeados (@campo)
            const query = `
                INSERT INTO clients (name, email, phone, address, city, state, zipCode, observations, ativo)
                VALUES (@name, @email, @phone, @address, @city, @state, @zipCode, @observations, 1)
            `;
            // SQLite não suporta RETURNING * no `run`. Usamos `lastInsertRowid` para buscar o registro completo.
            const result = db.prepare(query).run(client);
            
            // Busca o cliente completo com todos os campos gerados
            const newClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(result.lastInsertRowid);
            return newClient;

        } catch (error) {
            console.error("Erro ao adicionar cliente:", error);
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
            
            // Busca o cliente completo e atualizado
            const updatedClient = db.prepare('SELECT * FROM clients WHERE id = ?').get(client.id);
            return updatedClient;

        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            throw new Error("Falha ao atualizar cliente no banco de dados.");
        }
    });

    // Deletar cliente
    ipcMain.handle('delete-client', async (event, id) => {
        try {
            const query = 'DELETE FROM clients WHERE id = ?';
            // O run retorna informações sobre a execução, mas para o frontend, um Promise<void> é suficiente
            db.prepare(query).run(id); 
            return;
        } catch (error) {
            console.error("Erro ao deletar cliente:", error);
            throw new Error("Falha ao deletar cliente no banco de dados.");
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
}

// Exporta a função para que main.js possa chamá-la.
module.exports = { setupDatabaseHandlers };