// src/services/database.ts

// Importa os tipos do local correto
import type { Client, NewClient, Equipment, NewEquipment } from "../types/index";

// Acessa o ipcRenderer via require global 
const ipcRenderer = window.require && window.require('electron').ipcRenderer;

if (!ipcRenderer) {
    // Se o IPC não estiver disponível, loga um erro
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
    },

    // ------------------------------------
    // Funções para Equipamento
    // ------------------------------------

    // 1. Adicionar novo equipamento
    addEquipment: (equipment: NewEquipment): Promise<Equipment> => {
        if (!ipcRenderer) return Promise.reject("IPC indisponível");
        return ipcRenderer.invoke('add-equipment', equipment);
    },
    
    // 2. Listar apenas equipamentos ativos
    listActiveEquipments: (): Promise<Equipment[]> => {
        if (!ipcRenderer) return Promise.resolve([]);
        return ipcRenderer.invoke('list-active-equipments');
    },

    // 3. Listar TODOS os equipamentos (ativos e inativos)
    listAllEquipments: (): Promise<Equipment[]> => {
        if (!ipcRenderer) return Promise.resolve([]);
        return ipcRenderer.invoke('list-all-equipments');
    },

    // 4. Deletar/Inativar equipamento
    deleteEquipment: (equipment_id: number): Promise<{ type: 'soft' | 'hard', message: string }> => {
        if (!ipcRenderer) return Promise.reject("IPC indisponível");
        // O ID do equipamento é o PK da tabela
        return ipcRenderer.invoke('delete-equipment', equipment_id);
    },

    // 5. Reativar equipamento inativo
    reactivateEquipment: (equipment_id: number): Promise<{ success: boolean; message: string }> => {
        if (!ipcRenderer) return Promise.reject("IPC indisponível");
        return ipcRenderer.invoke('reactivate-equipment', equipment_id);
    }
};