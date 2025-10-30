// Part Types
export const PART_TYPES = [
  'Barra de LED',
  'Capacitor',
  'Fonte',
  'Placa Principal',
  'Placa de Internet',
  'Lâmpada',
  'Placa T-CON',
  'Placa LVDS',
  'Inverter',
  'Backlight',
  'Tela LCD',
  'Cooler/Ventilador',
  'Lente Projetor',
  'DMD (Chip DLP)',
  'Controle Remoto',
  'Cabo Flat',
  'Transistor',
  'CI (Circuito Integrado)',
  'Transformador',
  'Resistor',
  'Diodo',
  'Fusível'
] as const;

export type PartType = typeof PART_TYPES[number];

// Part Status
export const PART_STATUS = {
  TO_ORDER: 'to-order',
  ORDERED: 'ordered',
  DELIVERED: 'delivered',
  INSTALLED: 'installed',
  CANCELED: 'canceled'
} as const;

export type PartStatus = typeof PART_STATUS[keyof typeof PART_STATUS];


export const UNITS = [
  'un', // unidade
  'pc', // peça
  'kg', // quilograma
  'g',  // grama
  'l',  // litro
  'ml', // mililitro
  'm',  // metro
  'cm', // centímetro
  'mm', // milímetro
  'm²', // metro quadrado
  'm³', // metro cúbico
  'par', // par
  'cj'  // conjunto
] as const;

export type Unit = typeof UNITS[number];

// Service Order Status
export const SERVICE_ORDER_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELED: 'canceled'
} as const;

export type ServiceOrderStatus = typeof SERVICE_ORDER_STATUS[keyof typeof SERVICE_ORDER_STATUS];