import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MousePointer, 
  Eye, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet,
  Clock,
  MapPin,
  ExternalLink,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Crown,
  Zap,
  Star,
  AlertCircle,
  Target,
  Activity
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analyticsService';
import { AnalyticsStats, AnalyticsFilter } from '../../types/analytics';
import { useSubscription } from '../../hooks/useSubscription';

interface AnalyticsDashboardProps {
  onClose?: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onClose }) => {
  const { getCurrentDeviceCards, userPlan } = useStore();
  const { currentPlan } = useSubscription();
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [showDemoData, setShowDemoData] = useState(false);

  const cards = getCurrentDeviceCards();

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod, userPlan]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    
    // Calculer la plage de dates selon la période
    const now = new Date();
    let startDate: Date;
    
    switch (selectedPeriod) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
    }

    const filter: AnalyticsFilter = {
      dateRange: { start: startDate, end: now }
    };

    try {
      const analyticsStats = analyticsService.getStats(userPlan, filter);
      setStats(analyticsStats);
    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateDemoData = () => {
    analyticsService.generateDemoData(30);
    setShowDemoData(true);
    loadAnalytics();
  };

  const exportData = (format: 'json' | 'csv') => {
    const data = analyticsService.exportData(format);
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${selectedPeriod}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPlanFeatures = () => {
    switch (userPlan) {
      case 'free':
        return {
          title: 'Analytics Basiques',
          description: 'Métriques essentielles pour suivre vos performances',
          features: ['Vues totales', 'Clics totaux', 'Visiteurs uniques'],
          color: 'from-gray-500 to-gray-600',
          icon: Star
        };
      case 'starter':
        return {
          title: 'Analytics Avancées',
          description: 'Insights détaillés pour optimiser votre contenu',
          features: ['Clics par carte', 'Sources de trafic', 'Répartition par appareil', 'Statistiques horaires'],
          color: 'from-indigo-500 to-purple-600',
          icon: Zap
        };
      case 'pro':
        return {
          title: 'Analytics Pro',
          description: 'Analytics complètes avec données géographiques et heatmaps',
          features: ['Taux de conversion', 'Durée de session', 'Données géographiques', 'Heatmap des clics', 'Taux de rebond'],
          color: 'from-purple-600 to-pink-600',
          icon: Crown
        };
      default:
        return {
          title: 'Analytics Basiques',
          description: 'Métriques essentielles pour suivre vos performances',
          features: ['Vues totales', 'Clics totaux', 'Visiteurs uniques'],
          color: 'from-gray-500 to-gray-600',
          icon: Star
        };
    }
  };

  const planFeatures = getPlanFeatures();
  const PlanIcon = planFeatures.icon;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-400">Chargement des analytics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Aucune donnée disponible</h3>
        <p className="text-gray-400 mb-6">
          Commencez à partager votre grille pour voir vos premières statistiques !
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateDemoData}
          className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all"
        >
          Générer des données de démo
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Analytics</h2>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${planFeatures.color} text-white text-sm font-medium`}>
            <PlanIcon size={14} />
            {planFeatures.title}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Sélecteur de période */}
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
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  selectedPeriod === period.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {period.label}
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadAnalytics}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title="Actualiser"
          >
            <RefreshCw size={16} />
          </motion.button>

          {userPlan !== 'free' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => exportData('csv')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title="Exporter CSV"
            >
              <Download size={16} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</div>
              <div className="text-sm text-blue-400">Vues totales</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Nombre total de fois où votre grille a été vue
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
              <div className="text-2xl font-bold text-white">{stats.totalClicks.toLocaleString()}</div>
              <div className="text-sm text-green-400">Clics totaux</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Nombre total de clics sur vos cartes
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
              <div className="text-2xl font-bold text-white">{stats.uniqueVisitors.toLocaleString()}</div>
              <div className="text-sm text-purple-400">Visiteurs uniques</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Nombre de visiteurs différents
          </div>
        </motion.div>
      </div>

      {/* Métriques avancées pour Starter+ */}
      {(userPlan === 'starter' || userPlan === 'pro') && stats.clicksByCard && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target size={20} className="text-indigo-400" />
            Performance par carte
          </h3>
          
          <div className="space-y-3">
            {Object.entries(stats.clicksByCard)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([cardId, clicks]) => {
                const card = cards.find(c => c.id === cardId);
                const cardTitle = card?.title || `Carte ${cardId}`;
                const percentage = stats.totalClicks > 0 ? (clicks / stats.totalClicks) * 100 : 0;
                
                return (
                  <div key={cardId} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: card?.backgroundColor || '#6366f1' }}
                      />
                      <span className="text-white font-medium">{cardTitle}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-white/10 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                        />
                      </div>
                      <span className="text-sm text-gray-300 w-12 text-right">{clicks}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* Répartition par appareil pour Starter+ */}
      {(userPlan === 'starter' || userPlan === 'pro') && stats.deviceBreakdown && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Smartphone size={20} className="text-green-400" />
              Répartition par appareil
            </h3>
            
            <div className="space-y-4">
              {[
                { key: 'mobile', label: 'Mobile', icon: Smartphone, color: 'text-green-400' },
                { key: 'tablet', label: 'Tablette', icon: Tablet, color: 'text-blue-400' },
                { key: 'desktop', label: 'Desktop', icon: Monitor, color: 'text-purple-400' }
              ].map(({ key, label, icon: Icon, color }) => {
                const count = stats.deviceBreakdown![key as keyof typeof stats.deviceBreakdown];
                const total = Object.values(stats.deviceBreakdown!).reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;
                
                return (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon size={16} className={color} />
                      <span className="text-white">{label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-white/10 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: 0.6 }}
                          className={`h-2 rounded-full ${
                            key === 'mobile' ? 'bg-green-500' :
                            key === 'tablet' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}
                        />
                      </div>
                      <span className="text-sm text-gray-300 w-12 text-right">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Sources de trafic */}
          {stats.topReferrers && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ExternalLink size={20} className="text-cyan-400" />
                Sources de trafic
              </h3>
              
              <div className="space-y-3">
                {stats.topReferrers.slice(0, 5).map((referrer, index) => {
                  const total = stats.topReferrers!.reduce((sum, r) => sum + r.count, 0);
                  const percentage = total > 0 ? (referrer.count / total) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white truncate flex-1 mr-3">
                        {referrer.source === 'Direct' ? '🔗 Direct' : `🌐 ${referrer.source}`}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-16 bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                            className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                          />
                        </div>
                        <span className="text-sm text-gray-300 w-8 text-right">
                          {referrer.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Métriques Pro */}
      {userPlan === 'pro' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Métriques de conversion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20"
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-orange-400" />
              Métriques avancées
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Taux de conversion</span>
                <span className="text-xl font-bold text-orange-400">
                  {stats.conversionRate?.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Durée moyenne de session</span>
                <span className="text-xl font-bold text-blue-400">
                  {Math.round(stats.averageSessionDuration || 0)}s
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Taux de rebond</span>
                <span className="text-xl font-bold text-red-400">
                  {stats.bounceRate?.toFixed(1)}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Données géographiques */}
          {stats.geographicData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-emerald-400" />
                Répartition géographique
              </h3>
              
              <div className="space-y-3">
                {stats.geographicData.map((country, index) => {
                  const total = stats.geographicData!.reduce((sum, c) => sum + c.count, 0);
                  const percentage = total > 0 ? (country.count / total) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white">{country.country}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-white/10 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                            className="h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"
                          />
                        </div>
                        <span className="text-sm text-gray-300 w-12 text-right">
                          {country.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Message d'upgrade pour les plans inférieurs */}
      {userPlan === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/20"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-500/20">
              <Crown size={24} className="text-indigo-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-2">Débloquez des analytics avancées</h3>
              <p className="text-gray-400 text-sm mb-4">
                Passez au plan Starter pour accéder aux clics par carte, sources de trafic, répartition par appareil et bien plus.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all text-sm"
              >
                Voir les plans
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {userPlan === 'starter' && (
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
              <h3 className="font-semibold text-white mb-2">Passez au niveau supérieur</h3>
              <p className="text-gray-400 text-sm mb-4">
                Le plan Pro vous donne accès aux métriques de conversion, données géographiques, heatmaps de clics et tests A/B.
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

      {/* Données de démo */}
      {showDemoData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20"
        >
          <div className="flex items-center gap-2 text-yellow-400 mb-2">
            <AlertCircle size={16} />
            <span className="font-medium text-sm">Données de démonstration</span>
          </div>
          <p className="text-xs text-gray-400">
            Ces données sont générées pour la démonstration. Dans un environnement de production, 
            vous verriez vos vraies statistiques de trafic.
          </p>
        </motion.div>
      )}
    </div>
  );
};