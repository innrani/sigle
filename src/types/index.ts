// src/types/index.ts

// Tipo do cliente retornado pelo banco de dados (SQLite)
export interface Client {
  id: string; // Gerado pelo DB
  name: string;
  phone: string;
  email: string | null; // Tipagem para NULL
  cpf: string | null;   // Tipagem para NULL
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null; // Incluído com base no DB
  observations: string | null; // Incluído com base no DB
  ativo: boolean; // Se o DB não tiver essa coluna, ajuste.
  createdAt: string; // Gerado pelo DB
  updatedAt: string; // Gerado pelo DB
}

// Tipo de dados enviados para a rota 'add-client' (sem ID e campos automáticos)
export type NewClient = Omit<Client, 'id' | 'ativo' | 'createdAt' | 'updatedAt'> & {
    // Garante que os campos opcionais que o DB espera estejam presentes
    // e podem ser strings ou null, pois o formulário irá mapear "" para null
    email: string | null; 
    cpf: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    observations: string | null;
};

export type PageType = "main" | "history" | "clients" | "parts" | "warranties" | "budgets" | "invoices" | "print-os";