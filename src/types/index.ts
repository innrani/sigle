// src/types/index.ts

// Tipo do cliente retornado pelo banco de dados (SQLite)
export interface Client {
  id: string; // Gerado pelo DB
  name: string;
  phone: string;
  email: string | null; // Tipagem para NULL
  cpf: null;
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

// Tipo para Equipamentos
export interface Equipment {
    equipmentId: string; // idEquipamento -> equipmentId (no frontend é string)
    serialNumber: string; // numeroSerie -> serialNumber
    deviceType: string; // tipoAparelho -> deviceType
    brand: string; // marca -> brand
    model: string; // modelo -> model    
    accessories: string; // acessorios -> accessories            
    isActive: boolean; // ativo -> isActive
    createdAt: string; 
    updatedAt: string;
}

// Tipo de dados enviados para cadastro (sem ID e campos automáticos)
export type NewEquipment = Omit<Equipment, 'equipmentId' | 'isActive' | 'createdAt' | 'updatedAt'>;

export type PageType = "main" | "history" | "clients" | "equipments";