import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { BentoCard } from '../types';
import dynamic from 'next/dynamic';
import { ProfileSection } from './ProfileSection';
import { CompanyLogoSection } from './CompanyLogoSection';

// Dynamically import all client-side components to prevent hydration issues
const BentoGrid = dynamic(() => import('./BentoGrid').then(mod => ({ default: mod.BentoGrid })), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-400">Loading grid...</div>
    </div>
  )
});

const DeviceLayoutSwitcher = dynamic(() => import('./DeviceLayoutSwitcher').then(mod => ({ default: mod.DeviceLayoutSwitcher })), {
  ssr: false
});

const MobileAddButton = dynamic(() => import('./MobileAddButton').then(mod => ({ default: mod.MobileAddButton })), {
  ssr: false
});

const LayoutControls = dynamic(() => import('./LayoutControls').then(mod => ({ default: mod.LayoutControls })), {
  ssr: false
});

const CardEditorPopup = dynamic(() => import('./CardEditorPopup').then(mod => ({ default: mod.CardEditorPopup })), {
  ssr: false
});

const MobileCardEditor = dynamic(() => import('./MobileCardEditor').then(mod => ({ default: mod.MobileCardEditor })), {
  ssr: false
});

const PreviewMode = dynamic(() => import('./PreviewMode').then(mod => ({ default: mod.PreviewMode })), {
  ssr: false
});

