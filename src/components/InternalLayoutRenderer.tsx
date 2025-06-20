import React from 'react';
import { motion } from 'framer-motion';
import { InternalLayout, InternalLayoutElement } from '../types';
import * as Icons from 'lucide-react';

interface InternalLayoutRendererProps {
  layout: InternalLayout;
  className?: string;
}

export const InternalLayoutRenderer: React.FC<InternalLayoutRendererProps> = ({
  layout,
  className = ''
}) => {
  if (!layout.enabled || layout.elements.length === 0) {
    return null;
  }

  const getElementsInZone = (zone: string) => {
    return layout.elements.filter(el => el.zone === zone);
  };

  const renderElement = (element: InternalLayoutElement) => {
    const styles = {
      fontSize: element.styles?.fontSize || '14px',
      fontWeight: element.styles?.fontWeight || '400',
      color: element.styles?.color || '#ffffff',
      backgroundColor: element.styles?.backgroundColor || 'transparent',
      borderRadius: element.styles?.borderRadius || '8px',
      padding: element.styles?.padding || '8px',
    };

    switch (element.type) {
      case 'text':
        return (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles}
            className="rounded transition-all"
          >
            {element.content}
          </motion.div>
        );

      case 'image':
        return element.imageUrl ? (
          <motion.img
            key={element.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={element.imageUrl}
            alt="Layout element"
            style={{
              borderRadius: styles.borderRadius,
              backgroundColor: styles.backgroundColor,
              padding: styles.padding
            }}
            className="max-w-full h-auto object-cover transition-all"
          />
        ) : null;

      case 'icon':
        if (element.iconName) {
          const IconComponent = Icons[element.iconName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join('') as keyof typeof Icons] as React.ComponentType<{ size?: number }>;
          
          return IconComponent ? (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles}
              className="inline-flex items-center justify-center rounded transition-all"
            >
              <IconComponent size={parseInt(styles.fontSize) + 4} />
            </motion.div>
          ) : null;
        }
        return null;

      case 'button':
        return (
          <motion.button
            key={element.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (element.buttonUrl) {
                window.open(element.buttonUrl, '_blank', 'noopener,noreferrer');
              }
            }}
            style={styles}
            className="rounded transition-all cursor-pointer hover:opacity-80"
          >
            {element.buttonText || 'Bouton'}
          </motion.button>
        );

      case 'music':
        return (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles}
            className="flex items-center gap-2 rounded transition-all"
          >
            <Icons.Music size={parseInt(styles.fontSize)} />
            <span>Musique</span>
          </motion.div>
        );

      case 'video':
        return (
          <motion.div
            key={element.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={styles}
            className="flex items-center gap-2 rounded transition-all"
          >
            <Icons.Video size={parseInt(styles.fontSize)} />
            <span>Vidéo</span>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const renderZone = (zone: string) => {
    const elements = getElementsInZone(zone);
    if (elements.length === 0) return null;

    return (
      <div className="space-y-2">
        {elements.map(renderElement)}
      </div>
    );
  };

  return (
    <div className={`absolute inset-0 p-4 pointer-events-none ${className}`}>
      {/* Grille de debug si activée */}
      {layout.showGrid && (
        <div className="absolute inset-4 grid grid-cols-2 grid-rows-2 gap-2 pointer-events-none">
          <div className="border border-dashed border-white/30 rounded"></div>
          <div className="border border-dashed border-white/30 rounded"></div>
          <div className="border border-dashed border-white/30 rounded"></div>
          <div className="border border-dashed border-white/30 rounded"></div>
        </div>
      )}

      {/* Contenu des zones */}
      <div className="h-full grid grid-cols-2 grid-rows-2 gap-2">
        {/* Zone haut-gauche */}
        <div className="flex flex-col justify-start items-start pointer-events-auto">
          {renderZone('top-left')}
        </div>

        {/* Zone haut-droite */}
        <div className="flex flex-col justify-start items-end pointer-events-auto">
          {renderZone('top-right')}
        </div>

        {/* Zone bas-gauche */}
        <div className="flex flex-col justify-end items-start pointer-events-auto">
          {renderZone('bottom-left')}
        </div>

        {/* Zone bas-droite */}
        <div className="flex flex-col justify-end items-end pointer-events-auto">
          {renderZone('bottom-right')}
        </div>
      </div>
    </div>
  );
};