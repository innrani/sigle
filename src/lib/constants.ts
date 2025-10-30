// Part Types - Específico para TVs e Projetores
export const PART_TYPES = [
  'Lâmpada',
  'Fonte',
  'Placa Principal',
  'Placa T-CON',
  'Placa LVDS',
  'Inverter',
  'Barra de LED',
  'Backlight',
  'Tela LCD',
  'Cooler/Ventilador',
  'Lente Projetor',
  'DMD (Chip DLP)',
  'Controle Remoto',
  'Cabo HDMI',
  'Cabo VGA',
  'Cabo Flat',
  'Capacitor',
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

// (Service order statuses removed)