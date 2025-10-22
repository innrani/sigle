// src/services/database.ts

// Importa os tipos do local correto (ajuste o caminho se necessário)
import type { Client, NewClient } from "../types/index";

// Acessa o ipcRenderer via require global (necessário com nodeIntegration: true e contextIsolation: false)
const ipcRenderer = window.require && window.require('electron').ipcRenderer;

if (!ipcRenderer) {
    // Se o IPC não estiver disponível (ex: rodando apenas o Vite no navegador), loga um erro
    console.error("IPC Renderer não disponível. O código de comunicação com o Electron não funcionará.");
}

export const DatabaseService = {
    // Listar todos os clientes
    listClients: (): Promise<Client[]> => {
        if (!ipcRenderer) return Promise.resolve([]);
        return ipcRenderer.invoke('list-clients');
    },

    // NOVO: Listar todos os clientes (ativos e inativos)
    listAllClients: (): Promise<Client[]> => {
        if (!ipcRenderer) return Promise.resolve([]);
        // Invoca o novo handler que lista TODOS
        return ipcRenderer.invoke('list-all-clients');
    },

    // Reativar cliente inativo
    reactivateClient: (id: string): Promise<{ success: boolean; message: string }> => {
        if (!ipcRenderer) return Promise.reject("IPC indisponível");
        return ipcRenderer.invoke('reactivate-client', id);
    },

    // Adicionar novo cliente
    addClient: (client: NewClient): Promise<Client> => {
        if (!ipcRenderer) return Promise.reject("IPC indisponível");
        return ipcRenderer.invoke('add-client', client);
    },

    // Atualizar cliente
    updateClient: (client: Client): Promise<Client> => {
        if (!ipcRenderer) return Promise.reject("IPC indisponível");
        return ipcRenderer.invoke('update-client', client);
    },

    // Deletar cliente 
    deleteClient: (id: string): Promise<{ type: 'soft' | 'hard', message: string }> => {
        if (!ipcRenderer) return Promise.reject("IPC indisponível");
        // Recebe apenas o ID
        return ipcRenderer.invoke('delete-client', id);
    },
    // ...

    // Buscar cliente por ID
    getClient: (id: string): Promise<Client> => {
        if (!ipcRenderer) return Promise.reject("IPC indisponível");
        return ipcRenderer.invoke('get-client', id);
    }
};