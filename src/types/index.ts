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

export interface Technician {
  id: string;
  name: string;
  phone?: string;
  specialty?: string;
  createdAt: string;
}

// Tipo para Equipamentos
export interface ServiceOrder {
  id: string;
  osNumber: string;
  clientId: string;
  clientName: string;
  technicianId: string;
  technicianName: string;
  createdByTechnicianId?: string;  // Flag: ID do técnico que criou a O.S (para rastreamento)
  device: string;
  brand: string;
  model: string;
  serialNumber?: string;           
  color?: string;                 
  observations?: string;
  defect: string;
  accessories?: string;
  priority?: "normal" | "urgent" | "low";
  entryDate?: string;
  status: "pending" | "in-progress" | "waiting-parts" | "completed" | "cancelled";
     
  
  paymentMethod?: "cash" | "card" | "pix" | "transfer";
  paymentAmount?: string;
  completionDate?: string;        // When the repair was completed
  deliveryDate?: string;           // When delivered to client
  
  // Warranty fields

  warrantyStartDate?: string;      // Date when warranty starts (delivery date)
  warrantyEndDate?: string;        // Warranty end date (3 months after start)
  warrantyMonths?: number;         // Number of months (default 3)
  
  
  
  isActive: boolean; // ativo -> isActive
    createdAt: string; 
    updatedAt: string;
}


export interface Equipment {
  id: string;
  device: string;
  brand: string;
  model: string;
  serialNumber?: string;
  notes?: string;
  lastServiceDate?: string;
  totalServices: number;
}

export interface Part {
  id: string;
  name: string;
  osNumber: string;
  osDescription: string;
  quantity: number;
  unit: string;
  status: "arriving" | "to-order";
  urgent: boolean;
  price?: string;
  orderDate?: string;
  expectedDate?: string;
}

// Tipo de dados enviados para cadastro (sem ID e campos automáticos)
export type NewEquipment = Omit<Equipment, 'equipmentId' | 'isActive' | 'createdAt' | 'updatedAt'>;

export type PageType = "main" | "history" | "clients" | "equipments";