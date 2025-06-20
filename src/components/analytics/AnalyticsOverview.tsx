import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { CardPerformance } from './CardPerformance';
import { DeviceBreakdown } from './DeviceBreakdown';
import { GeographicMap } from './GeographicMap';
import { ClickHeatmap } from './ClickHeatmap';
import { ConversionFunnel } from './ConversionFunnel';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Eye, 
  Calendar,
  Download,
  RefreshCw,
  Maximize2,
  Minimize2,
  Crown
} from 'lucide-react';

export const AnalyticsOverview: React.FC = () => {
  const { userPlan } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [fullscreenComponent, setFullscreenComponent] = useState<string | null>(null);
  
  const handleExportData = (format: 'csv' | 'json') => {
    analyticsService.exportData(format);
  };
  
  const toggleFullscreen = (componentId: string) => {
    setFullscreenComponent(fullscreenComponent === componentId ? null : componentId);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">
            Suivez les performances de votre grille et optimisez votre contenu
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1 p-1 bg-white/5 rounded-lg">
            {[
              { id: 'today', label: 'Aujourd\'hui' },
              { id: 'week', label: '7 jours' },
              { id: 'month', label: '30 jours' },
              { id: 'year', label: '1 an' }
            ].map((period) => (
              <motion.button
                key={period.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPeriod(period.id as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedPeriod === period.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {period.label}
              </motion.button>
            ))}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleExportData('csv')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Exporter
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Actualiser"
          >
            <RefreshCw size={16} />
          </motion.button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Eye size={24} className="text-blue-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">1,254</div>
              <div className="text-sm text-blue-400">Vues totales</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">vs période précédente</span>
            <span className="flex items-center text-green-400">
              <TrendingUp size={14} className="mr-1" />
              +12.5%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-green-500/20">
              <MousePointer size={24} className="text-green-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">687</div>
              <div className="text-sm text-green-400">Clics totaux</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">vs période précédente</span>
            <span className="flex items-center text-green-400">
              <TrendingUp size={14} className="mr-1" />
              +8.3%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Users size={24} className="text-purple-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">342</div>
              <div className="text-sm text-purple-400">Visiteurs uniques</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">vs période précédente</span>
            <span className="flex items-center text-green-400">
              <TrendingUp size={14} className="mr-1" />
              +15.2%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-orange-500/20">
              <BarChart3 size={24} className="text-orange-400" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">54.8%</div>
              <div className="text-sm text-orange-400">Taux de clic</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400">vs période précédente</span>
            <span className="flex items-center text-red-400">
              <TrendingUp size={14} className="mr-1 rotate-180" />
              -3.7%
            </span>
          </div>
        </motion.div>
      </div>
      
      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <CardPerformance />
      </div>
      
      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <DeviceBreakdown />
        
        {userPlan === 'pro' && (
          <ConversionFunnel />
        )}
      </div>
      
      {/* Pro Features */}
      {userPlan === 'pro' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ClickHeatmap 
            fullscreen={fullscreenComponent === 'heatmap'}
            onToggleFullscreen={() => toggleFullscreen('heatmap')}
          />
          
          <GeographicMap 
            fullscreen={fullscreenComponent === 'geomap'}
            onToggleFullscreen={() => toggleFullscreen('geomap')}
          />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20">
              <Crown size={24} className="text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white text-lg mb-2">Débloquez les analytics avancées</h3>
              <p className="text-gray-400 text-sm mb-4">
                Passez au plan Pro pour accéder aux fonctionnalités analytics avancées comme les heatmaps de clics, 
                la répartition géographique, les entonnoirs de conversion et les tests A/B.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-lg text-white font-medium transition-all text-sm"
              >
                Passer au Pro
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};