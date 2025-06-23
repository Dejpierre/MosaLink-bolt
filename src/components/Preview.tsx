import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import dynamic from 'next/dynamic';
import { ProfileSection } from './ProfileSection';
import { ProfileEditor } from './ProfileEditor';
import { ProfilePlacementSelector } from './ProfilePlacementSelector';
import { Building, Plus, Crown } from 'lucide-react';
import { CompanyLogoSection } from './CompanyLogoSection';

// Dynamically import components that depend on client-side state
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

const MobileCardEditor = dynamic(() => import('./MobileCardEditor').then(mod => ({ default: mod.MobileCardEditor })), {
  ssr: false
});

const MobileAddButton = dynamic(() => import('./MobileAddButton').then(mod => ({ default: mod.MobileAddButton })), {
  ssr: false
});

const CardEditorPopup = dynamic(() => import('./CardEditorPopup').then(mod => ({ default: mod.CardEditorPopup })), {
  ssr: false
});

export const Preview: React.FC = () => {
  const { 
    getCurrentDeviceCards,
    addCard, 
    userPlan, 
    profilePlacement, 
    getProfileCard,
    selectCard,
    selectedCardId,
    profile,
    currentLayout,
    updateCard
  } = useStore();
  
  const cards = getCurrentDeviceCards();
  
  const [showProfileEditor, setShowProfileEditor] = React.useState(false);
  const [showProfilePlacementSelector, setShowProfilePlacementSelector] = React.useState(false);
  
  // Client-side only state - initialized to prevent hydration mismatch
  const [isClientMobile, setIsClientMobile] = React.useState<boolean>(false);
  const [isClientRealMobileDevice, setIsClientRealMobileDevice] = React.useState<boolean>(false);
  const [mounted, setMounted] = React.useState<boolean>(false);
  
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

  const handleAddCard = async (type: BentoCard['type']) => {
    const newCard: BentoCard = {
      id: `card-${Date.now()}`,
      type,
      size: '2x3' as const,
      title: '',
      description: '',
      url: '',
      backgroundColor: '#6366f1',
      textColor: '#ffffff',
      gridPosition: { col, row }
    };
    
    const result = await addCard(newCard);
    
    if (!result.success) {
      alert(result.error);
    } else {
      // Ouvrir l'éditeur pour la nouvelle carte
      selectCard(result.cardId || null);
    }
  };

  // Vérifier les limites du plan
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

  // Gérer la fermeture de l'éditeur de carte
  const handleCloseCardEditor = () => {
    selectCard(null);
  };

  // Gérer l'édition d'une carte
  const handleEditCard = (cardId: string) => {
    selectCard(cardId);
  };

  // Calculer les dimensions du conteneur en fonction du device
  const getDeviceContainerStyle = () => {
    if (currentLayout === 'mobile') {
      return {
        maxWidth: '375px',
        margin: '0 auto 7rem',
        border: '8px solid #333',
        borderRadius: '24px',
        backgroundColor: '',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      };
    } else if (currentLayout === 'tablet') {
      return {
        maxWidth: '768px',
        margin: '0 auto 4rem',
        border: '8px solid #333',
        borderRadius: '16px',
        backgroundColor: '',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      };
    } else {
      return {
        width: '100%'
      };
    }
  };

  // Vérifier si on doit désactiver l'ajout de blocs
  // On désactive si:
  // 1. On est en mode mobile ET
  // 2. On est sur un vrai appareil mobile OU on simule le mobile
  const shouldDisableAddBlocks = () => {
    return mounted && currentLayout === 'mobile' && (isClientRealMobileDevice || isClientMobile);
  };

  // Obtenir la carte profil
  const profileCard = getProfileCard();

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Profile Section - Affiché seulement si mode = 'header' */}
      {profilePlacement.mode === 'header' && (
        <div 
          className="relative z-10 flex-shrink-0 px-8 py-4 cursor-pointer sticky top-0"
          onClick={() => setShowProfileEditor(true)}
        >
          <div className="w-full mx-auto relative">
            {isCompany ? <CompanyLogoSection /> : <ProfileSection />}
          </div>
        </div>
      )}

      {/* Indicateur de grille responsive */}
      <div className={`relative z-10 flex-shrink-0 px-4 pb-2 sticky ${
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
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-xs">
                {cards.length}/{getMaxCards()} carte{cards.length > 1 ? 's' : ''}
              </div>
              {userPlan !== 'pro' && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-yellow-400 font-medium">Plan {userPlan.toUpperCase()}</span>
                </div>
              )}
              {/* Bouton de configuration du profil */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfilePlacementSelector(true)}
                className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition-colors"
                title="Configurer le placement du profil"
              >
                <Building size={12} className="text-gray-400" />
                <span className="text-xs text-gray-400">Profil</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Device Layout Switcher - Only render on client and desktop */}
      {mounted && !isClientMobile && (
        <div className="relative z-10 flex-shrink-0 px-4 pb-4">
          <div className="w-full max-w-7xl mx-auto flex justify-center">
            <DeviceLayoutSwitcher />
          </div>
        </div>
      )}

      {/* Grille principale */}
      <div 
        className="relative z-10 flex-shrink-0 w-full px-4 pb-8 pt-4"
        style={getDeviceContainerStyle()}
      >
        {/* Utiliser le nouveau composant BentoGrid */}
        <BentoGrid 
          cards={cards}
          onCardClick={handleEditCard}
          className="max-w-7xl mx-auto"
        />
        
        {/* Message si grille vide */}
        {cards.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative z-10 flex-shrink-0 flex items-center justify-center p-8"
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
              <h3 className={`font-semibold mb-2 ${currentLayout === 'mobile' ? 'text-lg' : 'text-xl'}`}>
                Votre Grille est Vide
              </h3>
              <p className={`${currentLayout === 'mobile' ? 'text-sm' : 'text-base'}`}>
                {shouldDisableAddBlocks()
                  ? 'Utilisez le bouton + en bas à droite pour ajouter une carte'
                  : 'Survolez une cellule de la grille et cliquez sur le bouton + pour ajouter une carte'
                }
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Mobile Add Button - Seulement visible en mode mobile sur appareil mobile */}
      {shouldDisableAddBlocks() && <MobileAddButton />}

      {/* Profile Editor Modal */}
      <AnimatePresence>
        {showProfileEditor && (
          <ProfileEditor onClose={() => setShowProfileEditor(false)} />
        )}
      </AnimatePresence>

      {/* Profile Placement Selector Modal */}
      <AnimatePresence>
        {showProfilePlacementSelector && (
          <ProfilePlacementSelector onClose={() => setShowProfilePlacementSelector(false)} />
        )}
      </AnimatePresence>

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
    </div>
  );
};