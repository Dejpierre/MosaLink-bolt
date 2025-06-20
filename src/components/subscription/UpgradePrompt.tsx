import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, X, ArrowRight, Zap } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { SUBSCRIPTION_PLANS } from '../../config/plans';

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
  description: string;
  recommendedPlan?: 'starter' | 'pro';
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  isOpen,
  onClose,
  feature,
  description,
  recommendedPlan = 'starter'
}) => {
  const { currentPlan } = useSubscription();
  const targetPlan = SUBSCRIPTION_PLANS[recommendedPlan];

  const handleUpgrade = () => {
    // Navigate to pricing page with the recommended plan highlighted
    window.location.href = `/pricing?plan=${recommendedPlan}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600">
                <Crown size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">Upgrade Required</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-white mb-3">{feature}</h4>
            <p className="text-gray-400 mb-6">{description}</p>

            {/* Current vs Target Plan */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                <div>
                  <div className="text-sm text-gray-400">Current Plan</div>
                  <div className="font-semibold text-white">{currentPlan.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Price</div>
                  <div className="font-semibold text-white">
                    €{currentPlan.price.monthly}/month
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRight size={20} className="text-indigo-400" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-600/10 border border-indigo-500/20">
                <div>
                  <div className="text-sm text-indigo-400">Recommended</div>
                  <div className="font-semibold text-white flex items-center gap-2">
                    {targetPlan.name}
                    {targetPlan.popular && <Zap size={16} className="text-yellow-400" />}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-indigo-400">Price</div>
                  <div className="font-semibold text-white">
                    €{targetPlan.price.monthly}/month
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
            >
              Maybe Later
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpgrade}
              className="flex-1 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all flex items-center justify-center gap-2"
            >
              Upgrade Now
              <ArrowRight size={16} />
            </motion.button>
          </div>

          {/* Trial Notice */}
          <p className="text-center text-xs text-gray-400 mt-4">
            Start with a 7-day free trial • Cancel anytime
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};