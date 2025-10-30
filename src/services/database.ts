// Lightweight DatabaseService mock that falls back to IPC when available.
// It seeds mock data into localStorage for development so the UI works without Electron.

import type { Client, NewClient, Equipment, NewEquipment, Part as PartType } from "../types";

const ipcRenderer = (window as any).require && (window as any).require('electron')?.ipcRenderer;

// Helper: localStorage-backed store
function storageKey(key: string) { return `sigle:${key}`; }
function readStore<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(storageKey(key));
        if (!raw) return fallback;
        return JSON.parse(raw) as T;
    } catch (e) {
        console.error('readStore error', e);
        return fallback;
    }
}
function writeStore<T>(key: string, value: T) {
    try { localStorage.setItem(storageKey(key), JSON.stringify(value)); } catch (e) { console.error('writeStore error', e); }
}

// Seed data (only if empty)
function seedIfEmpty() {
    if (!localStorage.getItem(storageKey('clients'))) {
        const now = new Date().toISOString();
        const clients: Client[] = [
            { id: 'c1', name: 'Escola Municipal Centro', phone: '7199999-0001', email: 'escola.centro@edu.ba.gov.br', cpf: null, address: 'Av. Central, 500', city: 'Salvador', state: 'BA', observations: 'Projetor da sala 12', is_active: true, created_at: now, updated_at: now },
            { id: 'c2', name: 'Colégio Estadual Norte', phone: '7199999-0002', email: 'colegio.norte@edu.ba.gov.br', cpf: null, address: 'Rua das Flores, 234', city: 'Feira de Santana', state: 'BA', observations: 'TV 55" da biblioteca', is_active: true, created_at: now, updated_at: now },
            { id: 'c3', name: 'Instituto Federal BA - Campus Salvador', phone: '7199999-0003', email: 'ifba.salvador@ifba.edu.br', cpf: null, address: 'Av. Araújo Pinho, 39', city: 'Salvador', state: 'BA', observations: 'Múltiplos projetores', is_active: true, created_at: now, updated_at: now },
        ];
        writeStore('clients', clients);
    }

    if (!localStorage.getItem(storageKey('parts'))) {
        const parts: PartType[] = [
            { id: 'p1', type: 'Lâmpada', name: 'Lâmpada de Projetor Epson', quantity: 15, unit: 'un', price: 450.0, isActive: true },
            { id: 'p2', type: 'Lâmpada', name: 'Lâmpada de Projetor Sony', quantity: 8, unit: 'un', price: 520.0, isActive: true },
            { id: 'p3', type: 'Cabo Flat', name: 'Cabo HDMI 2.0 - 3m', quantity: 25, unit: 'un', price: 35.0, isActive: true },
            { id: 'p4', type: 'Cabo Flat', name: 'Cabo VGA 5m', quantity: 12, unit: 'un', price: 25.0, isActive: true },
            { id: 'p5', type: 'Controle Remoto', name: 'Controle Remoto Universal TV', quantity: 10, unit: 'un', price: 45.0, isActive: true },
            { id: 'p6', type: 'Placa T-CON', name: 'Placa T-CON TV LG 55"', quantity: 3, unit: 'un', price: 280.0, isActive: true },
            { id: 'p7', type: 'Fonte', name: 'Fonte TV Samsung 32"', quantity: 5, unit: 'un', price: 180.0, isActive: true },
            { id: 'p8', type: 'Cooler/Ventilador', name: 'Ventilador Projetor BenQ', quantity: 4, unit: 'un', price: 95.0, isActive: true },
        ];
        writeStore('parts', parts);
    }

    if (!localStorage.getItem(storageKey('equipments'))) {
        const equipments: Equipment[] = [
            { id: '1', device: 'Projetor', brand: 'Epson', model: 'PowerLite X49', serialNumber: 'EP20230001', notes: 'Lâmpada queimada', isActive: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '2', device: 'TV LED', brand: 'Samsung', model: 'UN55TU8000', serialNumber: 'SM20230045', notes: 'Tela com manchas', isActive: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '3', device: 'Projetor', brand: 'BenQ', model: 'MH535FHD', serialNumber: 'BQ20230012', notes: 'Ventilador com ruído', isActive: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '4', device: 'TV LED', brand: 'LG', model: '43UN7300PSC', serialNumber: 'LG20230089', notes: 'Sem imagem, com som', isActive: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
            { id: '5', device: 'Projetor', brand: 'Sony', model: 'VPL-DX221', serialNumber: 'SN20230033', notes: 'Não liga', isActive: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ];
        writeStore('equipments', equipments);
    }

    if (!localStorage.getItem(storageKey('technicians'))) {
        const techs = [
            { id: 't1', name: 'Roberto Silva', phone: '7191234-5001', specialty: 'Projetores e TVs', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), is_active: true },
            { id: 't2', name: 'Ana Costa', phone: '7191234-5002', specialty: 'Eletrônica de Áudio/Vídeo', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), is_active: true },
            { id: 't3', name: 'Pedro Martins', phone: '7191234-5003', specialty: 'Manutenção de Projetores', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), is_active: true },
        ];
        writeStore('technicians', techs);
    }
}

