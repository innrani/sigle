// src/types/index.ts

// Tipo do cliente retornado pelo banco de dados (SQLite)
export interface Client {
  id: string; // Gerado pelo DB
  name: string;
  phone: string;
  email: string | null; // Tipagem para NULL
  cpf: string | null;
  address: string | null;
  city: string | null;
  state: string | null;  
  observations: string | null; // Incluído com base no DB
  is_active: boolean; // Se o DB não tiver essa coluna, ajuste.
  created_at: string; // Gerado pelo DB
  updated_at: string; // Gerado pelo DB
}

// Tipo de dados enviados para a rota 'add-client' (sem ID e campos automáticos)
export type NewClient = Omit<Client, 'id' | 'is_active' | 'created_at' | 'updated_at'> & {
    // Garante que os campos opcionais que o DB espera estejam presentes
    // e podem ser strings ou null, pois o formulário irá mapear "" para null
    email: string | null;     
    address: string | null;
    city: string | null;
    state: string | null;    
    observations: string | null;
};

// Technician type
export interface Technician {
  id: string;
  name: string;
  phone?: string;
  specialty?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

// Equipment type (simple unified model)
export interface Equipment {
  id: string;
  device: string;
  brand: string;
  model: string;
  serialNumber?: string;
  notes?: string;
  isActive?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Part {
  id: string;
  type?: string;
  name: string;
  description?: string;
  quantity: number;
  unit?: string;
  price?: number;
  isActive?: boolean;
}

// Tipo de dados enviados para cadastro (sem ID e campos automáticos)
export type NewEquipment = Omit<Equipment, 'id' | 'isActive' | 'created_at' | 'updated_at'>;


export type PageType = "main" | "clients" | "parts" | "equipments";
