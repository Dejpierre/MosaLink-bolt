import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { GlobalBackgroundSettings, GlobalBackgroundType } from '../types';
import { HexColorPicker } from 'react-colorful';
import { 
  Palette, 
  Image, 
  Video, 
  Grid, 
  Layers,
  X, 
  Check, 
  Eye, 
  EyeOff,
  RefreshCw,
  Upload,
  Link,
  Settings,
  Sparkles,
  Wand2,
  Monitor,
  Smartphone,
  Tablet,
  Info
} from 'lucide-react';

interface GlobalBackgroundEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

// Gradients prédéfinis
const predefinedGradients = [
  {
    name: 'Océan Profond',
    gradient: {
      type: 'linear' as const,
      direction: '135deg',
      colors: ['#0f172a', '#1e293b', '#334155']
    }
  },
  {
    name: 'Coucher de Soleil',
    gradient: {
      type: 'linear' as const,
      direction: '135deg',
      colors: ['#f97316', '#ea580c', '#dc2626']
    }
  },
  {
    name: 'Forêt Mystique',
    gradient: {
      type: 'linear' as const,
      direction: '135deg',
      colors: ['#064e3b', '#065f46', '#047857']
    }
  },
  {
    name: 'Violet Cosmique',
    gradient: {
      type: 'linear' as const,
      direction: '135deg',
      colors: ['#581c87', '#7c3aed', '#8b5cf6']
    }
  },
  {
    name: 'Rose Électrique',
    gradient: {
      type: 'linear' as const,
      direction: '135deg',
      colors: ['#be185d', '#ec4899', '#f472b6']
    }
  },
  {
    name: 'Bleu Arctique',
    gradient: {
      type: 'linear' as const,
      direction: '135deg',
      colors: ['#0c4a6e', '#0284c7', '#0ea5e9']
    }
  },
  {
    name: 'Aurore Boréale',
    gradient: {
      type: 'linear' as const,
      direction: '45deg',
      colors: ['#1e1b4b', '#3730a3', '#6366f1', '#8b5cf6']
    }
  },
  {
    name: 'Feu de Camp',
    gradient: {
      type: 'radial' as const,
      direction: 'circle at center',
      colors: ['#7c2d12', '#ea580c', '#f97316']
    }
  }
];

// Images de fond prédéfinies
const predefinedImages = [
  {
    name: 'Abstrait Géométrique',
    url: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1920'
  },
  {
    name: 'Texture Marbre',
    url: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1920'
  },
  {
    name: 'Ciel Étoilé',
    url: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=1920'
  },
  {
    name: 'Vagues Abstraites',
    url: 'https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?auto=compress&cs=tinysrgb&w=1920'
  },
  {
    name: 'Texture Bois',
    url: 'https://images.pexels.com/photos/129731/pexels-photo-129731.jpeg?auto=compress&cs=tinysrgb&w=1920'
  },
  {
    name: 'Lumières Bokeh',
    url: 'https://images.pexels.com/photos/1363876/pexels-photo-1363876.jpeg?auto=compress&cs=tinysrgb&w=1920'
  }
];

// Motifs prédéfinis
const predefinedPatterns = [
  { name: 'Points', type: 'dots' as const },
  { name: 'Grille', type: 'grid' as const },
  { name: 'Diagonales', type: 'diagonal' as const },
  { name: 'Vagues', type: 'waves' as const },
  { name: 'Hexagones', type: 'hexagon' as const },
  { name: 'Triangles', type: 'triangles' as const }
];

