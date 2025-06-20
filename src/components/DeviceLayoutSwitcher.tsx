import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Tablet, Smartphone, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import { LayoutSelector } from './LayoutSelector';

interface DeviceLayoutSwitcherProps {
  className?: string;
}

export const DeviceLayoutSwitcher: React.FC<DeviceLayoutSwitcherProps> = ({ 
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
      <div className={`flex items-center gap-2 p-1 bg-white/5 rounded-lg ${className}`}>
        {[
          { id: 'desktop', label: 'Desktop', icon: Monitor, },
          { id: 'tablet', label: 'Tablet', icon: Tablet, },
          { id: 'mobile', label: 'Mobile', icon: Smartphone, }
        ].map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentLayout(id as any)}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
              currentLayout === id
                ? id === 'desktop' 
                  ? 'bg-white shadow-lg'
                  : id === 'tablet'
                  ? 'bg-white shadow-lg'
                  : 'bg-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={`Modifier la mise en page ${label}`}
          >
            <Icon size={16} />
            <span className="text-sm font-medium">{label}</span>
          </motion.button>
        ))}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLayoutSelector(true)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          title="Paramètres de mise en page"
        >
          <Settings size={16} />
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

export default DeviceLayoutSwitcher;