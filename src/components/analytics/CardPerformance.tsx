import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analyticsService';
import { 
  Target, 
  MousePointer, 
  Eye, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  SlidersHorizontal,
  Check,
  X
} from 'lucide-react';

interface CardPerformanceProps {
  className?: string;
}

interface CardPerformanceData {
  id: string;
  title: string;
  color: string;
  views: number;
  clicks: number;
  ctr: number; // Click-through rate
  trend: number; // Percentage change from previous period
}

export const CardPerformance: React.FC<CardPerformanceProps> = ({ 
  className = '' 
}) => {
  const { getCurrentDeviceCards } = useStore();
  
  const cards = getCurrentDeviceCards();
  const [performanceData, setPerformanceData] = useState<CardPerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'ctr' | 'clicks' | 'views'>('ctr');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    const loadPerformanceData = async () => {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would fetch actual card performance data
        // For demo purposes, we'll generate data based on the actual cards
        const demoData: CardPerformanceData[] = cards.map(card => ({
          id: card.id,
          title: card.title,
          color: card.backgroundColor,
          views: Math.floor(Math.random() * 500) + 50,
          clicks: Math.floor(Math.random() * 300) + 20,
          ctr: 0, // Will be calculated
          trend: (Math.random() * 40) - 20 // Random trend between -20% and +20%
        }));
        
        // Calculate CTR
        demoData.forEach(card => {
          card.ctr = card.views > 0 ? (card.clicks / card.views) * 100 : 0;
        });
        
        setPerformanceData(demoData);
      } catch (error) {
        console.error('Failed to load card performance data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPerformanceData();
  }, [cards]);
  
  // Filter and sort data
  const filteredAndSortedData = performanceData
    .filter(card => card.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      return (a[sortBy] - b[sortBy]) * multiplier;
    });
  
  const handleSort = (field: 'ctr' | 'clicks' | 'views') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target size={20} className="text-green-400" />
          Performance des cartes
        </h3>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <SlidersHorizontal size={16} className="text-gray-400" />
        </motion.button>
      </div>
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white/5 rounded-lg border border-white/10 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une carte..."
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-400 self-center">Trier par:</span>
                {[
                  { id: 'ctr', label: 'Taux de clic' },
                  { id: 'clicks', label: 'Clics' },
                  { id: 'views', label: 'Vues' }
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSort(option.id as any)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      sortBy === option.id
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-white/10 text-gray-400 border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {option.label}
                    {sortBy === option.id && (
                      <span className="ml-1">
                        {sortOrder === 'desc' ? '↓' : '↑'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-green-500/30 border-t-green-500 rounded-full"
          />
        </div>
      ) : filteredAndSortedData.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <Target size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-400">Aucune carte ne correspond à votre recherche</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredAndSortedData.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-gray-900/50 rounded-lg border border-white/10 hover:bg-gray-900/70 transition-all"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-12 rounded-full"
                  style={{ backgroundColor: card.color }}
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate">{card.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      <span>{card.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MousePointer size={12} />
                      <span>{card.clicks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-white">
                    {card.ctr.toFixed(1)}%
                  </div>
                  <div className={`flex items-center justify-end text-xs ${
                    card.trend > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {card.trend > 0 ? (
                      <ArrowUpRight size={12} />
                    ) : (
                      <ArrowDownRight size={12} />
                    )}
                    <span>{Math.abs(card.trend).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              {/* Progress bar for CTR */}
              <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, card.ctr * 2)}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.05 }}
                  className="h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs text-gray-400">
        <div>
          Moyenne CTR: <span className="text-green-400 font-medium">
            {(filteredAndSortedData.reduce((sum, card) => sum + card.ctr, 0) / filteredAndSortedData.length).toFixed(1)}%
          </span>
        </div>
        <div>
          {filteredAndSortedData.length} cartes • {filteredAndSortedData.reduce((sum, card) => sum + card.clicks, 0).toLocaleString()} clics totaux
        </div>
      </div>
    </div>
  );
};