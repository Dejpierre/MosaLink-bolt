'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Image, Type, MessageSquare, Grid, Mail } from 'lucide-react';
import { useStore } from '../store/useStore';
import { BentoCard } from '../types';

interface MobileAddButtonProps {
  className?: string;
}

export const MobileAddButton: React.FC<MobileAddButtonProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { addCard } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddBlock = async (type: 'image' | 'text' | 'multi' | 'form' | 'newsletter') => {
    let newCard: Omit<BentoCard, 'id' | 'order'>;
    
    switch (type) {
      case 'image':
        newCard = {
          title: 'Image/Vidéo',
          description: '',
          url: '',
          backgroundColor: '#6366f1',
          textColor: '#ffffff',
          size: '2x2' as const,
          backgroundImage: 'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
        };
        break;
      
      case 'text':
        newCard = {
          title: 'Bloc de texte',
          description: 'Cliquez pour éditer ce bloc de texte et ajouter votre contenu. Vous pouvez modifier le style, la police et les couleurs.',
          url: '',
          backgroundColor: '#1e293b',
          textColor: '#ffffff',
          size: '2x1' as const,
          typography: {
            fontFamily: 'inter',
            titleWeight: '700',
            descriptionWeight: '400',
            textAlign: 'left',
            titleSize: 'xl',
            descriptionSize: 'base'
          }
        };
        break;
      
      case 'multi':
        newCard = {
          title: 'Multi-redirections',
          description: 'Bloc avec plusieurs liens',
          url: '',
          backgroundColor: '#4c1d95',
          textColor: '#ffffff',
          size: '2x2' as const,
          internalLayout: {
            enabled: true,
            elements: [
              {
                id: `element-${Date.now()}-1`,
                type: 'button',
                zone: 'top-left',
                buttonText: 'Lien 1',
                buttonUrl: 'https://example.com/1',
                styles: {
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ffffff',
                  backgroundColor: '#6366f1',
                  borderRadius: '8px',
                  padding: '8px'
                }
              },
              {
                id: `element-${Date.now()}-2`,
                type: 'button',
                zone: 'top-right',
                buttonText: 'Lien 2',
                buttonUrl: 'https://example.com/2',
                styles: {
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ffffff',
                  backgroundColor: '#8b5cf6',
                  borderRadius: '8px',
                  padding: '8px'
                }
              },
              {
                id: `element-${Date.now()}-3`,
                type: 'button',
                zone: 'bottom-left',
                buttonText: 'Lien 3',
                buttonUrl: 'https://example.com/3',
                styles: {
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ffffff',
                  backgroundColor: '#a855f7',
                  borderRadius: '8px',
                  padding: '8px'
                }
              },
              {
                id: `element-${Date.now()}-4`,
                type: 'button',
                zone: 'bottom-right',
                buttonText: 'Lien 4',
                buttonUrl: 'https://example.com/4',
                styles: {
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#ffffff',
                  backgroundColor: '#d946ef',
                  borderRadius: '8px',
                  padding: '8px'
                }
              }
            ],
            showGrid: false
          }
        };
        break;
      
      case 'form':
        newCard = {
          title: 'Contactez-nous',
          description: 'Envoyez-nous un message et nous vous répondrons rapidement',
          url: '',
          backgroundColor: '#0f766e',
          textColor: '#ffffff',
          size: '2x2' as const,
          contactFormData: {
            type: 'contact',
            buttonText: 'Envoyer',
            placeholderText: 'Votre message...',
            successMessage: 'Message envoyé avec succès ! Nous vous répondrons bientôt.'
          }
        };
        break;
        
      case 'newsletter':
        newCard = {
          title: 'Newsletter',
          description: 'Inscrivez-vous pour recevoir nos dernières actualités',
          url: '',
          backgroundColor: '#7c2d12',
          textColor: '#ffffff',
          size: '2x1' as const,
          contactFormData: {
            type: 'newsletter',
            buttonText: 'S\'inscrire',
            placeholderText: 'Votre email...',
            successMessage: 'Merci pour votre inscription !'
          }
        };
        break;
    }
    
    const result = await addCard(newCard);
    
    if (result.success) {
      setIsOpen(false);
    } else {
      alert(result.error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Add Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-40 right-4 z-50 p-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg ${className}`}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </motion.button>

      {/* Mobile Add Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-24 right-4 z-50 bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl w-64"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Add Block</h3>
            
            <div className="space-y-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddBlock('image')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Image size={18} className="text-blue-400" />
                </div>
                <span>Image/Video</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddBlock('text')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Type size={18} className="text-green-400" />
                </div>
                <span>Text</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddBlock('multi')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Grid size={18} className="text-purple-400" />
                </div>
                <span>Multi-Links</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddBlock('form')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <div className="p-2 rounded-lg bg-orange-500/20">
                  <MessageSquare size={18} className="text-orange-400" />
                </div>
                <span>Contact Form</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAddBlock('newsletter')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <div className="p-2 rounded-lg bg-pink-500/20">
                  <Mail size={18} className="text-pink-400" />
                </div>
                <span>Newsletter</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileAddButton;