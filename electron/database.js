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
            cpf TEXT UNIQUE NOT NULL,
            address TEXT,
            city TEXT,
            state TEXT,            
            observations TEXT,
            is_active INTEGER DEFAULT 1, 
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS service_types (
            type_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS payment_methods (
            method_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );
                
        CREATE TABLE IF NOT EXISTS equipment (
            equipment_id INTEGER PRIMARY KEY AUTOINCREMENT,
            serial_number TEXT NOT NULL,
            device_type TEXT NOT NULL,
            brand TEXT NOT NULL,
            model TEXT NOT NULL,            
            accessories TEXT NOT NULL,            
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS service_orders (
            order_number INTEGER PRIMARY KEY AUTOINCREMENT,
            client_id INTEGER NOT NULL,
            equipment_id INTEGER NOT NULL, 
            service_type_id INTEGER NOT NULL,
            payment_method_id INTEGER NOT NULL,
            total_value REAL NOT NULL,
            warranty_date DATE,
            is_active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (client_id) REFERENCES clients(id),
            FOREIGN KEY (equipment_id) REFERENCES equipment(equipment_id), 
            FOREIGN KEY (service_type_id) REFERENCES service_types(type_id),
            FOREIGN KEY (payment_method_id) REFERENCES payment_methods(method_id)
        );

        CREATE TABLE IF NOT EXISTS service_parts (
            order_number INTEGER,
            part_serial_number TEXT,
            PRIMARY KEY (order_number, part_serial_number),
            FOREIGN KEY (order_number) REFERENCES service_orders(order_number),
            FOREIGN KEY (part_serial_number) REFERENCES parts(serial_number)
        );
        
        
    `;

    db.exec(createTable);
    
    // Configura a instância e retorna
    dbInstance = db;
    return dbInstance;
}



// Exporta a função para ser usada no databaseHandlers.js
module.exports = { initializeDatabase };