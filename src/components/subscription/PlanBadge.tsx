import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, Zap } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';

interface PlanBadgeProps {
  className?: string;
  showUpgrade?: boolean;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({ 
  className = '', 
  showUpgrade = true 
}) => {
  const { currentPlan, subscription } = useSubscription();

  const getPlanIcon = () => {
    switch (currentPlan.id) {
      case 'free': return Star;
      case 'starter': return Zap;
      case 'pro': return Crown;
      default: return Star;
    }
  };

  const getPlanColor = () => {
    switch (currentPlan.id) {
      case 'free': return 'from-gray-500 to-gray-600';
      case 'starter': return 'from-indigo-500 to-purple-600';
      case 'pro': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const Icon = getPlanIcon();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${getPlanColor()} text-white text-sm font-medium ${className}`}
    >
      <Icon size={14} />
      <span>{currentPlan.name}</span>
      
      {subscription?.status === 'trialing' && (
        <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
          Trial
        </span>
      )}
      
      {showUpgrade && currentPlan.id !== 'pro' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/pricing'}
          className="px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded-full text-xs transition-colors"
        >
          Upgrade
        </motion.button>
      )}
    </motion.div>
  );
};