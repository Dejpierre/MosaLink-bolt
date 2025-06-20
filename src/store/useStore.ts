import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { BentoCard, ProfileData, GlobalBackgroundSettings, ProfilePlacement, UserPlan } from '../types';

interface AppState {
  // Cards - Layouts séparés pour chaque appareil
  desktopCards: BentoCard[];
  tabletCards: BentoCard[];
  mobileCards: BentoCard[];
  selectedCardId: string | null;
  isEditing: boolean;
  
  // Profile
  profile: ProfileData;
  profilePlacement: ProfilePlacement;
  
  // Global settings
  globalBackground: GlobalBackgroundSettings;
  userPlan: UserPlan;
  isDarkMode: boolean;
  
  // Layout settings
  currentLayout: 'desktop' | 'tablet' | 'mobile';
  
  // History
  history: any[];
  historyIndex: number;
  
  // Actions
  addCard: (card: Omit<BentoCard, 'id' | 'order'>) => Promise<{ success: boolean; error?: string; cardId?: string }>;
  updateCard: (id: string, updates: Partial<BentoCard>) => void;
  deleteCard: (id: string) => void;
  reorderCards: (cards: BentoCard[]) => void;
  selectCard: (id: string | null) => void;
  
  // Profile actions
  updateProfile: (profile: Partial<ProfileData>) => void;
  updateProfilePlacement: (placement: ProfilePlacement) => void;
  createProfileCard: () => Promise<{ success: boolean; error?: string; cardId?: string }>;
  removeProfileCard: () => void;
  getProfileCard: () => BentoCard | null;
  
  // Global settings actions
  updateGlobalBackground: (background: GlobalBackgroundSettings) => void;
  resetGlobalBackground: () => void;
  setUserPlan: (plan: UserPlan) => void;
  toggleDarkMode: () => void;
  
  // Layout actions
  setCurrentLayout: (layout: 'desktop' | 'tablet' | 'mobile') => void;
  getCurrentDeviceCards: () => BentoCard[];
  
  // History actions
  undo: () => void;
  redo: () => void;
  
  // Import/Export
  exportData: () => string;
  importData: (data: string) => void;
}

// Default values
const defaultProfile: ProfileData = {
  type: 'personal',
  firstName: 'John',
  lastName: 'Doe',
  bio: 'Welcome to my Mosalink! Discover my world through these carefully curated links and experiences.',
  profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  location: 'New York, NY',
  website: 'https://johndoe.com',
  companyName: '',
  companyLogo: '',
  companyPrimaryColor: '#6366f1',
  companySecondaryColor: '#8b5cf6'
};

const defaultProfilePlacement: ProfilePlacement = {
  mode: 'header',
  headerStyle: 'compact'
};

const defaultGlobalBackground: GlobalBackgroundSettings = {
  type: 'gradient',
  gradient: {
    type: 'linear',
    direction: '135deg',
    colors: ['#0f172a', '#1e293b', '#334155']
  },
  overlay: {
    enabled: false,
    color: '#000000',
    opacity: 0.3
  }
};

// Helper function to find a free position for a card
const findFreePosition = (cards: BentoCard[], cardCols: number, cardRows: number, maxCols: number, maxRows: number): { col: number; row: number } => {
  for (let row = 0; row <= maxRows - cardRows; row++) {
    for (let col = 0; col <= maxCols - cardCols; col++) {
      let hasCollision = false;
      
      for (const existingCard of cards) {
        if (!existingCard.gridPosition) continue;
        
        const existingCols = parseInt(existingCard.size.split('x')[0]);
        const existingRows = parseInt(existingCard.size.split('x')[1]);
        const existingCol = existingCard.gridPosition.col;
        const existingRow = existingCard.gridPosition.row;
        
        const overlap = !(
          col >= existingCol + existingCols ||
          col + cardCols <= existingCol ||
          row >= existingRow + existingRows ||
          row + cardRows <= existingRow
        );
        
        if (overlap) {
          hasCollision = true;
          break;
        }
      }
      
      if (!hasCollision) {
        return { col, row };
      }
    }
  }
  
  return { col: 0, row: 0 };
};