export default function BentoFlow() {
  const { 
    getCurrentDeviceCards,
    addCard, 
    userPlan, 
    profilePlacement, 
    getProfileCard,
    selectCard,
    selectedCardId,
    profile,
    currentLayout
  } = useStore();
  
  const cards = getCurrentDeviceCards();
  
  // Client-side only state - initialized to prevent hydration mismatch
  const [isClientMobile, setIsClientMobile] = useState<boolean>(false);
  const [isClientRealMobileDevice, setIsClientRealMobileDevice] = useState<boolean>(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [mounted, setMounted] = useState<boolean>(false);
  
  const isCompany = profile.type === 'company';
  
  // Detect client-side specific values after component mounts
  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsClientMobile(window.innerWidth < 768);
    };
    
    const checkRealMobileDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsClientRealMobileDevice(isMobileDevice);
    };
    
    checkMobile();
    checkRealMobileDevice();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to find next available position
  const findNextAvailablePosition = () => {
    const maxCols = currentLayout === 'mobile' ? 2 : currentLayout === 'tablet' ? 4 : 12;
    const maxRows = 6;
    
    // Determine the size of the card we want to place
    const newCardSize = currentLayout === 'mobile' ? { colSpan: 1, rowSpan: 1 } : 
                     currentLayout === 'tablet' ? { colSpan: 2, rowSpan: 2 } :
                     { colSpan: 2, rowSpan: 2 }; // Gardé à 2x2 pour desktop par défaut
    
    // Check each position in the grid
    for (let row = 0; row <= maxRows - newCardSize.rowSpan; row++) {
      for (let col = 0; col <= maxCols - newCardSize.colSpan; col++) {
        // Check if this position and the required space is free
        let canPlace = true;
        
        // Check all cells that the new card would occupy
        for (let r = row; r < row + newCardSize.rowSpan && canPlace; r++) {
          for (let c = col; c < col + newCardSize.colSpan && canPlace; c++) {
            // Check if any existing card occupies this cell
            const isOccupied = cards.some(card => {
              if (!card.gridPosition) return false;
              
              // Get card size adapted to current layout
              const [cardColSpan, cardRowSpan] = card.size.split('x').map(Number);
              const adaptedColSpan = currentLayout === 'mobile' ? Math.min(cardColSpan, 2) :
                                    currentLayout === 'tablet' ? Math.min(cardColSpan, 4) :
                                    Math.min(cardColSpan, 12);
              
              // Check if this card occupies the cell (c, r)
              return c >= card.gridPosition.col && 
                     c < card.gridPosition.col + adaptedColSpan &&
                     r >= card.gridPosition.row && 
                     r < card.gridPosition.row + cardRowSpan;
            });
            
            if (isOccupied) {
              canPlace = false;
            }
          }
        }
        
        if (canPlace) {
          console.log(`Found position: (${col}, ${row}) for ${newCardSize.colSpan}x${newCardSize.rowSpan} card`);
          return { col, row };
        }
      }
    }
    
    // If no position found, return 0,0 as fallback
    console.warn('No free position found, using fallback (0,0)');
    return { col: 0, row: 0 };
  };

  // Function to add a new card - CORRECTED
  const handleAddCard = async (type: BentoCard['type'] = 'standard') => {
    const newCard: Partial<BentoCard> = {
      type,
      title: '',
      description: '',
      url: '',
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
      size: cardSize as any,
      gridPosition: position
    };
    
    console.log('New card data:', newCard);
    
    try {
      const result = await addCard(newCard);
      console.log('Add card result:', result);
      
      if (!result.success) {
        console.error('Failed to add card:', result.error);
        alert(result.error || 'Erreur lors de l\'ajout de la carte');
      } else {
        console.log('Card added successfully, opening editor');
        // Open editor for the new card
        selectCard(result.cardId || null);
      }
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Erreur lors de l\'ajout de la carte');
    }
  };

  // Check plan limits
  const canAddMoreCards = () => {
    if (userPlan === 'free') return cards.length < 3;
    if (userPlan === 'starter') return cards.length < 25;
    return true; // Pro plan = unlimited
  };

  const getMaxCards = () => {
    if (userPlan === 'free') return 3;
    if (userPlan === 'starter') return 25;
    return '∞';
  };

  // Calculate container dimensions based on device
  const getDeviceContainerStyle = () => {
    if (currentLayout === 'mobile') {
      return {
        maxWidth: '375px',
        margin: '0 auto 7rem',
        border: '8px solid #333',
        borderRadius: '24px',
        backgroundColor: '',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '16px'
      };
    } else if (currentLayout === 'tablet') {
      return {
        maxWidth: '768px',
        margin: '0 auto 4rem',
        border: '8px solid #333',
        borderRadius: '16px',
        backgroundColor: '',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '16px'
      };
    } else {
      return {
        width: '100%'
      };
    }
  };

  // Check if we should disable adding blocks
  // We disable if:
  // 1. We're in mobile mode AND
  // 2. We're on a real mobile device OR we're simulating mobile
  const shouldDisableAddBlocks = () => {
    return mounted && currentLayout === 'mobile' && (isClientRealMobileDevice || isClientMobile);
  };

  // Handle card editing
  const handleEditCard = (cardId: string) => {
    selectCard(cardId);
  };

  // Handle closing card editor
  const handleCloseCardEditor = () => {
    selectCard(null);
  };

  // Handle opening preview mode
  const handleOpenPreview = () => {
    setPreviewMode(true);
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Profile Section - Only shown if mode = 'header' */}
      {profilePlacement.mode === 'header' && (
        <div 
          className="relative z-10 flex-shrink-0 px-8 py-4 cursor-pointer sticky top-0 bg-white/80 backdrop-blur-sm"
        >
          <div className="w-full mx-auto relative">
            {isCompany ? <CompanyLogoSection /> : <ProfileSection />}
          </div>
        </div>
      )}

      {/* Responsive grid indicator */}
      <div className={`relative z-10 flex-shrink-0 px-4 pb-2 sticky bg-white/80 backdrop-blur-sm ${
        profilePlacement.mode === 'header' ? 'top-[88px]' : 'top-0'
      }`}>
        <div className="w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between text-xs text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                currentLayout === 'mobile' ? 'bg-orange-400' : 
                currentLayout === 'tablet' ? 'bg-blue-400' : 'bg-green-400'
              }`} />
              <span className="capitalize">{currentLayout}</span>
              <span className="text-gray-300">•</span>
              <span>{cards.length}/{getMaxCards()} carte{cards.length > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-3">
              {userPlan !== 'pro' && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-yellow-400 font-medium">Plan {userPlan.toUpperCase()}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Layout controls for desktop - only render after mount */}
      {mounted && !isClientMobile && (
        <div className="relative z-10 flex-shrink-0 px-4 pb-4">
          <div className="w-full max-w-7xl mx-auto flex justify-center">
            <DeviceLayoutSwitcher />
          </div>
        </div>
      )}

      {/* Main grid container */}
      <div className="relative z-10 flex-1 w-full px-4 pb-8">
        <div style={getDeviceContainerStyle()}>
          {/* Use BentoGrid component */}
          <BentoGrid 
            cards={cards}
            onCardClick={handleEditCard}
            className="w-full"
          />
          
          {/* Message if grid is empty */}
          {cards.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10 flex items-center justify-center p-8 min-h-[400px]"
            >
              <div className="text-center text-gray-400 max-w-md">
                <div className={`mx-auto mb-4 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center ${
                  currentLayout === 'mobile' ? 'w-16 h-16' : 'w-20 h-20'
                }`}>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 ${
                      currentLayout === 'mobile' ? 'w-8 h-8' : 'w-10 h-10'
                    }`}
                  />
                </div>
                <h3 className={`font-semibold mb-2 text-gray-600 ${currentLayout === 'mobile' ? 'text-lg' : 'text-xl'}`}>
                  Votre Grille est Vide
                </h3>
                <p className={`text-gray-500 ${currentLayout === 'mobile' ? 'text-sm' : 'text-base'}`}>
                  {shouldDisableAddBlocks()
                    ? 'Utilisez le bouton + en bas à droite pour ajouter une carte'
                    : 'Survolez une cellule de la grille et cliquez sur le bouton + pour ajouter une carte'
                  }
                </p>
                {/* Add button for empty state when not on mobile */}
                {!shouldDisableAddBlocks() && (
                  <motion.button
                    onClick={() => handleAddCard('standard')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-colors"
                  >
                    Ajouter ma première carte
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Add Button - Only visible in mobile mode on mobile device */}
      {shouldDisableAddBlocks() && canAddMoreCards() && (
        <MobileAddButton onAddCard={handleAddCard} />
      )}

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 bg-black/80 text-white p-2 text-xs rounded z-50">
          <div>Layout: {currentLayout}</div>
          <div>Cards: {cards.length}</div>
          <div>Mounted: {mounted.toString()}</div>
          <div>Mobile: {isClientMobile.toString()}</div>
          <div>Real Mobile: {isClientRealMobileDevice.toString()}</div>
          <div>Should Disable: {shouldDisableAddBlocks().toString()}</div>
        </div>
      )}

      {/* Layout Controls for Mobile - only render after mount */}
      {mounted && isClientMobile && (
        <div className="fixed bottom-20 left-4 z-50">
          <LayoutControls onOpenPreview={handleOpenPreview} />
        </div>
      )}

      {/* Card Editor Popup - Desktop - only render after mount */}
      <AnimatePresence>
        {mounted && selectedCardId && !isClientMobile && (
          <CardEditorPopup 
            cardId={selectedCardId} 
            onClose={handleCloseCardEditor} 
          />
        )}
      </AnimatePresence>

      {/* Mobile Card Editor - only render after mount */}
      <AnimatePresence>
        {mounted && selectedCardId && isClientMobile && (
          <MobileCardEditor
            cardId={selectedCardId}
            onClose={handleCloseCardEditor}
          />
        )}
      </AnimatePresence>

      {/* Preview Mode - only render after mount */}
      <AnimatePresence>
        {mounted && previewMode && (
          <PreviewMode
            isOpen={previewMode}
            onClose={() => setPreviewMode(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}