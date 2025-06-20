import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Tablet, Smartphone, Settings, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LayoutSelector } from './LayoutSelector';

interface LayoutControlsProps {
  onOpenPreview: () => void;
  className?: string;
}

export const LayoutControls: React.FC<LayoutControlsProps> = ({ 
  onOpenPreview,
  className = '' 
}) => {
  const { currentLayout, setCurrentLayout } = useStore();
  const [showLayoutSelector, setShowLayoutSelector] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLayoutChange = (layout: 'desktop' | 'tablet' | 'mobile') => {
    setCurrentLayout(layout);
    setShowLayoutSelector(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLayoutSelector(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
        >
          {currentLayout === 'desktop' && <Monitor size={16} className="text-green-400" />}
          {currentLayout === 'tablet' && <Tablet size={16} className="text-blue-400" />}
          {currentLayout === 'mobile' && <Smartphone size={16} className="text-orange-400" />}
          <span className="capitalize">{currentLayout}</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenPreview}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
        >
          <Eye size={16} />
          <span>Preview</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showLayoutSelector && (
          <LayoutSelector
            isOpen={showLayoutSelector}
            onClose={() => setShowLayoutSelector(false)}
            onSelectLayout={handleLayoutChange}
            currentLayout={currentLayout}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default LayoutControls;