export const useStore = create<AppState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state - Layouts séparés
    desktopCards: [],
    tabletCards: [],
    mobileCards: [],
    selectedCardId: null,
    isEditing: false,
    profile: defaultProfile,
    profilePlacement: defaultProfilePlacement,
    globalBackground: defaultGlobalBackground,
    userPlan: 'free',
    isDarkMode: true,
    
    // Layout settings
    currentLayout: 'desktop',
    history: [],
    historyIndex: -1,

    // Card actions - Modifiées pour gérer les layouts séparés
    addCard: async (cardData) => {
      const state = get();
      const currentCards = state.getCurrentDeviceCards();
      
      // Check plan limits
      if (state.userPlan === 'free' && currentCards.length >= 3) {
        return { 
          success: false, 
          error: 'Plan gratuit limité à 3 cartes. Passez au plan Starter pour plus de cartes.' 
        };
      }
      
      if (state.userPlan === 'starter' && currentCards.length >= 25) {
        return { 
          success: false, 
          error: 'Plan Starter limité à 25 cartes. Passez au plan Pro pour des cartes illimitées.' 
        };
      }

      // Grid configuration based on current layout
      let maxCols = 12, maxRows = 4;
      if (state.currentLayout === 'tablet') {
        maxCols = 4;
        maxRows = 4;
      } else if (state.currentLayout === 'mobile') {
        maxCols = 2;
        maxRows = 6;
      }

      // Ensure the card has a grid position
      let gridPosition = cardData.gridPosition;
      if (!gridPosition) {
        const cardCols = parseInt(cardData.size.split('x')[0]);
        const cardRows = parseInt(cardData.size.split('x')[1]);
        gridPosition = findFreePosition(currentCards, cardCols, cardRows, maxCols, maxRows);
      }

      const newCard: BentoCard = {
        ...cardData,
        id: nanoid(),
        order: currentCards.length,
        gridPosition,
        typography: cardData.typography || {
          fontFamily: 'inter',
          titleWeight: '700',
          descriptionWeight: '400',
          textAlign: 'left',
          titleSize: 'lg',
          descriptionSize: 'sm'
        }
      };

      // Add to the appropriate layout
      set((state) => {
        const updatedState = { ...state };
        if (state.currentLayout === 'desktop') {
          updatedState.desktopCards = [...state.desktopCards, newCard];
        } else if (state.currentLayout === 'tablet') {
          updatedState.tabletCards = [...state.tabletCards, newCard];
        } else {
          updatedState.mobileCards = [...state.mobileCards, newCard];
        }
        updatedState.selectedCardId = newCard.id;
        updatedState.isEditing = true;
        return updatedState;
      });

      return { success: true, cardId: newCard.id };
    },

    updateCard: (id, updates) => {
      set((state) => {
        const updatedState = { ...state };
        
        // Update in the current layout
        if (state.currentLayout === 'desktop') {
          updatedState.desktopCards = state.desktopCards.map(card => 
            card.id === id ? { ...card, ...updates } : card
          );
        } else if (state.currentLayout === 'tablet') {
          updatedState.tabletCards = state.tabletCards.map(card => 
            card.id === id ? { ...card, ...updates } : card
          );
        } else {
          updatedState.mobileCards = state.mobileCards.map(card => 
            card.id === id ? { ...card, ...updates } : card
          );
        }
        
        return updatedState;
      });
    },

    deleteCard: (id) => {
      set((state) => {
        const updatedState = { ...state };
        
        // Remove from the current layout
        if (state.currentLayout === 'desktop') {
          updatedState.desktopCards = state.desktopCards.filter(card => card.id !== id);
        } else if (state.currentLayout === 'tablet') {
          updatedState.tabletCards = state.tabletCards.filter(card => card.id !== id);
        } else {
          updatedState.mobileCards = state.mobileCards.filter(card => card.id !== id);
        }
        
        updatedState.selectedCardId = state.selectedCardId === id ? null : state.selectedCardId;
        updatedState.isEditing = state.selectedCardId === id ? false : state.isEditing;
        
        return updatedState;
      });
    },

    reorderCards: (newCards) => {
      set((state) => {
        const updatedState = { ...state };
        const reorderedCards = newCards.map((card, index) => ({ ...card, order: index }));
        
        // Update the current layout
        if (state.currentLayout === 'desktop') {
          updatedState.desktopCards = reorderedCards;
        } else if (state.currentLayout === 'tablet') {
          updatedState.tabletCards = reorderedCards;
        } else {
          updatedState.mobileCards = reorderedCards;
        }
        
        return updatedState;
      });
    },

    selectCard: (id) => {
      set({ 
        selectedCardId: id, 
        isEditing: id !== null 
      });
    },

    // Profile actions
    updateProfile: (profileUpdates) => {
      set((state) => ({
        profile: { ...state.profile, ...profileUpdates }
      }));
    },

    updateProfilePlacement: (placement) => {
      set({ profilePlacement: placement });
    },

    createProfileCard: async () => {
      const state = get();
      const currentCards = state.getCurrentDeviceCards();
      
      // Check if profile card already exists
      const existingProfileCard = currentCards.find(card => card.isProfileCard);
      if (existingProfileCard) {
        return { success: true, cardId: existingProfileCard.id };
      }

      // Check plan limits
      if (state.userPlan === 'free') {
        return { 
          success: false, 
          error: 'Les cartes profil nécessitent un plan payant.' 
        };
      }

      if (state.userPlan === 'starter' && currentCards.length >= 25) {
        return { 
          success: false, 
          error: 'Plan Starter limité à 25 cartes. Passez au plan Pro pour des cartes illimitées.' 
        };
      }

      // Grid configuration
      let maxCols = 12, maxRows = 4;
      if (state.currentLayout === 'tablet') {
        maxCols = 4;
        maxRows = 4;
      } else if (state.currentLayout === 'mobile') {
        maxCols = 2;
        maxRows = 6;
      }

      const gridPosition = findFreePosition(currentCards, 2, 2, maxCols, maxRows);

      const profileCard: BentoCard = {
        id: nanoid(),
        title: state.profile.type === 'personal' 
          ? `${state.profile.firstName} ${state.profile.lastName}`
          : state.profile.companyName || 'Company Name',
        description: state.profile.bio,
        url: state.profile.website || '',
        backgroundColor: state.profile.type === 'company' && state.profile.companyPrimaryColor 
          ? state.profile.companyPrimaryColor 
          : '#1f2937',
        textColor: '#ffffff',
        size: '2x2',
        order: currentCards.length,
        gridPosition,
        isProfileCard: true,
        typography: {
          fontFamily: 'inter',
          titleWeight: '700',
          descriptionWeight: '400',
          textAlign: 'left',
          titleSize: 'lg',
          descriptionSize: 'sm'
        }
      };

      // Add to current layout
      set((state) => {
        const updatedState = { ...state };
        if (state.currentLayout === 'desktop') {
          updatedState.desktopCards = [...state.desktopCards, profileCard];
        } else if (state.currentLayout === 'tablet') {
          updatedState.tabletCards = [...state.tabletCards, profileCard];
        } else {
          updatedState.mobileCards = [...state.mobileCards, profileCard];
        }
        return updatedState;
      });

      return { success: true, cardId: profileCard.id };
    },

    removeProfileCard: () => {
      set((state) => {
        const updatedState = { ...state };
        
        // Remove from all layouts
        updatedState.desktopCards = state.desktopCards.filter(card => !card.isProfileCard);
        updatedState.tabletCards = state.tabletCards.filter(card => !card.isProfileCard);
        updatedState.mobileCards = state.mobileCards.filter(card => !card.isProfileCard);
        
        return updatedState;
      });
    },

    getProfileCard: () => {
      const state = get();
      const currentCards = state.getCurrentDeviceCards();
      return currentCards.find(card => card.isProfileCard) || null;
    },

    // Global settings actions
    updateGlobalBackground: (background) => {
      set({ globalBackground: background });
    },

    resetGlobalBackground: () => {
      set({ globalBackground: defaultGlobalBackground });
    },

    setUserPlan: (plan) => {
      set({ userPlan: plan });
    },

    toggleDarkMode: () => {
      set((state) => ({ isDarkMode: !state.isDarkMode }));
    },
    
    // Layout actions - Fonction clé pour récupérer les cartes du layout actuel
    setCurrentLayout: (layout) => {
      set({ currentLayout: layout });
    },

    getCurrentDeviceCards: () => {
      const state = get();
      switch (state.currentLayout) {
        case 'desktop':
          return state.desktopCards;
        case 'tablet':
          return state.tabletCards;
        case 'mobile':
          return state.mobileCards;
        default:
          return state.desktopCards;
      }
    },

    // History actions
    undo: () => {
      console.log('Undo action');
    },

    redo: () => {
      console.log('Redo action');
    },

    // Import/Export - Modifié pour gérer les layouts séparés
    exportData: () => {
      const state = get();
      return JSON.stringify({
        desktopCards: state.desktopCards,
        tabletCards: state.tabletCards,
        mobileCards: state.mobileCards,
        profile: state.profile,
        profilePlacement: state.profilePlacement,
        globalBackground: state.globalBackground,
        version: '2.0'
      });
    },

    importData: (data) => {
      try {
        const parsed = JSON.parse(data);
        
        // Support for both old and new format
        let desktopCards = [];
        let tabletCards = [];
        let mobileCards = [];
        
        if (parsed.version === '2.0') {
          // New format with separate layouts
          desktopCards = parsed.desktopCards || [];
          tabletCards = parsed.tabletCards || [];
          mobileCards = parsed.mobileCards || [];
        } else {
          // Old format - migrate to desktop layout
          desktopCards = parsed.cards || [];
        }
        
        // Ensure all cards have grid positions
        const ensureGridPositions = (cards: BentoCard[], maxCols: number, maxRows: number) => {
          return cards.map((card, index) => {
            if (!card.gridPosition) {
              const cardCols = parseInt(card.size.split('x')[0]);
              const cardRows = parseInt(card.size.split('x')[1]);
              const gridPosition = findFreePosition(cards.slice(0, index), cardCols, cardRows, maxCols, maxRows);
              return { ...card, gridPosition };
            }
            return card;
          });
        };
        
        set({
          desktopCards: ensureGridPositions(desktopCards, 12, 4),
          tabletCards: ensureGridPositions(tabletCards, 4, 4),
          mobileCards: ensureGridPositions(mobileCards, 2, 6),
          profile: parsed.profile || defaultProfile,
          profilePlacement: parsed.profilePlacement || defaultProfilePlacement,
          globalBackground: parsed.globalBackground || defaultGlobalBackground
        });
      } catch (error) {
        console.error('Failed to import data:', error);
        throw new Error('Invalid data format');
      }
    }
  }))
);