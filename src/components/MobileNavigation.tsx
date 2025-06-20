import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Palette, Eye, Grid, Edit3 } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useStore } from '../store/useStore';

interface MobileNavigationProps {
  onOpenGlobalStyleEditor: () => void;
  onOpenGlobalBackgroundEditor: () => void;
  onOpenPreview: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  onOpenGlobalStyleEditor,
  onOpenGlobalBackgroundEditor,
  onOpenPreview
}) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { selectedCardId } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Fixed Mobile Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white p-6 border-t border-gray-200 flex items-center justify-around md:hidden"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSidebar(true)}
          className="flex flex-col items-center justify-center gap-1"
        >
          <Grid size={24} className="text-gray-700" />
          <span className="text-xs text-gray-700">Menu</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenGlobalStyleEditor}
          className="flex flex-col items-center justify-center gap-1"
        >
          <Palette size={24} className="text-gray-700" />
          <span className="text-xs text-gray-700">Style</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenPreview}
          className="flex flex-col items-center justify-center gap-1"
        >
          <Eye size={24} className="text-gray-700" />
          <span className="text-xs text-gray-700">Preview</span>
        </motion.button>

        {selectedCardId && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center justify-center gap-1"
          >
            <Edit3 size={24} className="text-indigo-600" />
            <span className="text-xs text-indigo-600">Edit</span>
          </motion.button>
        )}
      </motion.div>

      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowSidebar(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              className="fixed left-0 top-0 w-80 h-full z-50"
            >
              <Sidebar onClose={() => setShowSidebar(false)}>
                <div className="p-4 mt-auto border-t border-white/10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowSidebar(false)}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
                  >
                    Close Menu
                  </motion.button>
                </div>
              </Sidebar>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;