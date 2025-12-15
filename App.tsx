import React, { useState, useEffect, useMemo } from 'react';
import { Plant, PlantCategory, FilterState } from './types';
import { getInventory, saveInventory } from './services/storageService';
import { PlantCard } from './components/PlantCard';
import { PlantForm } from './components/PlantForm';
import { AICareModal } from './components/AICareModal';
import { Search, Plus, Leaf, Sprout, Filter, Menu } from 'lucide-react';

const App: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | undefined>(undefined);
  
  // AI Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedPlantForAI, setSelectedPlantForAI] = useState<Plant | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'All'
  });

  // Load Data
  useEffect(() => {
    setPlants(getInventory());
    
    // Listen for storage events to sync across tabs
    const handleStorageChange = () => {
      setPlants(getInventory());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // CRUD Handlers
  const handleSavePlant = (plant: Plant) => {
    let updatedPlants;
    if (editingPlant) {
      updatedPlants = plants.map(p => p.id === plant.id ? plant : p);
    } else {
      updatedPlants = [plant, ...plants];
    }
    setPlants(updatedPlants);
    saveInventory(updatedPlants);
    setEditingPlant(undefined);
  };

  const handleDeletePlant = (id: string) => {
    if (window.confirm('Are you sure you want to remove this plant from inventory?')) {
      const updatedPlants = plants.filter(p => p.id !== id);
      setPlants(updatedPlants);
      saveInventory(updatedPlants);
    }
  };

  const handleEditInit = (plant: Plant) => {
    setEditingPlant(plant);
    setIsFormOpen(true);
  };

  const handleAIInit = (plant: Plant) => {
    setSelectedPlantForAI(plant);
    setIsAIModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPlant(undefined);
  };

  // Filter Logic
  const filteredPlants = useMemo(() => {
    return plants.filter(plant => {
      const matchesSearch = plant.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                            plant.scientificName?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'All' || plant.category === filters.category;
      return matchesSearch && matchesCategory;
    });
  }, [plants, filters]);

  // Statistics
  const totalItems = plants.reduce((acc, curr) => acc + curr.quantity, 0);
  const lowStockCount = plants.filter(p => p.quantity < 5).length;

  return (
    <div className="min-h-screen bg-green-50/50 font-sans text-slate-800">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-green-600 text-white p-2 rounded-lg">
                <Leaf size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-900 leading-none">Sri Veerabhadra</h1>
                <p className="text-xs text-green-600">Nursery Management</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                <div className="flex flex-col items-end">
                    <span className="font-bold text-gray-900">{plants.length}</span>
                    <span className="text-xs">Varieties</span>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="flex flex-col items-end">
                    <span className="font-bold text-gray-900">{totalItems}</span>
                    <span className="text-xs">Total Stock</span>
                </div>
                 <div className="h-8 w-px bg-gray-200"></div>
                 <div className="flex flex-col items-end">
                    <span className={`font-bold ${lowStockCount > 0 ? 'text-red-500' : 'text-green-500'}`}>{lowStockCount}</span>
                    <span className="text-xs">Low Stock</span>
                </div>
            </div>

            <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-green-200 shadow-lg active:scale-95"
            >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Plant</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search plants..." 
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-green-500 bg-white"
                />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <button 
                    onClick={() => setFilters({...filters, category: 'All'})}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filters.category === 'All' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-green-50'}`}
                >
                    All Plants
                </button>
                {Object.values(PlantCategory).map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setFilters({...filters, category: cat})}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filters.category === cat ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-green-50'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Grid */}
        {filteredPlants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.map(plant => (
                <PlantCard 
                    key={plant.id} 
                    plant={plant} 
                    onEdit={handleEditInit}
                    onDelete={handleDeletePlant}
                    onGetAdvice={handleAIInit}
                />
            ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                    <Sprout size={48} className="text-green-300" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">No plants found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters.</p>
            </div>
        )}
      </main>

      {/* Modals */}
      <PlantForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm} 
        onSave={handleSavePlant}
        initialData={editingPlant}
      />

      <AICareModal 
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        plant={selectedPlantForAI}
      />

    </div>
  );
};

export default App;