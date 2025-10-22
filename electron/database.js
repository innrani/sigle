// electron/database.js

const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

// Armazena a instância do DB. É um singleton.
let dbInstance = null;

// Função para inicializar o banco de dados
function initializeDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    // Define o caminho do banco de dados na pasta de dados do usuário
    // Isso garante que o DB persista mesmo após atualizações do app
    const dbPath = path.join(app.getPath('userData'), 'database.db');
    
    // Cria conexão com o banco de dados (o 'verbose' é opcional para debug)
    const db = new Database(dbPath, { verbose: console.log });
    
    // Cria a tabela de clientes se não existir
    // Adicionei a coluna 'ativo' (BOOLEAN/INTEGER) conforme seu frontend espera.
    const createTable = `
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT NOT NULL,
            address TEXT,
            city TEXT,
            state TEXT,
            zipCode TEXT,
            observations TEXT,
            ativo INTEGER DEFAULT 1, -- 1 para true, 0 para false
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.exec(createTable);
    
    // Configura a instância e retorna
    dbInstance = db;
    return dbInstance;
}

// Exporta a função para ser usada no databaseHandlers.js
module.exports = { initializeDatabase };