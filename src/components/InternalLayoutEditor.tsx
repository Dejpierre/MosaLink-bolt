import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, 
  Plus, 
  Type, 
  Image, 
  Star, 
  MousePointer, 
  Music, 
  Video,
  Trash2,
  Edit3,
  Move,
  Eye,
  EyeOff,
  Palette,
  Settings
} from 'lucide-react';
import { InternalLayout, InternalLayoutElement, InternalLayoutZone } from '../types';
import { HexColorPicker } from 'react-colorful';
import * as Icons from 'lucide-react';

interface InternalLayoutEditorProps {
  layout: InternalLayout;
  onLayoutChange: (layout: InternalLayout) => void;
  className?: string;
}

const ZONE_LABELS = {
  'top-left': 'Haut Gauche',
  'top-right': 'Haut Droite',
  'bottom-left': 'Bas Gauche',
  'bottom-right': 'Bas Droite'
};

const ELEMENT_TYPES = [
  { type: 'text', label: 'Texte', icon: Type },
  { type: 'image', label: 'Image', icon: Image },
  { type: 'icon', label: 'Icône', icon: Star },
  { type: 'button', label: 'Bouton', icon: MousePointer },
  { type: 'music', label: 'Musique', icon: Music },
  { type: 'video', label: 'Vidéo', icon: Video }
];

const ICON_OPTIONS = [
  'star', 'heart', 'bookmark', 'tag', 'home', 'user', 'settings', 'mail', 
  'phone', 'map-pin', 'briefcase', 'book', 'music', 'camera', 'video', 
  'image', 'github', 'twitter', 'linkedin', 'instagram', 'facebook', 
  'youtube', 'coffee', 'utensils', 'wine', 'chef-hat', 'cake'
];

