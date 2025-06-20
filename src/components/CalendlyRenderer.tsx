import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BentoCard } from '../types';
import { Calendar, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';

interface CalendlyRendererProps {
  card: BentoCard;
  isLarge: boolean;
  titleStyles: any;
  descriptionStyles: any;
  getTitleSizeClass: () => string;
  getDescriptionSizeClass: () => string;
}

export const CalendlyRenderer: React.FC<CalendlyRendererProps> = ({
  card,
  isLarge,
  titleStyles,
  descriptionStyles,
  getTitleSizeClass,
  getDescriptionSizeClass
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const calendlyData = card.calendlyData;
  const { profile, userPlan } = useStore();
  
  // Check if we should use company colors (Pro plan only)
  const useCompanyColors = userPlan === 'pro' && profile.type === 'company' && profile.companySecondaryColor;
  
  // Get the text color based on subscription and profile type
  const getTextColor = () => {
    if (useCompanyColors) {
      return profile.companySecondaryColor || card.textColor;
    }
    return card.textColor;
  };

  // Vérifier si Calendly est chargé
  useEffect(() => {
    if (!calendlyData) return;

    // Charger le script Calendly si nécessaire
    if (!window.Calendly && calendlyData.displayMode === 'popup') {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Script Calendly chargé');
      };
      script.onerror = () => {
        console.error('❌ Erreur lors du chargement du script Calendly');
        setIsError(true);
      };
      document.head.appendChild(script);
    }

    // Pour le mode inline, gérer le chargement de l'iframe
    if (calendlyData.displayMode === 'inline') {
      setIsLoading(true);
    }
  }, [calendlyData]);

  // Gérer le chargement de l'iframe
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Construire l'URL Calendly avec les paramètres
  const buildCalendlyUrl = () => {
    if (!calendlyData) return '';

    let url = calendlyData.url;
    const params = new URLSearchParams();

    // Ajouter les paramètres de préfill
    if (calendlyData.prefill) {
      if (calendlyData.prefill.name) params.append('name', calendlyData.prefill.name);
      if (calendlyData.prefill.email) params.append('email', calendlyData.prefill.email);
      
      // Ajouter les réponses personnalisées
      if (calendlyData.prefill.customAnswers) {
        Object.entries(calendlyData.prefill.customAnswers).forEach(([key, value]) => {
          params.append(`a1=${key}`, value);
        });
      }
    }

    // Ajouter les paramètres UTM
    if (calendlyData.utm) {
      if (calendlyData.utm.utmCampaign) params.append('utm_campaign', calendlyData.utm.utmCampaign);
      if (calendlyData.utm.utmSource) params.append('utm_source', calendlyData.utm.utmSource);
      if (calendlyData.utm.utmMedium) params.append('utm_medium', calendlyData.utm.utmMedium);
      if (calendlyData.utm.utmContent) params.append('utm_content', calendlyData.utm.utmContent);
      if (calendlyData.utm.utmTerm) params.append('utm_term', calendlyData.utm.utmTerm);
    }

    // Ajouter les paramètres d'affichage
    if (calendlyData.hideEventTypeDetails) params.append('hide_event_type_details', '1');
    if (calendlyData.hideLandingPageDetails) params.append('hide_landing_page_details', '1');
    
    // Ajouter la couleur primaire
    if (calendlyData.primaryColor) {
      const color = calendlyData.primaryColor.replace('#', '');
      params.append('primary_color', color);
    }

    // Ajouter les paramètres à l'URL
    const paramsString = params.toString();
    if (paramsString) {
      url += `?${paramsString}`;
    }

    return url;
  };

  // Ouvrir Calendly en popup
  const openCalendlyPopup = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!calendlyData) return;

    if (window.Calendly) {
      window.Calendly.initPopupWidget({
        url: buildCalendlyUrl(),
        prefill: calendlyData.prefill,
        utm: calendlyData.utm,
        color: calendlyData.primaryColor?.replace('#', ''),
        textColor: calendlyData.textColor?.replace('#', ''),
        backgroundColor: calendlyData.backgroundColor?.replace('#', '')
      });
    } else {
      // Fallback si le script n'est pas chargé
      window.open(buildCalendlyUrl(), '_blank');
    }
  };

  // Rediriger vers Calendly
  const redirectToCalendly = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(buildCalendlyUrl(), '_blank');
  };

  // Gérer le clic sur le bouton
  const handleCalendlyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!calendlyData) return;

    switch (calendlyData.displayMode) {
      case 'popup':
        openCalendlyPopup(e);
        break;
      case 'redirect':
        redirectToCalendly(e);
        break;
      case 'inline':
        // Ne rien faire, l'iframe est déjà affiché
        break;
    }
  };

  if (!calendlyData) return null;

  return (
    <div className="relative z-10 h-full flex flex-col p-6 lg:p-8">
      {/* Header */}
      <div className="flex-1 flex flex-col">
        {/* Title */}
        <motion.h3 
          className={`
            leading-tight mb-2
            ${getTitleSizeClass()}
          `}
          style={{ 
            color: getTextColor(),
            ...titleStyles
          }}
        >
          {card.title}
        </motion.h3>
        
        {/* Description */}
        {card.description && (
          <motion.p 
            className={`
              opacity-90 leading-relaxed mb-4
              ${getDescriptionSizeClass()}
              ${isLarge ? 'max-w-md' : ''}
            `}
            style={{ 
              color: getTextColor(),
              ...descriptionStyles
            }}
          >
            {card.description}
          </motion.p>
        )}

        {/* Calendly Inline Embed */}
        {calendlyData.displayMode === 'inline' && isLarge && (
          <div 
            className="relative flex-1 min-h-[200px] mb-4 bg-white/10 rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Empêcher la propagation du clic
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
                />
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={`${buildCalendlyUrl()}&embed_domain=${window.location.host}&embed_type=Inline`}
              width="100%"
              height={calendlyData.embedHeight || 630}
              frameBorder="0"
              title="Calendly Scheduling"
              className="rounded-lg"
              onLoad={handleIframeLoad}
              style={{ opacity: isLoading ? 0 : 1 }}
              onClick={(e) => e.stopPropagation()} // Empêcher la propagation du clic
            />
          </div>
        )}

        {/* Calendly Info */}
        {calendlyData.displayMode !== 'inline' && (
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-white/20 backdrop-blur-sm">
              <Calendar size={isLarge ? 24 : 18} className="text-white" />
            </div>
            <div>
              <div className="text-white font-medium">
                {calendlyData.url.split('/').pop()?.replace(/-/g, ' ')}
              </div>
              <div className="flex items-center gap-2 text-white/70 text-sm">
                <Clock size={14} />
                <span>Disponibilités en temps réel</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      {calendlyData.displayMode !== 'inline' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCalendlyClick}
          className={`
            inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm 
            border border-white/30 rounded-full font-medium self-start 
            hover:bg-white/30 transition-all duration-300
            ${isLarge ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'}
          `}
          style={{ 
            color: getTextColor(),
            fontFamily: titleStyles.fontFamily,
            fontWeight: descriptionStyles.fontWeight,
            backgroundColor: calendlyData.primaryColor ? `${calendlyData.primaryColor}40` : undefined,
            borderColor: calendlyData.primaryColor ? `${calendlyData.primaryColor}80` : undefined
          }}
        >
          {calendlyData.displayMode === 'popup' ? 'Prendre rendez-vous' : 'Voir les disponibilités'}
          {calendlyData.displayMode === 'redirect' ? <ExternalLink size={isLarge ? 16 : 14} /> : <ArrowRight size={isLarge ? 16 : 14} />}
        </motion.button>
      )}

      {/* Calendly Branding */}
      <div className="absolute bottom-3 right-3 text-xs text-white/40 font-medium">
        Powered by Calendly
      </div>
    </div>
  );
};

// Déclaration pour TypeScript
declare global {
  interface Window {
    Calendly?: any;
  }
}