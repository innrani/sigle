import { Client } from "@/types"; 

export const STORAGE_KEYS = {
    CLIENTS: "sigle_clients",    
};

const MOCK_CLIENTS: Client[] = [
    {
        id: "c1",
        name: "João Silva",
        phone: "(11) 98765-4321",
        email: "joao.silva@exemplo.com",
        cpf: "123.456.789-00",
        address: "Rua das Flores, 100",
        city: "São Paulo",
        state: "SP",
        ativo: true,
    },
    {
        id: "c2",
        name: "Maria Oliveira",
        phone: "(21) 99999-8888",
        email: "maria.oliver@exemplo.com",
        cpf: "987.654.321-00",
        address: "Avenida Principal, 50",
        city: "Rio de Janeiro",
        state: "RJ",
        ativo: true,
    },
    {
        id: "c3",
        name: "Pedro Souza (Inativo)",
        phone: "(31) 91111-0000",
        email: "pedro@exemplo.com",
        cpf: "444.555.666-77",
        address: "Rua Secreta, 1",
        city: "Belo Horizonte",
        state: "MG",
        ativo: false,
    },
];

export const initialClients: Client[] = MOCK_CLIENTS;