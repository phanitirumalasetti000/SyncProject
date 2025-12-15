import { Plant, PlantCategory } from "../types";

const STORAGE_KEY = 'veerabhadra_nursery_inventory';

/* 
  NOTE: To sync with Firebase in a production environment:
  1. Initialize Firebase App here.
  2. Replace getInventory with a Firestore onSnapshot listener.
  3. Replace saveInventory with Firestore addDoc/updateDoc calls.
*/

const INITIAL_DATA: Plant[] = [
  {
    id: '1',
    name: 'Mango Tree',
    scientificName: 'Mangifera indica',
    category: PlantCategory.FRUIT,
    quantity: 12,
    imageUrl: 'https://picsum.photos/id/292/400/400',
    description: 'The king of fruits, requires full sun and plenty of space.'
  },
  {
    id: '2',
    name: 'Lotus',
    scientificName: 'Nelumbo nucifera',
    category: PlantCategory.AQUATIC,
    quantity: 5,
    imageUrl: 'https://picsum.photos/id/106/400/400',
    description: 'Beautiful aquatic plant, perfect for ponds.'
  },
  {
    id: '3',
    name: 'Hibiscus',
    scientificName: 'Hibiscus rosa-sinensis',
    category: PlantCategory.FLOWER,
    quantity: 40,
    imageUrl: 'https://picsum.photos/id/306/400/400',
    description: 'Vibrant flowers, great for hedges and ornamental gardens.'
  },
  {
    id: '4',
    name: 'Snake Plant',
    scientificName: 'Dracaena trifasciata',
    category: PlantCategory.INDOOR,
    quantity: 22,
    imageUrl: 'https://picsum.photos/id/152/400/400',
    description: 'Extremely hardy indoor plant, great for low light.'
  },
  {
    id: '5',
    name: 'Gulmohar',
    scientificName: 'Delonix regia',
    category: PlantCategory.AVENUE,
    quantity: 8,
    imageUrl: 'https://picsum.photos/id/10/400/400',
    description: 'Flamboyant tree known for its fern-like leaves and flamboyant display of flowers.'
  }
];

export const getInventory = (): Plant[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(stored);
};

export const saveInventory = (plants: Plant[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
  // Simulate a sync event for other tabs/windows
  window.dispatchEvent(new Event('storage'));
};