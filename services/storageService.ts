import { Equipment, Peripheral } from "../types";

const EQ_KEY = 'ti_inventory_equipments';
const PER_KEY = 'ti_inventory_peripherals';

export const getEquipments = (): Equipment[] => {
  const data = localStorage.getItem(EQ_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveEquipments = (data: Equipment[]) => {
  localStorage.setItem(EQ_KEY, JSON.stringify(data));
};

export const getPeripherals = (): Peripheral[] => {
  const data = localStorage.getItem(PER_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePeripherals = (data: Peripheral[]) => {
  localStorage.setItem(PER_KEY, JSON.stringify(data));
};
