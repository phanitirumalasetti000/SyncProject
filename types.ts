export enum PlantCategory {
  FRUIT = 'Fruit',
  FLOWER = 'Flower',
  INDOOR = 'Indoor',
  AQUATIC = 'Aquatic',
  AVENUE = 'Avenue',
  SHRUB = 'Shrub',
  GROUNDCOVER = 'Groundcover',
  CREEPER = 'Creeper'
}

export interface Plant {
  id: string;
  name: string;
  scientificName?: string;
  category: PlantCategory;
  quantity: number;
  imageUrl: string;
  description?: string;
  lastWatered?: string;
}

export interface CareTipResponse {
  light: string;
  water: string;
  soil: string;
  temperature: string;
  summary: string;
}

export interface FilterState {
  search: string;
  category: PlantCategory | 'All';
}