export const InternalLayoutEditor: React.FC<InternalLayoutEditorProps> = ({
  layout,
  onLayoutChange,
  className = ''
}) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<InternalLayoutElement | null>(null);

  const toggleLayout = () => {
    onLayoutChange({
      ...layout,
      enabled: !layout.enabled
    });
  };

  const toggleGrid = () => {
    onLayoutChange({
      ...layout,
      showGrid: !layout.showGrid
    });
  };

  const addElement = (type: string, zone: InternalLayoutZone) => {
    const newElement: InternalLayoutElement = {
      id: `element-${Date.now()}`,
      type: type as any,
      zone,
      content: type === 'text' ? 'Nouveau texte' : undefined,
      buttonText: type === 'button' ? 'Cliquez ici' : undefined,
      iconName: type === 'icon' ? 'star' : undefined,
      styles: {
        fontSize: '14px',
        fontWeight: '400',
        color: '#ffffff',
        backgroundColor: type === 'button' ? '#6366f1' : 'transparent',
        borderRadius: '8px',
        padding: '8px'
      }
    };

    onLayoutChange({
      ...layout,
      elements: [...layout.elements, newElement]
    });
  };

  const updateElement = (elementId: string, updates: Partial<InternalLayoutElement>) => {
    onLayoutChange({
      ...layout,
      elements: layout.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      )
    });
  };

  const deleteElement = (elementId: string) => {
    onLayoutChange({
      ...layout,
      elements: layout.elements.filter(el => el.id !== elementId)
    });
  };

  const moveElement = (elementId: string, newZone: InternalLayoutZone) => {
    updateElement(elementId, { zone: newZone });
  };

  const getElementsInZone = (zone: InternalLayoutZone) => {
    return layout.elements.filter(el => el.zone === zone);
  };

  const handleDragStart = (element: InternalLayoutElement) => {
    setDraggedElement(element);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, zone: InternalLayoutZone) => {
    e.preventDefault();
    if (draggedElement) {
      moveElement(draggedElement.id, zone);
      setDraggedElement(null);
    }
  };

  const renderZone = (zone: InternalLayoutZone) => {
    const elements = getElementsInZone(zone);
    
    return (
      <div
        key={zone}
        className={`relative border-2 border-dashed border-white/30 rounded-lg p-3 min-h-[80px] transition-all ${
          draggedElement ? 'border-indigo-400 bg-indigo-500/10' : 'hover:border-white/50'
        }`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, zone)}
      >
        <div className="absolute top-1 left-1 text-xs text-white/60 font-mono">
          {ZONE_LABELS[zone]}
        </div>
        
        <div className="mt-4 space-y-2">
          {elements.map((element) => (
            <motion.div
              key={element.id}
              draggable
              onDragStart={() => handleDragStart(element)}
              whileHover={{ scale: 1.02 }}
              className={`p-2 rounded-lg bg-white/10 border border-white/20 cursor-move group ${
                selectedElement === element.id ? 'ring-2 ring-indigo-400' : ''
              }`}
              onClick={() => setSelectedElement(element.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {element.type === 'text' && <Type size={14} />}
                  {element.type === 'image' && <Image size={14} />}
                  {element.type === 'icon' && <Star size={14} />}
                  {element.type === 'button' && <MousePointer size={14} />}
                  {element.type === 'music' && <Music size={14} />}
                  {element.type === 'video' && <Video size={14} />}
                  <span className="text-xs text-white">
                    {element.content || element.buttonText || element.iconName || element.type}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteElement(element.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded bg-red-500/20 hover:bg-red-500/40 transition-all"
                >
                  <Trash2 size={12} className="text-red-400" />
                </motion.button>
              </div>
            </motion.div>
          ))}
          
          {/* Bouton d'ajout */}
          <div className="flex flex-wrap gap-1">
            {ELEMENT_TYPES.map(({ type, icon: Icon }) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => addElement(type, zone)}
                className="p-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                title={`Ajouter ${type}`}
              >
                <Icon size={12} className="text-white/60" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderElementEditor = () => {
    const element = layout.elements.find(el => el.id === selectedElement);
    if (!element) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-white flex items-center gap-2">
            <Edit3 size={16} />
            Éditer l'élément
          </h4>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelectedElement(null)}
            className="p-1 rounded hover:bg-white/10"
          >
            <Eye size={14} className="text-gray-400" />
          </motion.button>
        </div>

        {/* Contenu selon le type */}
        {element.type === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-2">Texte</label>
            <textarea
              value={element.content || ''}
              onChange={(e) => updateElement(element.id, { content: e.target.value })}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm resize-none"
              rows={2}
              placeholder="Votre texte..."
            />
          </div>
        )}

        {element.type === 'image' && (
          <div>
            <label className="block text-sm font-medium mb-2">URL de l'image</label>
            <input
              type="url"
              value={element.imageUrl || ''}
              onChange={(e) => updateElement(element.id, { imageUrl: e.target.value })}
              className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        )}

        {element.type === 'icon' && (
          <div>
            <label className="block text-sm font-medium mb-2">Icône</label>
            <div className="grid grid-cols-6 gap-1 max-h-32 overflow-y-auto">
              {ICON_OPTIONS.map((iconName) => {
                const IconComponent = Icons[iconName.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join('') as keyof typeof Icons] as React.ComponentType<{ size?: number }>;
                
                return IconComponent ? (
                  <motion.button
                    key={iconName}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateElement(element.id, { iconName })}
                    className={`p-2 rounded border transition-all ${
                      element.iconName === iconName
                        ? 'border-indigo-400 bg-indigo-500/20'
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <IconComponent size={16} />
                  </motion.button>
                ) : null;
              })}
            </div>
          </div>
        )}

        {element.type === 'button' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-2">Texte du bouton</label>
              <input
                type="text"
                value={element.buttonText || ''}
                onChange={(e) => updateElement(element.id, { buttonText: e.target.value })}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                placeholder="Cliquez ici"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL du bouton</label>
              <input
                type="url"
                value={element.buttonUrl || ''}
                onChange={(e) => updateElement(element.id, { buttonUrl: e.target.value })}
                className="w-full p-2 rounded bg-white/10 border border-white/20 text-white text-sm"
                placeholder="https://example.com"
              />
            </div>
          </div>
        )}

        {/* Styles */}
        <div className="space-y-3">
          <h5 className="font-medium text-white text-sm flex items-center gap-2">
            <Palette size={14} />
            Styles
          </h5>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Taille</label>
              <select
                value={element.styles?.fontSize || '14px'}
                onChange={(e) => updateElement(element.id, {
                  styles: { ...element.styles, fontSize: e.target.value }
                })}
                className="w-full p-1 rounded bg-white/10 border border-white/20 text-white text-xs"
              >
                <option value="10px">10px</option>
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Poids</label>
              <select
                value={element.styles?.fontWeight || '400'}
                onChange={(e) => updateElement(element.id, {
                  styles: { ...element.styles, fontWeight: e.target.value }
                })}
                className="w-full p-1 rounded bg-white/10 border border-white/20 text-white text-xs"
              >
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Couleur texte</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowColorPicker(showColorPicker === `${element.id}-color` ? null : `${element.id}-color`)}
                  className="w-6 h-6 rounded border border-white/20"
                  style={{ backgroundColor: element.styles?.color || '#ffffff' }}
                />
                <input
                  type="text"
                  value={element.styles?.color || '#ffffff'}
                  onChange={(e) => updateElement(element.id, {
                    styles: { ...element.styles, color: e.target.value }
                  })}
                  className="flex-1 p-1 rounded bg-white/10 border border-white/20 text-white text-xs font-mono"
                />
              </div>
              {showColorPicker === `${element.id}-color` && (
                <div className="mt-2">
                  <HexColorPicker
                    color={element.styles?.color || '#ffffff'}
                    onChange={(color) => updateElement(element.id, {
                      styles: { ...element.styles, color }
                    })}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Couleur fond</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowColorPicker(showColorPicker === `${element.id}-bg` ? null : `${element.id}-bg`)}
                  className="w-6 h-6 rounded border border-white/20"
                  style={{ backgroundColor: element.styles?.backgroundColor || 'transparent' }}
                />
                <input
                  type="text"
                  value={element.styles?.backgroundColor || 'transparent'}
                  onChange={(e) => updateElement(element.id, {
                    styles: { ...element.styles, backgroundColor: e.target.value }
                  })}
                  className="flex-1 p-1 rounded bg-white/10 border border-white/20 text-white text-xs font-mono"
                />
              </div>
              {showColorPicker === `${element.id}-bg` && (
                <div className="mt-2">
                  <HexColorPicker
                    color={element.styles?.backgroundColor || '#000000'}
                    onChange={(color) => updateElement(element.id, {
                      styles: { ...element.styles, backgroundColor: color }
                    })}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20">
            <Grid size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-medium text-white">Layout Interne</h3>
            <p className="text-xs text-gray-400">
              Organisez le contenu en 4 zones
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleGrid}
            className={`p-2 rounded-lg transition-colors ${
              layout.showGrid 
                ? 'bg-indigo-500/20 text-indigo-400' 
                : 'bg-white/10 text-gray-400 hover:text-white'
            }`}
            title="Afficher/masquer la grille"
          >
            {layout.showGrid ? <Eye size={16} /> : <EyeOff size={16} />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLayout}
            className={`px-3 py-2 rounded-lg font-medium transition-all ${
              layout.enabled
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                : 'bg-white/10 text-gray-400 hover:text-white hover:bg-white/20'
            }`}
          >
            {layout.enabled ? 'Activé' : 'Activer'}
          </motion.button>
        </div>
      </div>

      {/* Layout Editor */}
      <AnimatePresence>
        {layout.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Grille 2x2 */}
            <div className="grid grid-cols-2 gap-3">
              {renderZone('top-left')}
              {renderZone('top-right')}
              {renderZone('bottom-left')}
              {renderZone('bottom-right')}
            </div>

            {/* Éditeur d'élément */}
            {selectedElement && renderElementEditor()}

            {/* Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20"
            >
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-purple-500/20">
                  <Grid size={14} className="text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-purple-400 text-sm">Layout Interne</h4>
                  <p className="text-xs text-gray-400 mt-1">
                    Glissez-déposez les éléments entre les zones. Cliquez sur un élément pour l'éditer. 
                    Chaque zone peut contenir plusieurs éléments qui s'empileront verticalement.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};