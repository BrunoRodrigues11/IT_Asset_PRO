import { EquipmentSite, EquipmentType, PeripheralState, PeripheralType } from "./types";

export const EQUIPMENT_TYPES: EquipmentType[] = ['Notebook', 'Desktop', 'Mini PC'];
export const PERIPHERAL_TYPES: PeripheralType[] = ['Mouse', 'Teclado', 'Headset'];

export const EQUIPMENT_SITES: EquipmentSite[] = [
  'estoque físico',
  'estoque reservado área',
  'rollout – cascata',
  'rollout – estoque'
];

export const PERIPHERAL_STATES: PeripheralState[] = ['novo', 'usado'];

// Fixed values required by the prompt
export const FIXED_STATUS = 'estoque';
export const FIXED_LOCATION = 'em estoque – TI';
export const FIXED_PERIPHERAL_SITE = 'estoque – periféricos';
