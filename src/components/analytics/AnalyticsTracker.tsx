import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analyticsService';

interface AnalyticsTrackerProps {
  children: React.ReactNode;
}

export const AnalyticsTracker: React.FC<AnalyticsTrackerProps> = ({ children }) => {
  const { getCurrentDeviceCards } = useStore();
  
  const cards = getCurrentDeviceCards();
  const isInitialized = useRef(false);

  // Initialize analytics service only once on client side
  useEffect(() => {
    if (!isInitialized.current) {
      analyticsService.init();
      analyticsService.trackProfileView();
      isInitialized.current = true;
      console.log('👤 Vue profil trackée');
    }
  }, []);

  // Handle card click tracking
  useEffect(() => {
    const handleCardClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const cardElement = target.closest('[data-card-id]');
      
      if (cardElement) {
        const cardId = cardElement.getAttribute('data-card-id');
        const card = cards.find(c => c.id === cardId);
        
        if (card) {
          const rect = cardElement.getBoundingClientRect();
          const clickPosition = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          };
          
          analyticsService.trackCardClick(
            card.id,
            card.title,
            card.url,
            clickPosition
          );
          
          console.log('🎯 Clic tracké:', card.title);
        }
      }
    };

    document.addEventListener('click', handleCardClick);

    return () => {
      document.removeEventListener('click', handleCardClick);
    };
  }, [cards]);

  return <>{children}</>;
};