seedIfEmpty();

export interface Client {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  cpf?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const STORAGE_KEYS = {
  CLIENTS: "sigle_clients_v1",
};

function uid() {
  // fallback simple id generator
  return (Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
}

function loadClients(): Client[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CLIENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveClients(clients: Client[]) {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
}

export const DatabaseService = {
  // Parts
  createPart: async (part: any) => {
    if (ipcRenderer) return ipcRenderer.invoke('create-part', part);
    const list = readStore<any[]>('parts', []);
    const id = `p${Date.now()}`;
    const item = { id, ...part };
    list.push(item);
    writeStore('parts', list);
    return item;
  },
  listParts: async () => {
    if (ipcRenderer) return ipcRenderer.invoke('list-parts');
    return readStore<any[]>('parts', []);
  },
  updatePart: async (part: any) => {
    if (ipcRenderer) return ipcRenderer.invoke('update-part', part);
    const list = readStore<any[]>('parts', []);
    const idx = list.findIndex((p) => p.id === part.id);
    if (idx !== -1) list[idx] = part;
    writeStore('parts', list);
    return part;
  },
  deletePart: async (id: string) => {
    if (ipcRenderer) return ipcRenderer.invoke('delete-part', id);
    let list = readStore<any[]>('parts', []);
    list = list.filter((p) => p.id !== id);
    writeStore('parts', list);
    return { success: true, message: 'deleted' };
  },

  // Clients
  listClients: async () => {
    if (ipcRenderer) return ipcRenderer.invoke('list-clients');
    const clients = readStore<Client[]>('clients', []);
    return clients.filter((c) => c.is_active);
  },
  listAllClients: async () => {
    if (ipcRenderer) return ipcRenderer.invoke('list-all-clients');
    return readStore<Client[]>('clients', []);
  },
  reactivateClient: async (id: string) => {
    if (ipcRenderer) return ipcRenderer.invoke('reactivate-client', id);
    const clients = readStore<Client[]>('clients', []);
    const idx = clients.findIndex((c) => c.id === id);
    if (idx !== -1) { clients[idx].is_active = true; writeStore('clients', clients); return { success: true, message: 'reactivated' }; }
    return { success: false, message: 'not found' };
  },
  addClient: async (client: NewClient) => {
    if (ipcRenderer) return ipcRenderer.invoke('add-client', client);
    const list = readStore<Client[]>('clients', []);
    const id = `c${Date.now()}`;
    const now = new Date().toISOString();
    const newC: Client = { id, ...client, is_active: true, created_at: now, updated_at: now } as any;
    list.push(newC);
    writeStore('clients', list);
    return newC;
  },
  updateClient: async (client: Client) => {
    if (ipcRenderer) return ipcRenderer.invoke('update-client', client);
    const list = readStore<Client[]>('clients', []);
    const idx = list.findIndex((c) => c.id === client.id);
    if (idx !== -1) list[idx] = client;
    writeStore('clients', list);
    return client;
  },
  deleteClient: async (id: string) => {
    if (ipcRenderer) return ipcRenderer.invoke('delete-client', id);
    let list = readStore<Client[]>('clients', []);
    list = list.map((c) => c.id === id ? { ...c, is_active: false } : c);
    writeStore('clients', list);
    return { type: 'soft', message: 'inactivated' };
  },
  getClient: async (id: string) => {
    if (ipcRenderer) return ipcRenderer.invoke('get-client', id);
    const list = readStore<Client[]>('clients', []);
    return list.find((c) => c.id === id) as Client;
  },

  // Equipments
  addEquipment: async (equipment: NewEquipment) => {
    if (ipcRenderer) return ipcRenderer.invoke('add-equipment', equipment);
    const list = readStore<any[]>('equipments', []);
    const id = `${Date.now()}`;
    const now = new Date().toISOString();
    const item = { id, ...equipment, created_at: now, updated_at: now } as any;
    list.push(item);
    writeStore('equipments', list);
    return item;
  },
  listActiveEquipments: async () => {
    if (ipcRenderer) return ipcRenderer.invoke('list-active-equipments');
    const list = readStore<any[]>('equipments', []);
    return list.filter((e) => e.isActive);
  },
  listAllEquipments: async () => {
    if (ipcRenderer) return ipcRenderer.invoke('list-all-equipments');
    return readStore<any[]>('equipments', []);
  },
  deleteEquipment: async (equipment_id: number) => {
    if (ipcRenderer) return ipcRenderer.invoke('delete-equipment', equipment_id);
    let list = readStore<any[]>('equipments', []);
    list = list.map((e) => e.id === String(equipment_id) ? { ...e, isActive: false } : e);
    writeStore('equipments', list);
    return { type: 'soft', message: 'inactivated' };
  },
  reactivateEquipment: async (equipment_id: number) => {
    if (ipcRenderer) return ipcRenderer.invoke('reactivate-equipment', equipment_id);
    const list = readStore<any[]>('equipments', []);
    const idx = list.findIndex((e) => e.id === String(equipment_id));
    if (idx !== -1) { list[idx].isActive = true; writeStore('equipments', list); return { success: true, message: 'reactivated' }; }
    return { success: false, message: 'not found' };
  },

  // Technicians
  createTechnician: async (technician: any) => {
    if (ipcRenderer) return ipcRenderer.invoke('create-technician', technician);
    const list = readStore<any[]>('technicians', []);
    const id = `t${Date.now()}`;
    const now = new Date().toISOString();
    const item = { id, ...technician, created_at: now, updated_at: now, is_active: true } as any;
    list.push(item);
    writeStore('technicians', list);
    return item;
  },
  listTechnicians: async () => {
    if (ipcRenderer) return ipcRenderer.invoke('list-technicians');
    return readStore<any[]>('technicians', []);
  },
  updateTechnician: async (technician: any) => {
    if (ipcRenderer) return ipcRenderer.invoke('update-technician', technician);
    const list = readStore<any[]>('technicians', []);
    const idx = list.findIndex((t) => t.id === technician.id);
    if (idx !== -1) list[idx] = technician;
    writeStore('technicians', list);
    return technician;
  },
  deleteTechnician: async (id: string) => {
    if (ipcRenderer) return ipcRenderer.invoke('delete-technician', id);
    let list = readStore<any[]>('technicians', []);
    list = list.filter((t) => t.id !== id);
    writeStore('technicians', list);
    return { success: true, message: 'deleted' };
  },
};