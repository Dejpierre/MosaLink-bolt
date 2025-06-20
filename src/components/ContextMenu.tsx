import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, Copy, Move, Palette, Link, Eye, EyeOff } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onCopyLink?: () => void;
  onChangeColor: () => void;
  hasUrl: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  isOpen,
  position,
  onClose,
  onEdit,
  onDelete,
  onDuplicate,
  onCopyLink,
  onChangeColor,
  hasUrl
}) => {
  const [adjustedPosition, setAdjustedPosition] = React.useState(position);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const menuItems = [
    {
      icon: Edit3,
      label: 'Éditer',
      action: onEdit,
      color: 'text-blue-400',
      shortcut: 'E'
    },
    {
      icon: Copy,
      label: 'Dupliquer',
      action: onDuplicate,
      color: 'text-green-400',
      shortcut: 'Ctrl+D'
    },
    {
      icon: Palette,
      label: 'Changer couleur',
      action: onChangeColor,
      color: 'text-purple-400',
      shortcut: 'C'
    },
    ...(hasUrl && onCopyLink ? [{
      icon: Link,
      label: 'Copier le lien',
      action: onCopyLink,
      color: 'text-cyan-400',
      shortcut: 'Ctrl+L'
    }] : []),
    {
      icon: Trash2,
      label: 'Supprimer',
      action: onDelete,
      color: 'text-red-400',
      shortcut: 'Del',
      separator: true
    }
  ];

  // Calculer la position ajustée immédiatement
  React.useEffect(() => {
    if (isOpen) {
      // Dimensions approximatives du menu
      const menuWidth = 200;
      const menuHeight = menuItems.length * 48 + 16;
      
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let newX = position.x;
      let newY = position.y;
      
      // Ajuster horizontalement
      if (position.x + menuWidth > viewportWidth - 16) {
        newX = position.x - menuWidth;
      }
      
      // Ajuster verticalement
      if (position.y + menuHeight > viewportHeight - 16) {
        newY = position.y - menuHeight;
      }
      
      // S'assurer que le menu reste dans les limites
      newX = Math.max(16, newX);
      newY = Math.max(16, newY);
      
      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [isOpen, position, menuItems.length]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      // Délai réduit pour une réactivité maximale
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('contextmenu', handleClickOutside);
      }, 50);
      
      document.addEventListener('keydown', handleEscape);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('contextmenu', handleClickOutside);
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ 
        zIndex: 999999,
        pointerEvents: 'none'
      }}
    >
      <AnimatePresence>
        <motion.div
          ref={menuRef}
          initial={{ 
            opacity: 0, 
            scale: 0.85, 
            y: -8,
            filter: 'blur(4px)'
          }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            filter: 'blur(0px)'
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.9, 
            y: -4,
            filter: 'blur(2px)'
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 800, 
            damping: 35,
            mass: 0.5,
            duration: 0.12
          }}
          className="absolute min-w-[200px] pointer-events-auto"
          style={{
            left: adjustedPosition.x,
            top: adjustedPosition.y,
            transform: 'translateZ(0)',
            willChange: 'transform, opacity, filter'
          }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <motion.div 
            className="bg-gray-900/98 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden ring-1 ring-black/20"
            initial={{ backdropFilter: 'blur(0px)' }}
            animate={{ backdropFilter: 'blur(20px)' }}
            transition={{ duration: 0.1 }}
          >
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                {item.separator && (
                  <motion.div 
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: index * 0.02, duration: 0.15 }}
                    className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-2 my-1" 
                  />
                )}
                <motion.button
                  initial={{ 
                    opacity: 0, 
                    x: -10,
                    filter: 'blur(2px)'
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    filter: 'blur(0px)'
                  }}
                  transition={{ 
                    delay: index * 0.025,
                    duration: 0.15,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    x: 3,
                    scale: 1.02,
                    transition: { 
                      duration: 0.1,
                      ease: 'easeOut'
                    }
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    transition: { duration: 0.05 }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-100 group first:rounded-t-xl last:rounded-b-xl"
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: 5,
                      transition: { duration: 0.1 }
                    }}
                  >
                    <item.icon 
                      size={16} 
                      className={`${item.color} transition-all duration-100`} 
                    />
                  </motion.div>
                  <span className="flex-1 text-white font-medium text-sm">
                    {item.label}
                  </span>
                  <motion.span 
                    className="text-xs text-gray-400 font-mono opacity-60 group-hover:opacity-100 transition-opacity duration-100"
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.1 }
                    }}
                  >
                    {item.shortcut}
                  </motion.span>
                </motion.button>
              </React.Fragment>
            ))}
          </motion.div>

          {/* Effet de glow premium avec animation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05, duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-xl -z-10 blur-xl scale-110" 
          />
          
          {/* Ombre portée avec animation */}
          <motion.div 
            initial={{ opacity: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: 2, scale: 1.05 }}
            transition={{ delay: 0.03, duration: 0.15 }}
            className="absolute inset-0 bg-black/40 rounded-xl -z-20 blur-2xl" 
          />

          {/* Effet de brillance subtil */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: [0, 0.3, 0], x: 100 }}
            transition={{ 
              delay: 0.1,
              duration: 0.6,
              ease: 'easeInOut'
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-xl -z-5"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)'
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  );
};