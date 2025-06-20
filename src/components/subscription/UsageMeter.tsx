import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';

interface UsageMeterProps {
  className?: string;
}

export const UsageMeter: React.FC<UsageMeterProps> = ({ className = '' }) => {
  const { usage, currentPlan, canAddCard } = useSubscription();

  if (!usage) return null;

  const usagePercentage = currentPlan.features.maxCards === Infinity 
    ? 0 
    : (usage.cardsUsed / currentPlan.features.maxCards) * 100;

  const isNearLimit = usagePercentage >= 80;
  const isAtLimit = usagePercentage >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg bg-white/5 border border-white/10 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-indigo-400" />
          <span className="font-medium text-white">Card Usage</span>
        </div>
        {isNearLimit && (
          <div className="flex items-center gap-1 text-yellow-400">
            <AlertTriangle size={14} />
            <span className="text-xs">Near limit</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {usage.cardsUsed} of {currentPlan.features.maxCards === Infinity ? '∞' : currentPlan.features.maxCards} cards used
          </span>
          <span className={`font-medium ${
            isAtLimit ? 'text-red-400' : 
            isNearLimit ? 'text-yellow-400' : 
            'text-green-400'
          }`}>
            {currentPlan.features.maxCards === Infinity ? '∞' : `${Math.round(usagePercentage)}%`}
          </span>
        </div>

        {currentPlan.features.maxCards !== Infinity && (
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-2 rounded-full transition-colors ${
                isAtLimit ? 'bg-red-500' :
                isNearLimit ? 'bg-yellow-500' :
                'bg-gradient-to-r from-indigo-500 to-purple-600'
              }`}
            />
          </div>
        )}

        {!canAddCard && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertTriangle size={14} />
              <span>You've reached your card limit</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Upgrade your plan to add more cards
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};