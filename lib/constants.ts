// Application constants and initial data

import type { Client, Appointment, Part } from "../types";

// LocalStorage keys
// TODO: MIGRAÇÃO PARA BD - Substituir localStorage por chamadas à API
// Exemplo: const clients = await db.clients.findMany()
// Manter STORAGE_KEYS para compatibilidade durante migração
export const STORAGE_KEYS = {
  CLIENTS: "sigle_clients",
  PARTS: "sigle_parts",
  APPOINTMENTS: "sigle_appointments",
  SERVICE_ORDERS: "sigle_service_orders",
  TECHNICIANS: "sigle_technicians",
  SETUP_COMPLETE: "sigle_setup_complete",
  ACTIVE_TECHNICIAN: "sigle_active_technician"  // ID do técnico atualmente operando
} as const;

// Fixed list of part types for TVs and Projectors
// TODO: MIGRAÇÃO PARA BD - Mover para tabela 'part_types' no banco de dados
// Exemplo de estrutura:
// CREATE TABLE part_types (
//   id UUID PRIMARY KEY,
//   name VARCHAR(100) NOT NULL,
//   category VARCHAR(50), -- 'tv' | 'projector' | 'both'
//   created_at TIMESTAMP DEFAULT NOW()
// );
export const PART_TYPES = [
  "Barra de LED",
  "Capacitor",
  "Fonte",
  "Placa Principal",
  "Placa de Internet",
  "Lâmpada",
  "Placa T-CON",
  "Placa LVDS",
  "Inverter",
  "Backlight",
  "Tela LCD",
  "Cooler/Ventilador",
  "Lente Projetor",
  "DMD (Chip DLP)",
  "Controle Remoto",
  "Cabo Flat",
  "Transistor",
  "CI (Circuito Integrado)",
  "Transformador",
  "Resistor",
  "Diodo",
  "Fusível"
] as const;

// Mock initial clients
export const initialClients: Client[] = [
  { id: "1", name: "Maria Souza", phone: "(11) 99999-9999", email: "maria@email.com" },
  { id: "2", name: "João Silva", phone: "(11) 98888-8888", email: "joao@email.com" },
  { id: "3", name: "Carlos Santos", phone: "(11) 97777-7777", email: "carlos@email.com" },
];

// Mock initial appointments
export const initialAppointments: Appointment[] = [
  {
    id: "1",
    name: "Maria Silva",
    time: "09:00",
    service: "Reparo TV",
    model: "Samsung 55\"",
    status: "in-progress",
    statusMessage: "Em andamento"
  },
  {
    id: "2",
    name: "João Santos",
    time: "10:30",
    service: "Manutenção",
    model: "LG 42\"",
    status: "waiting",
    statusMessage: "Aguardando peça"
  },
  {
    id: "3",
    name: "Ana Costa",
    time: "14:00",
    service: "Instalação",
    model: "Sony 50\"",
    status: "ready",
    statusMessage: "Pronto para retirada"
  },
];

// Mock initial parts
export const initialParts: Part[] = [
  {
    id: "1",
    name: "BARRA LED 37",
    osNumber: "1002",
    osDescription: "TV Samsung U8100F",
    quantity: 2,
    unit: "Samsung U8100F",
    status: "arriving",
    urgent: false,
    price: "R$ 150,00",
    orderDate: "05/10/2025",
    expectedDate: "12/10/2025"
  },
  {
    id: "2",
    name: "CAPACITOR 470uF",
    osNumber: "1005",
    osDescription: "LG 42LB5600",
    quantity: 3,
    unit: "LG 42LB5600",
    status: "arriving",
    urgent: true,
    price: "R$ 25,00",
    orderDate: "03/10/2025",
    expectedDate: "10/10/2025"
  },
  {
    id: "3",
    name: "BARRA LED 37",
    osNumber: "1002",
    osDescription: "TV Samsung U8100F",
    quantity: 1,
    unit: "Samsung U8100F",
    status: "to-order",
    urgent: false
  },
  {
    id: "4",
    name: "FONTE STANDY",
    osNumber: "1008",
    osDescription: "Sony KDL-32W655D",
    quantity: 1,
    unit: "Sony KDL-32W655D",
    status: "to-order",
    urgent: true,
    price: "R$ 180,00"
  },
];
