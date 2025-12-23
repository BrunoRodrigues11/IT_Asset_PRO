export type EquipmentType = 'Notebook' | 'Desktop' | 'Mini PC';
export type PeripheralType = 'Mouse' | 'Teclado' | 'Headset';

export type EquipmentSite = 
  | 'estoque físico' 
  | 'estoque reservado área' 
  | 'rollout – cascata' 
  | 'rollout – estoque';

export type PeripheralState = 'novo' | 'usado';

export interface Equipment {
  id: string;
  ri: string; // Patrimônio
  marca: string;
  modelo: string;
  serialNumber: string; // N/S
  status: 'estoque'; // Always fixed
  site: EquipmentSite;
  localizacao: 'em estoque – TI'; // Always fixed
  type: EquipmentType;
  obs?: string;
}

export interface Peripheral {
  id: string;
  ri: string; // Patrimônio
  marca: string;
  modelo: string;
  serialNumber: string; // N/S
  status: 'estoque'; // Always fixed
  site: 'estoque – periféricos'; // Always fixed
  localizacao: 'em estoque – TI'; // Always fixed
  estado: PeripheralState;
  type: PeripheralType;
  obs?: string;
}

export type ViewState = 'dashboard' | 'equipments' | 'peripherals' | 'import' | 'analytics' | 'reports';