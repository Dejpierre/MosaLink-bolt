import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analyticsService';
import { MapPin, Globe, Maximize2, Minimize2 } from 'lucide-react';

interface GeographicMapProps {
  className?: string;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

interface CountryData {
  country: string;
  count: number;
  percentage: number;
  color: string;
}

export const GeographicMap: React.FC<GeographicMapProps> = ({ 
  className = '',
  fullscreen = false,
  onToggleFullscreen
}) => {
  const { userPlan } = useStore();
  
  // Demo data for geographic distribution
  const [countryData, setCountryData] = useState<CountryData[]>([
    { country: 'France', count: 450, percentage: 45, color: '#4f46e5' },
    { country: 'Canada', count: 200, percentage: 20, color: '#7c3aed' },
    { country: 'Belgique', count: 150, percentage: 15, color: '#8b5cf6' },
    { country: 'Suisse', count: 100, percentage: 10, color: '#a78bfa' },
    { country: 'Autres', count: 100, percentage: 10, color: '#c4b5fd' }
  ]);

  return (
    <div className={`${className} ${fullscreen ? 'fixed inset-0 z-50 bg-gray-900/95 p-8 flex flex-col' : ''}`}>
      {!fullscreen && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Globe size={20} className="text-emerald-400" />
            Répartition géographique
          </h3>
          
          {onToggleFullscreen && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggleFullscreen}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Maximize2 size={16} />
            </motion.button>
          )}
        </div>
      )}
      
      {fullscreen && onToggleFullscreen && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Globe size={24} className="text-emerald-400" />
            Répartition géographique
          </h3>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <Minimize2 size={20} />
          </motion.button>
        </div>
      )}
      
      <div className={`grid grid-cols-1 ${fullscreen ? 'lg:grid-cols-2 gap-8 flex-grow' : 'gap-4'}`}>
        {/* World Map Visualization (simplified for demo) */}
        <div className={`bg-gray-900/50 rounded-xl border border-white/10 overflow-hidden ${fullscreen ? 'p-8 flex items-center justify-center' : 'p-4'}`}>
          <div className="relative w-full h-full">
            {/* This would be a real map in production */}
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Globe size={fullscreen ? 80 : 40} className="mx-auto text-emerald-400 opacity-50 mb-4" />
                <p className="text-gray-400 text-sm">
                  Carte interactive disponible dans la version complète
                </p>
              </div>
            </div>
            
            {/* Sample map markers */}
            <motion.div 
              className="absolute top-1/4 left-1/4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <MapPin size={fullscreen ? 24 : 16} className="text-emerald-500" />
            </motion.div>
            
            <motion.div 
              className="absolute top-1/3 left-1/2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <MapPin size={fullscreen ? 20 : 14} className="text-emerald-500" />
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 left-1/3"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <MapPin size={fullscreen ? 16 : 12} className="text-emerald-500" />
            </motion.div>
          </div>
        </div>
        
        {/* Country breakdown */}
        <div className={`bg-gray-900/50 rounded-xl border border-white/10 ${fullscreen ? 'p-8' : 'p-4'}`}>
          <h4 className={`font-medium text-white mb-4 ${fullscreen ? 'text-xl' : 'text-base'}`}>
            Répartition par pays
          </h4>
          
          <div className="space-y-4">
            {countryData.map((country, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: country.color }}
                    />
                    <span className="text-white">{country.country}</span>
                  </div>
                  <div className="text-gray-300">
                    {country.count} <span className="text-xs text-gray-500">({country.percentage}%)</span>
                  </div>
                </div>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${country.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="h-2 rounded-full"
                  style={{ backgroundColor: country.color }}
                />
              </div>
            ))}
          </div>
          
          {fullscreen && (
            <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <h5 className="font-medium text-emerald-400 mb-2">Insights</h5>
              <p className="text-gray-300 text-sm">
                La majorité de vos visiteurs viennent de France (45%), suivis par le Canada (20%) et la Belgique (15%). 
                Envisagez d'optimiser votre contenu pour ces marchés ou d'explorer des opportunités d'expansion dans 
                d'autres régions.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {!fullscreen && (
        <div className="mt-2 text-xs text-gray-400">
          Visualisez d'où viennent vos visiteurs pour mieux cibler votre contenu.
        </div>
      )}
    </div>
  );
};