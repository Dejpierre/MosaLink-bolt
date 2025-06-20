import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Tablet, Smartphone, Check, X } from 'lucide-react';

interface LayoutSelectorProps {
  onSelectLayout: (layout: 'desktop' | 'tablet' | 'mobile') => void;
  currentLayout: 'desktop' | 'tablet' | 'mobile';
  isOpen: boolean;
  onClose: () => void;
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  onSelectLayout,
  currentLayout,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
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
        className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Sélectionner la mise en page
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </motion.button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectLayout('desktop')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              currentLayout === 'desktop'
                ? 'border-green-500 bg-green-500/10'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-lg ${
                currentLayout === 'desktop' ? 'bg-green-500/20' : 'bg-white/10'
              }`}>
                <Monitor size={24} className={currentLayout === 'desktop' ? 'text-green-400' : 'text-gray-400'} />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-white">Desktop</h3>
                <p className="text-xs text-gray-400 mt-1">12 colonnes</p>
              </div>
              {currentLayout === 'desktop' && (
                <div className="absolute top-2 right-2">
                  <Check size={16} className="text-green-400" />
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectLayout('tablet')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              currentLayout === 'tablet'
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-lg ${
                currentLayout === 'tablet' ? 'bg-blue-500/20' : 'bg-white/10'
              }`}>
                <Tablet size={24} className={currentLayout === 'tablet' ? 'text-blue-400' : 'text-gray-400'} />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-white">Tablet</h3>
                <p className="text-xs text-gray-400 mt-1">4 colonnes</p>
              </div>
              {currentLayout === 'tablet' && (
                <div className="absolute top-2 right-2">
                  <Check size={16} className="text-blue-400" />
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectLayout('mobile')}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
              currentLayout === 'mobile'
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-white/20 bg-white/5 hover:bg-white/10'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className={`p-3 rounded-lg ${
                currentLayout === 'mobile' ? 'bg-orange-500/20' : 'bg-white/10'
              }`}>
                <Smartphone size={24} className={currentLayout === 'mobile' ? 'text-orange-400' : 'text-gray-400'} />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-white">Mobile</h3>
                <p className="text-xs text-gray-400 mt-1">2 colonnes</p>
              </div>
              {currentLayout === 'mobile' && (
                <div className="absolute top-2 right-2">
                  <Check size={16} className="text-orange-400" />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-sm text-gray-300">
            Chaque appareil peut avoir une mise en page différente. Les cartes seront automatiquement adaptées à la taille de l'écran.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
          >
            Fermer
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};