import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analyticsService';
import { Filter, TrendingDown, TrendingUp, Info, ArrowRight } from 'lucide-react';

interface ConversionFunnelProps {
  className?: string;
}

interface FunnelStep {
  name: string;
  count: number;
  dropoff: number;
  conversionRate: number;
}

export const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ 
  className = '' 
}) => {
  const { getCurrentDeviceCards } = useStore();
  
  const cards = getCurrentDeviceCards();
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([
    { name: 'Vues de page', count: 1000, dropoff: 200, conversionRate: 100 },
    { name: 'Clics sur carte', count: 800, dropoff: 300, conversionRate: 80 },
    { name: 'Visites site externe', count: 500, dropoff: 350, conversionRate: 50 },
    { name: 'Conversion', count: 150, dropoff: 0, conversionRate: 15 }
  ]);
  
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Filter size={20} className="text-indigo-400" />
          Entonnoir de conversion
        </h3>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <Info size={16} className="text-gray-400" />
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
          >
            <p className="text-sm text-gray-300">
              L'entonnoir de conversion montre comment les visiteurs progressent à travers votre site, 
              depuis la vue initiale jusqu'à la conversion finale. Chaque étape montre le nombre de 
              visiteurs et le taux de conversion par rapport à l'étape précédente.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-2">
        {funnelData.map((step, index) => {
          const nextStep = index < funnelData.length - 1 ? funnelData[index + 1] : null;
          const stepWidth = `${step.conversionRate}%`;
          const isLastStep = index === funnelData.length - 1;
          
          return (
            <React.Fragment key={index}>
              <div className="relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stepWidth }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className={`h-12 rounded-lg ${
                    index === 0 ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                    index === 1 ? 'bg-gradient-to-r from-indigo-500 to-purple-600' :
                    index === 2 ? 'bg-gradient-to-r from-purple-500 to-pink-600' :
                    'bg-gradient-to-r from-pink-500 to-rose-600'
                  }`}
                />
                
                <div className="absolute inset-y-0 left-0 flex items-center px-4 text-white font-medium">
                  {step.name}
                </div>
                
                <div className="absolute inset-y-0 right-0 flex items-center px-4">
                  <span className="text-white font-bold">{step.count.toLocaleString()}</span>
                  {index > 0 && (
                    <span className="ml-2 text-xs">
                      ({step.conversionRate}%)
                    </span>
                  )}
                </div>
              </div>
              
              {!isLastStep && (
                <div className="flex items-center justify-between px-4 h-6">
                  <div className="flex items-center text-xs">
                    <TrendingDown size={12} className="text-red-400 mr-1" />
                    <span className="text-red-400">-{step.dropoff} ({((step.dropoff / step.count) * 100).toFixed(1)}%)</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-indigo-400">
                    <ArrowRight size={12} />
                    <span>Étape suivante</span>
                  </div>
                  
                  <div className="flex items-center text-xs">
                    <TrendingUp size={12} className="text-green-400 mr-1" />
                    <span className="text-green-400">{nextStep?.count} ({((nextStep?.count || 0) / step.count * 100).toFixed(1)}%)</span>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <div>Taux de conversion global: <span className="text-green-400 font-medium">15%</span></div>
        <div>Abandon total: <span className="text-red-400 font-medium">85%</span></div>
      </div>
    </div>
  );
};