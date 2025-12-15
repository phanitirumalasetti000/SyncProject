import React, { useEffect, useState } from 'react';
import { Plant, CareTipResponse } from '../types';
import { getPlantCareAdvice } from '../services/geminiService';
import { X, Sun, Droplet, Sprout, Thermometer, Loader2, Sparkles } from 'lucide-react';

interface AICareModalProps {
  plant: Plant | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AICareModal: React.FC<AICareModalProps> = ({ plant, isOpen, onClose }) => {
  const [advice, setAdvice] = useState<CareTipResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && plant) {
      setLoading(true);
      setAdvice(null);
      getPlantCareAdvice(plant.name)
        .then(setAdvice)
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, plant]);

  if (!isOpen || !plant) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
            <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-1 transition-colors"
            >
                <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-2">
                <Sparkles className="text-yellow-300" />
                <h2 className="text-xl font-bold">Gemini Plant Expert</h2>
            </div>
            <h3 className="text-2xl font-semibold">{plant.name}</h3>
            {plant.scientificName && <p className="text-indigo-100 italic">{plant.scientificName}</p>}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-indigo-600">
              <Loader2 className="animate-spin mb-4" size={48} />
              <p className="text-gray-500 font-medium animate-pulse">Asking Gemini for care tips...</p>
            </div>
          ) : advice ? (
            <div className="space-y-6">
              <p className="text-gray-700 italic border-l-4 border-indigo-500 pl-4 bg-gray-50 py-2 rounded-r">
                "{advice.summary}"
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 text-orange-700 font-semibold mb-2">
                        <Sun size={18} /> Light
                    </div>
                    <p className="text-sm text-gray-700">{advice.light}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                        <Droplet size={18} /> Water
                    </div>
                    <p className="text-sm text-gray-700">{advice.water}</p>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                    <div className="flex items-center gap-2 text-stone-700 font-semibold mb-2">
                        <Sprout size={18} /> Soil
                    </div>
                    <p className="text-sm text-gray-700">{advice.soil}</p>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
                        <Thermometer size={18} /> Temp
                    </div>
                    <p className="text-sm text-gray-700">{advice.temperature}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
                Unable to load advice. Please try again.
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-4 flex justify-end">
            <button 
                onClick={onClose}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
