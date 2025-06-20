'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { BentoGrid } from './BentoGrid';
import { ProfileSection } from './ProfileSection';
import { CompanyLogoSection } from './CompanyLogoSection';
import { X, Maximize2, Minimize2, Share2, Download, Eye, Monitor, Smartphone, Tablet } from 'lucide-react';

interface PreviewModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewMode: React.FC<PreviewModeProps> = ({ isOpen, onClose }) => {
  const { getCurrentDeviceCards, profile, globalBackground } = useStore();
  
  const cards = getCurrentDeviceCards();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const isCompany = profile.type === 'company';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Masquer les contrôles après 3 secondes d'inactivité
  useEffect(() => {
    if (!mounted) return;
    
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    if (isOpen) {
      resetTimeout();
      
      const handleMouseMove = () => resetTimeout();
      const handleKeyPress = () => resetTimeout();
      
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('keydown', handleKeyPress);
      
      return () => {
        clearTimeout(timeout);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isOpen, mounted]);

  // Gestion du plein écran
  const toggleFullscreen = () => {
    if (!mounted) return;
    
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  // Raccourcis clavier
  useEffect(() => {
    if (!mounted || !isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          if (isFullscreen) {
            toggleFullscreen();
          } else {
            onClose();
          }
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case '1':
          setViewMode('desktop');
          break;
        case '2':
          setViewMode('tablet');
          break;
        case '3':
          setViewMode('mobile');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose, mounted]);

  // Configuration responsive
  const getViewportConfig = () => {
    switch (viewMode) {
      case 'mobile':
        return {
          className: 'w-full max-w-sm mx-auto border-8 border-gray-800 rounded-[2rem] shadow-2xl bg-black overflow-hidden'
        };
      case 'tablet':
        return {
          className: 'w-full max-w-3xl mx-auto border-4 border-gray-700 rounded-xl shadow-2xl overflow-hidden'
        };
      default: // desktop
        return {
          className: 'w-full h-full'
        };
    }
  };

  const viewport = getViewportConfig();

  const handleShare = async () => {
    if (!mounted) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: isCompany 
            ? profile.companyName || 'Company Profile' 
            : `${profile.firstName} ${profile.lastName} - Mosalink`,
          text: profile.bio,
          url: window.location.href
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      // Fallback: copier l'URL
      await navigator.clipboard.writeText(window.location.href);
      alert('URL copiée dans le presse-papiers !');
    }
  };

  const handleExport = () => {
    // Simuler l'export en image
    alert('🚀 Fonctionnalité d\'export en cours de développement !\nBientôt disponible : export en PNG, PDF, et lien partageable.');
  };

  // Générer le style CSS pour le fond global
  const generateBackgroundStyle = () => {
    const bg = globalBackground;
    let style: React.CSSProperties = {};
    
    switch (bg.type) {
      case 'color':
        style.backgroundColor = bg.color;
        break;
      case 'gradient':
        if (bg.gradient) {
          const { type, direction, colors } = bg.gradient;
          if (type === 'linear') {
            style.background = `linear-gradient(${direction}, ${colors.join(', ')})`;
          } else {
            style.background = `radial-gradient(${direction || 'circle at center'}, ${colors.join(', ')})`;
          }
        }
        break;
      case 'image':
        if (bg.image) {
          style.backgroundImage = `url(${bg.image.url})`;
          style.backgroundSize = bg.image.size;
          style.backgroundPosition = bg.image.position;
          style.backgroundRepeat = bg.image.repeat;
          style.backgroundAttachment = bg.image.attachment;
        }
        break;
      case 'pattern':
        if (bg.pattern) {
          // CORRIGÉ: Fond de base sombre pour les motifs
          style.backgroundColor = '#1f2937';
          
          // Générer des motifs CSS avec opacité contrôlée
          const { type, color, size, opacity } = bg.pattern;
          switch (type) {
            case 'dots':
              style.backgroundImage = `radial-gradient(circle, ${color} 1px, transparent 1px)`;
              style.backgroundSize = `${size}px ${size}px`;
              // L'opacité est appliquée via un overlay séparé
              break;
            case 'grid':
              style.backgroundImage = `
                linear-gradient(${color} 1px, transparent 1px),
                linear-gradient(90deg, ${color} 1px, transparent 1px)
              `;
              style.backgroundSize = `${size}px ${size}px`;
              break;
            case 'diagonal':
              style.backgroundImage = `repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 0, transparent ${size}px)`;
              break;
            case 'waves':
              style.backgroundImage = `repeating-radial-gradient(${color} 2px, transparent 5px, transparent ${size}px)`;
              break;
            case 'hexagon':
              style.backgroundImage = `linear-gradient(30deg, ${color} 12%, transparent 12.5%, transparent 87%, ${color} 87.5%, ${color}),
                                      linear-gradient(150deg, ${color} 12%, transparent 12.5%, transparent 87%, ${color} 87.5%, ${color}),
                                      linear-gradient(30deg, ${color} 12%, transparent 12.5%, transparent 87%, ${color} 87.5%, ${color}),
                                      linear-gradient(150deg, ${color} 12%, transparent 12.5%, transparent 87%, ${color} 87.5%, ${color})`;
              style.backgroundSize = `${size}px ${size * 0.866}px`;
              break;
            case 'triangles':
              style.backgroundImage = `linear-gradient(60deg, ${color} 25%, transparent 25.5%, transparent 75%, ${color} 75%, ${color}),
                                      linear-gradient(120deg, ${color} 25%, transparent 25.5%, transparent 75%, ${color} 75%, ${color})`;
              style.backgroundSize = `${size}px ${size}px`;
              break;
          }
        }
        break;
    }
    
    return style;
  };

  if (!isOpen || !mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-auto"
      style={generateBackgroundStyle()}
    >
      {/* Overlay pour le fond global */}
      {globalBackground.overlay?.enabled && (
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundColor: globalBackground.overlay.color,
            opacity: globalBackground.overlay.opacity
          }}
        />
      )}

      {/* Vidéo de fond */}
      {globalBackground.type === 'video' && globalBackground.video && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <video
            src={globalBackground.video.url}
            autoPlay
            loop
            muted
            playsInline
            className="absolute w-full h-full object-cover"
            style={{
              opacity: globalBackground.video.opacity,
              filter: `blur(${globalBackground.video.blur}px)`
            }}
          />
        </div>
      )}

      {/* Contrôles flottants */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-4 right-4 z-10 flex items-center justify-between"
          >
            {/* Contrôles gauche */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-black/70 transition-all"
              >
                <X size={20} />
              </motion.button>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-sm border border-white/20">
                <Eye size={16} className="text-indigo-400" />
                <span className="text-white font-medium">Mode Preview</span>
              </div>
            </div>

            {/* Contrôles centre - Sélecteur de viewport */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-black/50 backdrop-blur-sm border border-white/20">
              {[
                { mode: 'desktop', icon: Monitor, label: 'Desktop', key: '1' },
                { mode: 'tablet', icon: Tablet, label: 'Tablet', key: '2' },
                { mode: 'mobile', icon: Smartphone, label: 'Mobile', key: '3' }
              ].map(({ mode, icon: Icon, label, key }) => (
                <motion.button
                  key={mode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode(mode as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    viewMode === mode
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={`${label} (${key})`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium hidden sm:block">{label}</span>
                </motion.button>
              ))}
            </div>

            {/* Contrôles droite */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-black/70 transition-all"
                title="Partager"
              >
                <Share2 size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-black/70 transition-all"
                title="Exporter"
              >
                <Download size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFullscreen}
                className="p-3 rounded-xl bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-black/70 transition-all"
                title="Plein écran (F)"
              >
                {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Raccourcis clavier */}
      <AnimatePresence>
        {showControls && !isFullscreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20 text-xs text-gray-400 font-mono"
          >
            <div className="flex items-center gap-4">
              <span>ESC: Fermer</span>
              <span>F: Plein écran</span>
              <span>1-3: Viewport</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contenu principal - Scrollable */}
      <div className="min-h-screen flex flex-col">
        {/* Profile compact en mode preview */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-shrink-0 p-4"
        >
          <div className={`w-full ${viewMode !== 'desktop' ? 'scale-75 origin-top' : ''}`}>
            {isCompany ? <CompanyLogoSection /> : <ProfileSection />}
          </div>
        </motion.div>

        {/* Grille preview - Hauteur fixe, pas de scroll */}
        <div className="flex-shrink-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 25 }}
            className={viewport.className}
          >
            <div className="relative flex items-center justify-center p-4">
              {/* Utiliser le composant BentoGrid avec isPreview=true */}
              <BentoGrid 
                cards={cards}
                isPreview={true}
                className="max-w-7xl mx-auto"
              />
            </div>
          </motion.div>
        </div>

        {/* Indicateur viewport */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex-shrink-0 text-center p-4"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 text-xs text-gray-400">
            <div className={`w-2 h-2 rounded-full ${
              viewMode === 'mobile' ? 'bg-orange-400' : 
              viewMode === 'tablet' ? 'bg-blue-400' : 'bg-green-400'
            }`} />
            <span className="capitalize">{viewMode}</span>
            <span>•</span>
            <span>{cards.length} carte{cards.length > 1 ? 's' : ''}</span>
          </div>
        </motion.div>
      </div>

      {/* Effet de brillance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatDelay: 5,
          ease: 'easeInOut'
        }}
        className="fixed inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)'
        }}
      />
    </motion.div>
  );
};

export default PreviewMode;