import React from 'react';
import { Plant, PlantCategory } from '../types';
import { Package, Info, Edit, Trash2 } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
  onEdit: (plant: Plant) => void;
  onDelete: (id: string) => void;
  onGetAdvice: (plant: Plant) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onEdit, onDelete, onGetAdvice }) => {
  const getCategoryColor = (cat: PlantCategory) => {
    switch (cat) {
      case PlantCategory.INDOOR: return 'bg-teal-100 text-teal-800';
      case PlantCategory.FRUIT: return 'bg-orange-100 text-orange-800';
      case PlantCategory.FLOWER: return 'bg-pink-100 text-pink-800';
      case PlantCategory.AQUATIC: return 'bg-cyan-100 text-cyan-800';
      case PlantCategory.AVENUE: return 'bg-green-100 text-green-800';
      case PlantCategory.SHRUB: return 'bg-lime-100 text-lime-800';
      case PlantCategory.GROUNDCOVER: return 'bg-stone-100 text-stone-800';
      case PlantCategory.CREEPER: return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full border border-gray-100">
      <div className="relative h-48 overflow-hidden group">
        <img 
          src={plant.imageUrl} 
          alt={plant.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 flex gap-2">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(plant.category)}`}>
              {plant.category}
            </span>
        </div>
        {plant.quantity < 5 && (
            <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                Low Stock
            </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{plant.name}</h3>
            <p className="text-xs text-gray-500 italic">{plant.scientificName}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">{plant.description || "No description available."}</p>

        <div className="flex items-center justify-between text-sm text-gray-700 mb-4 bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center gap-1">
            <Package size={16} className="text-blue-500" />
            <span className={plant.quantity === 0 ? "text-red-500 font-bold" : ""}>
               Qty: {plant.quantity}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-100">
            <button 
                onClick={() => onGetAdvice(plant)}
                className="flex-1 flex items-center justify-center gap-1 bg-indigo-50 text-indigo-700 py-2 px-3 rounded-lg text-sm hover:bg-indigo-100 transition-colors"
            >
                <Info size={16} />
                <span className="hidden sm:inline">AI Care</span>
                <span className="sm:hidden">Care</span>
            </button>
            <button 
                onClick={() => onEdit(plant)}
                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
            >
                <Edit size={18} />
            </button>
            <button 
                onClick={() => onDelete(plant.id)}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
            >
                <Trash2 size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};