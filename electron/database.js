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
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT NOT NULL,
            cpf TEXT UNIQUE NOT NULL,
            address TEXT,
            city TEXT,
            state TEXT,
            zipCode TEXT,
            observations TEXT,
            ativo INTEGER DEFAULT 1, 
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tipoServico (
            idTipoServico INTEGER PRIMARY KEY AUTOINCREMENT,
            tipoServico TEXT NOT NULL,
            ativo INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS formaPagamento (
            idFormaPagamento INTEGER PRIMARY KEY AUTOINCREMENT,
            formaPagamento TEXT NOT NULL,
            ativo INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS equipamento (
            numeroSerie TEXT PRIMARY KEY,
            tipoAparelho TEXT NOT NULL,
            marca TEXT,
            modelo TEXT,
            corAparelho TEXT,
            acessorios TEXT,
            problemaRelatado TEXT,
            ativo INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS peca (
            numeroSerie TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            tipoPeca TEXT,
            ativo INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS estoque (
            idEstoque INTEGER PRIMARY KEY AUTOINCREMENT,
            numeroSeriePeca TEXT NOT NULL,
            quantidade INTEGER NOT NULL,
            valor REAL NOT NULL,
            dataEntrada DATE,
            FOREIGN KEY (numeroSeriePeca) REFERENCES Peca(numeroSerie)
        );

        CREATE TABLE IF NOT EXISTS servico (
            numeroOS INTEGER PRIMARY KEY AUTOINCREMENT,
            clientId INTEGER NOT NULL, -- NOVO: Referencia o ID do cliente
            numeroSerieEquipamento TEXT NOT NULL,
            idTipoServico INTEGER NOT NULL,
            idFormaPagamento INTEGER NOT NULL,
            valor REAL NOT NULL,
            dataGarantia DATE,
            ativo INTEGER DEFAULT 1,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (clientId) REFERENCES clientes(id), -- REFERENCIA O ID
            FOREIGN KEY (numeroSerieEquipamento) REFERENCES equipamento(numeroSerie),
            FOREIGN KEY (idTipoServico) REFERENCES tipoServico(idTipoServico),
            FOREIGN KEY (idFormaPagamento) REFERENCES formaPagamento(idFormaPagamento)
        );

        CREATE TABLE IF NOT EXISTS servico_Peca (
            numeroOS INTEGER,
            numeroSeriePeca TEXT,
            PRIMARY KEY (numeroOS, numeroSeriePeca),
            FOREIGN KEY (numeroOS) REFERENCES Servico(numeroOS),
            FOREIGN KEY (numeroSeriePeca) REFERENCES Peca(numeroSerie)
        );
        
        
    `;

    db.exec(createTable);
    
    // Configura a instância e retorna
    dbInstance = db;
    return dbInstance;
}



// Exporta a função para ser usada no databaseHandlers.js
module.exports = { initializeDatabase };