export const GlobalBackgroundEditor: React.FC<GlobalBackgroundEditorProps> = ({ isOpen, onClose }) => {
  const { globalBackground, updateGlobalBackground, resetGlobalBackground } = useStore();
  const [localBackground, setLocalBackground] = useState<GlobalBackgroundSettings>(globalBackground);
  const [previewMode, setPreviewMode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  // Appliquer les changements en temps réel si le mode aperçu est activé
  const applyIfPreview = (newBackground: GlobalBackgroundSettings) => {
    setLocalBackground(newBackground);
    if (previewMode) {
      updateGlobalBackground(newBackground);
    }
  };

  // Changer le type de fond
  const handleTypeChange = (type: GlobalBackgroundType) => {
    const newBackground: GlobalBackgroundSettings = {
      ...localBackground,
      type
    };
    
    // Initialiser avec des valeurs par défaut selon le type
    switch (type) {
      case 'color':
        newBackground.color = '#1f2937';
        break;
      case 'gradient':
        newBackground.gradient = predefinedGradients[0].gradient;
        break;
      case 'image':
        newBackground.image = {
          url: predefinedImages[0].url,
          size: 'cover',
          position: 'center',
          repeat: 'no-repeat',
          attachment: 'scroll',
          opacity: 1
        };
        break;
      case 'video':
        newBackground.video = {
          url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          opacity: 0.7,
          blur: 0,
          speed: 1
        };
        break;
      case 'pattern':
        newBackground.pattern = {
          type: 'dots',
          color: '#6366f1',
          size: 20,
          opacity: 0.05 // CORRIGÉ: Opacité beaucoup plus faible par défaut
        };
        break;
    }
    
    applyIfPreview(newBackground);
  };

  // Appliquer un gradient prédéfini
  const applyGradient = (gradient: any) => {
    const newBackground = {
      ...localBackground,
      type: 'gradient' as const,
      gradient
    };
    applyIfPreview(newBackground);
  };

  // Appliquer une image prédéfinie
  const applyImage = (imageUrl: string) => {
    const newBackground = {
      ...localBackground,
      type: 'image' as const,
      image: {
        url: imageUrl,
        size: 'cover' as const,
        position: 'center' as const,
        repeat: 'no-repeat' as const,
        attachment: 'scroll' as const,
        opacity: 1
      }
    };
    applyIfPreview(newBackground);
  };

  // Appliquer une couleur
  const applyColor = (color: string) => {
    const newBackground = {
      ...localBackground,
      type: 'color' as const,
      color
    };
    applyIfPreview(newBackground);
  };

  // Générer un fond aléatoire
  const generateRandom = () => {
    const types: GlobalBackgroundType[] = ['color', 'gradient', 'pattern'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    let newBackground: GlobalBackgroundSettings = { ...localBackground, type: randomType };
    
    switch (randomType) {
      case 'color':
        const colors = ['#1f2937', '#7c2d12', '#581c87', '#0c4a6e', '#064e3b', '#be185d'];
        newBackground.color = colors[Math.floor(Math.random() * colors.length)];
        break;
      case 'gradient':
        newBackground.gradient = predefinedGradients[Math.floor(Math.random() * predefinedGradients.length)].gradient;
        break;
      case 'pattern':
        newBackground.pattern = {
          type: predefinedPatterns[Math.floor(Math.random() * predefinedPatterns.length)].type,
          color: '#6366f1',
          size: 20,
          opacity: 0.05 // CORRIGÉ: Opacité faible pour les motifs aléatoires
        };
        break;
    }
    
    applyIfPreview(newBackground);
  };

  // Appliquer les changements
  const handleApply = () => {
    updateGlobalBackground(localBackground);
    onClose();
  };

  // Réinitialiser
  const handleReset = () => {
    resetGlobalBackground();
    setLocalBackground(globalBackground);
    onClose();
  };

  // Générer le CSS pour l'aperçu
  const generateBackgroundCSS = (bg: GlobalBackgroundSettings) => {
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
            style.background = `radial-gradient(${direction}, ${colors.join(', ')})`;
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
          if (bg.image.opacity !== undefined && bg.image.opacity < 1) {
            style.position = 'relative';
          }
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
        className="bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
              <Layers size={24} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Fond Global
              </h2>
              <p className="text-gray-400">
                Personnalisez l'arrière-plan de la prévisualisation
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                previewMode
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-white/10 text-gray-400 hover:text-white border border-white/20'
              }`}
              title="Mode aperçu en temps réel"
            >
              {previewMode ? <Eye size={16} /> : <EyeOff size={16} />}
              Aperçu
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-lg transition-colors ${
                showInfo
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/10 text-gray-400 hover:text-white border border-white/20'
              }`}
              title="Informations"
            >
              <Info size={16} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} className="text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Info Banner */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-blue-500/10 border-b border-blue-500/20">
                <div className="flex items-start gap-3">
                  <Info size={20} className="text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-blue-400 mb-1">À propos du fond global</h3>
                    <p className="text-sm text-gray-300">
                      Le fond global s'applique uniquement au mode prévisualisation, pas à l'éditeur. 
                      Cela vous permet de travailler dans un environnement d'édition stable tout en 
                      prévisualisant l'apparence finale de votre grille avec un fond personnalisé.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Type Selector */}
        <div className="p-4 border-b border-white/10 bg-white/5">
          <div className="flex gap-2 overflow-x-auto">
            {[
              { type: 'color', label: 'Couleur', icon: Palette },
              { type: 'gradient', label: 'Gradient', icon: Sparkles },
              { type: 'image', label: 'Image', icon: Image },
              { type: 'video', label: 'Vidéo', icon: Video },
              { type: 'pattern', label: 'Motif', icon: Grid }
            ].map(({ type, label, icon: Icon }) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTypeChange(type as GlobalBackgroundType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  localBackground.type === type
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
                }`}
              >
                <Icon size={16} />
                {label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Couleur */}
              {localBackground.type === 'color' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-white">Couleur de fond</h3>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="w-12 h-12 rounded-lg border-2 border-white/20"
                      style={{ backgroundColor: localBackground.color }}
                    />
                    <input
                      type="text"
                      value={localBackground.color || '#1f2937'}
                      onChange={(e) => applyColor(e.target.value)}
                      className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white font-mono"
                    />
                  </div>

                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <HexColorPicker
                        color={localBackground.color || '#1f2937'}
                        onChange={applyColor}
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Gradients */}
              {localBackground.type === 'gradient' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-white">Gradients prédéfinis</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {predefinedGradients.map((preset, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => applyGradient(preset.gradient)}
                        className="aspect-square rounded-lg border border-white/20 hover:border-white/40 transition-all relative overflow-hidden"
                        style={{
                          background: preset.gradient.type === 'linear'
                            ? `linear-gradient(${preset.gradient.direction}, ${preset.gradient.colors.join(', ')})`
                            : `radial-gradient(${preset.gradient.direction}, ${preset.gradient.colors.join(', ')})`
                        }}
                      >
                        <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium text-center px-2">
                            {preset.name}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Images */}
              {localBackground.type === 'image' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-white">Images prédéfinies</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {predefinedImages.map((preset, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => applyImage(preset.url)}
                        className="aspect-video rounded-lg border border-white/20 hover:border-white/40 transition-all relative overflow-hidden"
                      >
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-white text-xs font-medium text-center px-2">
                            {preset.name}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-white">Image personnalisée</h4>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customImageUrl}
                        onChange={(e) => setCustomImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (customImageUrl) {
                            applyImage(customImageUrl);
                            setCustomImageUrl('');
                          }
                        }}
                        className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg"
                      >
                        <Check size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Vidéo */}
              {localBackground.type === 'video' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-white">Vidéo de fond</h3>
                  
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={customVideoUrl}
                        onChange={(e) => setCustomVideoUrl(e.target.value)}
                        placeholder="https://example.com/video.mp4"
                        className="flex-1 p-3 rounded-lg bg-white/10 border border-white/20 text-white"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (customVideoUrl) {
                            const newBackground = {
                              ...localBackground,
                              video: {
                                url: customVideoUrl,
                                opacity: 0.7,
                                blur: 0,
                                speed: 1
                              }
                            };
                            applyIfPreview(newBackground);
                            setCustomVideoUrl('');
                          }
                        }}
                        className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg"
                      >
                        <Check size={16} />
                      </motion.button>
                    </div>

                    {localBackground.video && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Opacité</label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={localBackground.video.opacity || 0.7}
                            onChange={(e) => {
                              const newBackground = {
                                ...localBackground,
                                video: {
                                  ...localBackground.video!,
                                  opacity: parseFloat(e.target.value)
                                }
                              };
                              applyIfPreview(newBackground);
                            }}
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Flou</label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={localBackground.video.blur || 0}
                            onChange={(e) => {
                              const newBackground = {
                                ...localBackground,
                                video: {
                                  ...localBackground.video!,
                                  blur: parseInt(e.target.value)
                                }
                              };
                              applyIfPreview(newBackground);
                            }}
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Motifs */}
              {localBackground.type === 'pattern' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <h3 className="font-semibold text-white">Motifs</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {predefinedPatterns.map((pattern, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const newBackground = {
                            ...localBackground,
                            pattern: {
                              type: pattern.type,
                              color: '#6366f1',
                              size: 20,
                              opacity: 0.05 // CORRIGÉ: Opacité très faible par défaut
                            }
                          };
                          applyIfPreview(newBackground);
                        }}
                        className="p-4 rounded-lg border border-white/20 hover:border-white/40 transition-all bg-gray-800"
                      >
                        {/* CORRIGÉ: Aperçu du motif avec fond sombre */}
                        <div 
                          className="aspect-square rounded bg-gray-800 mb-2 border border-white/10"
                          style={{
                            backgroundImage: pattern.type === 'dots' 
                              ? 'radial-gradient(circle, #6366f1 1px, transparent 1px)'
                              : pattern.type === 'grid'
                              ? 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)'
                              : 'repeating-linear-gradient(45deg, #6366f1 0, #6366f1 1px, transparent 0, transparent 20px)',
                            backgroundSize: '20px 20px',
                            opacity: 0.3
                          }}
                        />
                        <div className="text-center text-sm text-white">
                          {pattern.name}
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {localBackground.pattern && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Couleur</label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setShowColorPicker(!showColorPicker)}
                            className="w-8 h-8 rounded border border-white/20"
                            style={{ backgroundColor: localBackground.pattern.color }}
                          />
                          <input
                            type="text"
                            value={localBackground.pattern.color}
                            onChange={(e) => {
                              const newBackground = {
                                ...localBackground,
                                pattern: {
                                  ...localBackground.pattern!,
                                  color: e.target.value
                                }
                              };
                              applyIfPreview(newBackground);
                            }}
                            className="flex-1 p-2 rounded bg-white/10 border border-white/20 text-white font-mono text-sm"
                          />
                        </div>
                        {showColorPicker && (
                          <div className="mt-2">
                            <HexColorPicker
                              color={localBackground.pattern.color}
                              onChange={(color) => {
                                const newBackground = {
                                  ...localBackground,
                                  pattern: {
                                    ...localBackground.pattern!,
                                    color
                                  }
                                };
                                applyIfPreview(newBackground);
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Taille</label>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          step="5"
                          value={localBackground.pattern.size}
                          onChange={(e) => {
                            const newBackground = {
                              ...localBackground,
                              pattern: {
                                ...localBackground.pattern!,
                                size: parseInt(e.target.value)
                              }
                            };
                            applyIfPreview(newBackground);
                          }}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">
                          Opacité: {Math.round((localBackground.pattern.opacity || 0.05) * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0.01"
                          max="0.2"
                          step="0.01"
                          value={localBackground.pattern.opacity}
                          onChange={(e) => {
                            const newBackground = {
                              ...localBackground,
                              pattern: {
                                ...localBackground.pattern!,
                                opacity: parseFloat(e.target.value)
                              }
                            };
                            applyIfPreview(newBackground);
                          }}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-4 border-t border-white/10"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Layers size={16} />
                    Overlay
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Activer</span>
                    <button
                      onClick={() => {
                        const newBackground = {
                          ...localBackground,
                          overlay: {
                            enabled: !localBackground.overlay?.enabled,
                            color: localBackground.overlay?.color || '#000000',
                            opacity: localBackground.overlay?.opacity || 0.3
                          }
                        };
                        applyIfPreview(newBackground);
                      }}
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        localBackground.overlay?.enabled
                          ? 'bg-indigo-500'
                          : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          localBackground.overlay?.enabled ? 'translate-x-4' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {localBackground.overlay?.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Couleur</label>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-8 h-8 rounded border border-white/20"
                          style={{ backgroundColor: localBackground.overlay.color }}
                        />
                        <input
                          type="text"
                          value={localBackground.overlay.color}
                          onChange={(e) => {
                            const newBackground = {
                              ...localBackground,
                              overlay: {
                                ...localBackground.overlay!,
                                color: e.target.value
                              }
                            };
                            applyIfPreview(newBackground);
                          }}
                          className="flex-1 p-2 rounded bg-white/10 border border-white/20 text-white font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Opacité</label>
                      <input
                        type="range"
                        min="0.1"
                        max="0.9"
                        step="0.1"
                        value={localBackground.overlay.opacity}
                        onChange={(e) => {
                          const newBackground = {
                            ...localBackground,
                            overlay: {
                              ...localBackground.overlay!,
                              opacity: parseFloat(e.target.value)
                            }
                          };
                          applyIfPreview(newBackground);
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Aperçu</h3>
              
              <div className="space-y-3">
                {/* Desktop */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Monitor size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">Desktop</span>
                  </div>
                  <div
                    className="aspect-video rounded-lg border border-white/20 overflow-hidden relative"
                    style={generateBackgroundCSS(localBackground)}
                  >
                    {/* CORRIGÉ: Overlay pour les motifs */}
                    {localBackground.type === 'pattern' && localBackground.pattern && (
                      <div 
                        className="absolute inset-0"
                        style={{ 
                          opacity: localBackground.pattern.opacity,
                          mixBlendMode: 'overlay'
                        }}
                      />
                    )}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <div className="w-1/2 h-1/2 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                        <span className="text-white text-xs">Aperçu</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tablet */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tablet size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">Tablet</span>
                  </div>
                  <div
                    className="aspect-[4/3] w-1/2 mx-auto rounded-lg border border-white/20 overflow-hidden relative"
                    style={generateBackgroundCSS(localBackground)}
                  >
                    {localBackground.type === 'pattern' && localBackground.pattern && (
                      <div 
                        className="absolute inset-0"
                        style={{ 
                          opacity: localBackground.pattern.opacity,
                          mixBlendMode: 'overlay'
                        }}
                      />
                    )}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <div className="w-1/2 h-1/2 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                        <span className="text-white text-xs">Aperçu</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-400">Mobile</span>
                  </div>
                  <div
                    className="aspect-[9/16] w-1/4 mx-auto rounded-lg border border-white/20 overflow-hidden relative"
                    style={generateBackgroundCSS(localBackground)}
                  >
                    {localBackground.type === 'pattern' && localBackground.pattern && (
                      <div 
                        className="absolute inset-0"
                        style={{ 
                          opacity: localBackground.pattern.opacity,
                          mixBlendMode: 'overlay'
                        }}
                      />
                    )}
                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                      <div className="w-1/2 h-1/4 bg-white/10 rounded-lg border border-white/20 flex items-center justify-center">
                        <span className="text-white text-xs">Aperçu</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Génération aléatoire */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateRandom}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 hover:from-orange-500/30 hover:to-red-500/30 text-orange-400 transition-all"
              >
                <RefreshCw size={16} />
                Fond aléatoire
              </motion.button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-white/5">
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
            >
              Réinitialiser
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleApply}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2"
            >
              <Wand2 size={16} />
              Appliquer
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};