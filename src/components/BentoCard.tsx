import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useStore } from '../store/useStore';
import { BentoCard, FontFamily } from '../types';
import { ContextMenu } from './ContextMenu';
import { InternalLayoutRenderer } from './InternalLayoutRenderer';
import { ProfileCardRenderer } from './ProfileCardRenderer';
import { CalendlyRenderer } from './CalendlyRenderer';
import { appleMusicService } from '../services/appleMusicService';
import { ContactFormWidget } from './ContactFormWidget';
import { EmailSubscribeWidget } from './EmailSubscribeWidget';
import * as Icons from 'lucide-react';

interface BentoCardProps {
  card: BentoCard;
  isBeingDragged?: boolean;
  isDragOverlay?: boolean;
  isPreviewMode?: boolean;
}

// Helper function to convert icon names to PascalCase
const toPascalCase = (str: string): string => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

// Font family mappings
const fontFamilyMap: Record<FontFamily, string> = {
  'inter': 'Inter, system-ui, sans-serif',
  'poppins': 'Poppins, system-ui, sans-serif',
  'roboto': 'Roboto, system-ui, sans-serif',
  'playfair': 'Playfair Display, serif',
  'montserrat': 'Montserrat, system-ui, sans-serif',
  'lora': 'Lora, serif',
  'oswald': 'Oswald, system-ui, sans-serif',
  'dancing-script': 'Dancing Script, cursive'
};

// Size mappings
const titleSizeMap = {
  'xs': 'text-xs',
  'sm': 'text-sm',
  'base': 'text-base',
  'lg': 'text-lg',
  'xl': 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl'
};

const descriptionSizeMap = {
  'xs': 'text-xs',
  'sm': 'text-sm',
  'base': 'text-base',
  'lg': 'text-lg'
};

export const BentoCardComponent: React.FC<BentoCardProps> = ({ 
  card, 
  isBeingDragged = false,
  isDragOverlay = false,
  isPreviewMode = false
}) => {
  const { selectCard, selectedCardId, deleteCard, addCard, updateCard, profile, userPlan } = useStore();
  const isSelected = selectedCardId === card.id;
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
  }>({ isOpen: false, position: { x: 0, y: 0 } });
  
  // États pour l'édition inline
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempTitle, setTempTitle] = useState(card.title);
  const [tempDescription, setTempDescription] = useState(card.description);
  
  // État pour Apple Music
  const [isPlayingAppleMusic, setIsPlayingAppleMusic] = useState(false);
  const [appleMusicError, setAppleMusicError] = useState<string | null>(null);
  
  // Refs pour les inputs et la vidéo
  const titleInputRef = React.useRef<HTMLInputElement>(null);
  const descriptionInputRef = React.useRef<HTMLTextAreaElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Typographie par défaut
  const defaultTypography = {
    fontFamily: 'inter' as const,
    titleWeight: '700' as const,
    descriptionWeight: '400' as const,
    textAlign: 'left' as const,
    verticalAlign: 'bottom' as const,
    titleSize: 'lg' as const,
    descriptionSize: 'sm' as const
  };

  const typography = { ...defaultTypography, ...card.typography };

  // Paramètres vidéo par défaut
  const defaultVideoSettings = {
    autoplay: true,
    muted: true,
    loop: true,
    controls: false,
    overlay: true
  };

  const videoSettings = { ...defaultVideoSettings, ...card.videoSettings };

  // Layout interne par défaut
  const defaultInternalLayout = {
    enabled: false,
    elements: [],
    showGrid: false
  };

  const internalLayout = { ...defaultInternalLayout, ...card.internalLayout };

  // Check if we should use company colors (Pro plan only)
  const useCompanyColors = userPlan === 'pro' && profile.type === 'company' && profile.companyPrimaryColor;
  
  // Get the background color based on subscription and profile type
  const getBackgroundColor = () => {
    if (useCompanyColors && !card.backgroundImage && !card.backgroundVideo && !card.appleMusicData?.artwork) {
      return profile.companyPrimaryColor || card.backgroundColor;
    }
    return card.backgroundColor;
  };
  
  // Get the text color based on subscription and profile type
  const getTextColor = () => {
    if (useCompanyColors && profile.companySecondaryColor) {
      return profile.companySecondaryColor;
    }
    return card.textColor;
  };

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    disabled: isDragOverlay || isBeingDragged || isEditingTitle || isEditingDescription || isPreviewMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragOverlay ? 'none' : transition,
    touchAction: 'none', // Prevent scrolling while dragging on touch devices
    height: '100%',
    width: '100%'
  };

  const getIconComponent = () => {
    if (!card.icon) return null;
    
    const pascalCaseIcon = toPascalCase(card.icon);
    const IconComponent = Icons[pascalCaseIcon as keyof typeof Icons];
    
    return IconComponent || null;
  };

  const IconComponent = getIconComponent() as React.ComponentType<{ size?: number; className?: string }> | null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isDragging && !isBeingDragged && !isDragOverlay && !isEditingTitle && !isEditingDescription && !isPreviewMode) {
      selectCard(card.id);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isDragOverlay || isBeingDragged || isPreviewMode) return;

    setContextMenu({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY }
    });
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (card.url && !isDragging && !isBeingDragged && !isDragOverlay) {
      window.open(card.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Fonctions d'édition du titre
  const handleTitleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragOverlay && !isBeingDragged && !card.isProfileCard && !isPreviewMode) { // Pas d'édition pour les cartes profil
      setIsEditingTitle(true);
      setTempTitle(card.title);
    }
  };

  const handleTitleSubmit = () => {
    if (tempTitle.trim() !== card.title) {
      updateCard(card.id, { title: tempTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(card.title);
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleTitleCancel();
    }
  };

  // Fonctions d'édition de la description
  const handleDescriptionDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDragOverlay && !isBeingDragged && !card.isProfileCard && !isPreviewMode) { // Pas d'édition pour les cartes profil
      setIsEditingDescription(true);
      setTempDescription(card.description);
    }
  };

  const handleDescriptionSubmit = () => {
    if (tempDescription.trim() !== card.description) {
      updateCard(card.id, { description: tempDescription.trim() });
    }
    setIsEditingDescription(false);
  };

  const handleDescriptionCancel = () => {
    setTempDescription(card.description);
    setIsEditingDescription(false);
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleDescriptionSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleDescriptionCancel();
    }
  };

  // Focus automatique sur les inputs
  React.useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  React.useEffect(() => {
    if (isEditingDescription && descriptionInputRef.current) {
      descriptionInputRef.current.focus();
      descriptionInputRef.current.select();
    }
  }, [isEditingDescription]);

  // Gestion de la lecture audio pour Apple Music
  const handlePlayAppleMusic = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setAppleMusicError(null);
    
    if (!card.appleMusicData?.previewUrl) {
      setAppleMusicError('Aucun aperçu audio disponible');
      return;
    }

    // Si déjà en cours de lecture, arrêter
    if (isPlayingAppleMusic) {
      appleMusicService.stopCurrentAudio();
      setIsPlayingAppleMusic(false);
      return;
    }

    try {
      setIsPlayingAppleMusic(true);
      
      const audio = await appleMusicService.playPreview(card.appleMusicData.previewUrl);
      
      if (audio) {
        // Écouter les événements audio
        audio.addEventListener('ended', () => {
          setIsPlayingAppleMusic(false);
        });

        audio.addEventListener('pause', () => {
          setIsPlayingAppleMusic(false);
        });

        audio.addEventListener('error', () => {
          setIsPlayingAppleMusic(false);
          setAppleMusicError('Erreur lors de la lecture');
        });
      }
    } catch (error) {
      setIsPlayingAppleMusic(false);
      setAppleMusicError('Impossible de lire cet aperçu');
    }
  };

  // Actions du menu contextuel
  const handleEdit = () => {
    selectCard(card.id);
  };

  const handleDelete = () => {
    const cardType = card.isProfileCard ? 'carte profil' : 'carte';
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cette ${cardType} "${card.title}" ?`)) {
      deleteCard(card.id);
    }
  };

  const handleDuplicate = () => {
    const duplicatedCard = {
      ...card,
      title: `${card.title} (Copie)`,
      id: undefined, // Will be generated by addCard
      order: undefined, // Will be generated by addCard
      isProfileCard: false // Les copies ne sont jamais des cartes profil
    };
    delete (duplicatedCard as any).id;
    delete (duplicatedCard as any).order;
    addCard(duplicatedCard);
  };

  const handleCopyLink = () => {
    if (card.url) {
      navigator.clipboard.writeText(card.url);
      // Vous pourriez ajouter une notification toast ici
    }
  };

  const handleChangeColor = () => {
    // Générer une couleur aléatoire
    const colors = [
      '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
      '#eab308', '#22c55e', '#10b981', '#06b6d4', '#3b82f6',
      '#1e40af', '#7c3aed', '#be185d', '#dc2626', '#ea580c'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    updateCard(card.id, { backgroundColor: randomColor });
  };

  // Determine card style based on size
  const isLarge = card.size.includes('2') || card.size.includes('3') || card.size.includes('4');
  const isWide = card.size.startsWith('2') || card.size.startsWith('3') || card.size.startsWith('4');
  const isTall = card.size.endsWith('2') || card.size.endsWith('3') || card.size.endsWith('4');

  // Styles typographiques
  const titleStyles = {
    fontFamily: fontFamilyMap[typography.fontFamily],
    fontWeight: typography.titleWeight,
    textAlign: typography.textAlign
  };

  const descriptionStyles = {
    fontFamily: fontFamilyMap[typography.fontFamily],
    fontWeight: typography.descriptionWeight,
    textAlign: typography.textAlign
  };

  // Classes CSS pour les tailles
  const getTitleSizeClass = () => {
    if (isLarge) {
      return typography.titleSize === '3xl' ? 'text-4xl lg:text-5xl xl:text-6xl' :
             typography.titleSize === '2xl' ? 'text-3xl lg:text-4xl xl:text-5xl' :
             typography.titleSize === 'xl' ? 'text-2xl lg:text-3xl xl:text-4xl' :
             'text-xl lg:text-2xl xl:text-3xl';
    }
    return titleSizeMap[typography.titleSize || 'lg'];
  };

  const getDescriptionSizeClass = () => {
    if (isLarge) {
      return typography.descriptionSize === 'lg' ? 'text-lg lg:text-xl' :
             typography.descriptionSize === 'base' ? 'text-base lg:text-lg' :
             'text-sm lg:text-base';
    }
    return descriptionSizeMap[typography.descriptionSize || 'sm'];
  };

  // Déterminer l'alignement du contenu en fonction de typography.textAlign
  const getContentAlignment = () => {
    switch (typography.textAlign) {
      case 'center':
        return 'text-align-center';
      case 'right':
        return 'text-align-right';
      default:
        return 'text-align-left';
    }
  };

  // Déterminer l'alignement vertical du contenu
  const getVerticalAlignment = () => {
    switch (typography.verticalAlign) {
      case 'top':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      default:
        return 'justify-end';
    }
  };

  // Vérifier si le contenu est vide
  const hasContent = card.title || card.description;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...(isPreviewMode ? {} : attributes)}
        {...(isPreviewMode ? {} : listeners)}
        className={`cursor-${isPreviewMode ? 'default' : 'pointer'} select-none h-full w-full`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1,
            scale: 1,
          }}
          whileHover={!isDragOverlay && !isBeingDragged && !isEditingTitle && !isEditingDescription ? { 
            scale: 1.02,
            y: -4
          } : {}}
          transition={{ 
            type: 'spring', 
            stiffness: 200,
            damping: 25,
            mass: 1.0
          }}
          className="h-full w-full"
        >
          <div
            className={`
              relative h-full w-full min-h-[120px] rounded-lg overflow-hidden
              transition-all duration-700 ease-out group
              ${isSelected && !isPreviewMode
                ? 'ring-2 ring-white/60 ring-offset-4 ring-offset-transparent shadow-2xl' 
                : 'hover:shadow-2xl'
              }
              ${isDragOverlay ? 'shadow-2xl ring-2 ring-white/40' : ''}
              ${isBeingDragged ? 'shadow-xl' : ''}
              ${(isEditingTitle || isEditingDescription) ? 'ring-2 ring-blue-400/60 shadow-2xl' : ''}
              ${card.isProfileCard ? 'ring-2 ring-orange-400/60 shadow-xl' : ''}
            `}
            style={{ 
              backgroundColor: getBackgroundColor(),
              backgroundImage: card.backgroundImage ? `url(${card.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Apple Music Background */}
            {card.appleMusicData?.artwork && !card.backgroundImage && !card.backgroundVideo && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${card.appleMusicData.artwork})` }}
              />
            )}

            {/* Vidéo de fond */}
            {card.backgroundVideo && (
              <video
                ref={videoRef}
                src={card.backgroundVideo}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay={videoSettings.autoplay}
                muted={videoSettings.muted}
                loop={videoSettings.loop}
                controls={videoSettings.controls}
                playsInline
                onLoadedData={() => {
                  if (videoRef.current && videoSettings.autoplay) {
                    videoRef.current.play().catch(() => {
                      // Fallback si autoplay échoue
                    });
                  }
                }}
              />
            )}

            {/* Overlay pour la lisibilité du texte - Seulement si du contenu est présent */}
            {(card.backgroundImage || card.backgroundVideo || card.appleMusicData?.artwork) && hasContent && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
            )}

            {/* Rendu spécial pour les cartes profil */}
            {card.isProfileCard ? (
              <ProfileCardRenderer 
                card={card} 
                profile={profile}
                isLarge={isLarge}
                titleStyles={titleStyles}
                descriptionStyles={descriptionStyles}
                getTitleSizeClass={getTitleSizeClass}
                getDescriptionSizeClass={getDescriptionSizeClass}
              />
            ) : card.calendlyData ? (
              <CalendlyRenderer
                card={card}
                isLarge={isLarge}
                titleStyles={titleStyles}
                descriptionStyles={descriptionStyles}
                getTitleSizeClass={getTitleSizeClass}
                getDescriptionSizeClass={getDescriptionSizeClass}
              />
            ) : card.contactFormData ? (
              <div className="relative z-10 h-full flex flex-col p-6 lg:p-8">
                <h3 
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
                </h3>
                
                {card.description && (
                  <p 
                    className={`
                      opacity-90 leading-relaxed mb-4
                      ${getDescriptionSizeClass()}
                    `}
                    style={{ 
                      color: getTextColor(),
                      ...descriptionStyles
                    }}
                  >
                    {card.description}
                  </p>
                )}
                
                {card.contactFormData.type === 'contact' ? (
                  <ContactFormWidget 
                    type="contact"
                    buttonText={card.contactFormData.buttonText}
                    placeholderText={card.contactFormData.placeholderText}
                    successMessage={card.contactFormData.successMessage}
                    accentColor={useCompanyColors ? (profile.companyPrimaryColor || '#6366f1') : card.backgroundColor}
                  />
                ) : (
                  <EmailSubscribeWidget 
                    buttonText={card.contactFormData.buttonText}
                    placeholder={card.contactFormData.placeholderText}
                    successMessage={card.contactFormData.successMessage}
                    accentColor={useCompanyColors ? (profile.companyPrimaryColor || '#6366f1') : card.backgroundColor}
                  />
                )}
              </div>
            ) : (
              <>
                {/* Layout interne - Rendu par-dessus le contenu principal */}
                {internalLayout.enabled && (
                  <InternalLayoutRenderer layout={internalLayout} />
                )}

                {/* Content - Masqué si layout interne activé */}
                {!internalLayout.enabled && (
                  <div className={`relative z-10 h-full flex flex-col p-6 lg:p-8 ${getContentAlignment()}`}>
                    {/* Main content area */}
                    <div className={`flex-1 flex flex-col ${getVerticalAlignment()} ${getContentAlignment()}`}>
                      {/* Title - Éditable avec typographie personnalisée */}
                      {isEditingTitle ? (
                        <motion.input
                          ref={titleInputRef}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          value={tempTitle}
                          onChange={(e) => setTempTitle(e.target.value)}
                          onBlur={handleTitleSubmit}
                          onKeyDown={handleTitleKeyDown}
                          className={`
                            leading-tight mb-2 bg-transparent border-2 border-white/50 rounded-lg px-2 py-1
                            focus:outline-none focus:border-blue-400 resize-none
                            ${getTitleSizeClass()}
                          `}
                          style={{ 
                            color: getTextColor(),
                            ...titleStyles
                          }}
                          placeholder="Titre de la carte..."
                        />
                      ) : (
                        <motion.h3 
                          className={`
                            leading-tight mb-2 cursor-text hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors
                            ${getTitleSizeClass()}
                          `}
                          style={{ 
                            color: getTextColor(),
                            ...titleStyles
                          }}
                          onDoubleClick={handleTitleDoubleClick}
                          title={card.isProfileCard ? "Carte profil - Non éditable" : "Double-cliquez pour éditer (ou F2)"}
                        >
                          {card.title}
                        </motion.h3>
                      )}
                      
                      {/* Description - Éditable avec typographie personnalisée */}
                      {card.description && (
                        <>
                          {isEditingDescription ? (
                            <motion.textarea
                              ref={descriptionInputRef}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              value={tempDescription}
                              onChange={(e) => setTempDescription(e.target.value)}
                              onBlur={handleDescriptionSubmit}
                              onKeyDown={handleDescriptionKeyDown}
                              className={`
                                opacity-90 leading-relaxed mb-4 bg-transparent border-2 border-white/50 rounded-lg px-2 py-1
                                focus:outline-none focus:border-blue-400 resize-none
                                ${getDescriptionSizeClass()}
                                ${isLarge ? 'max-w-md' : ''}
                              `}
                              style={{ 
                                color: getTextColor(),
                                ...descriptionStyles
                              }}
                              placeholder="Description de la carte..."
                              rows={isLarge ? 3 : 2}
                            />
                          ) : (
                            <motion.p 
                              className={`
                                opacity-90 leading-relaxed mb-4 cursor-text hover:bg-white/10 rounded-lg px-2 py-1 -mx-2 -my-1 transition-colors
                                ${getDescriptionSizeClass()}
                                ${isLarge ? 'max-w-md' : ''}
                              `}
                              style={{ 
                                color: getTextColor(),
                                ...descriptionStyles
                              }}
                              onDoubleClick={handleDescriptionDoubleClick}
                              title={card.isProfileCard ? "Carte profil - Non éditable" : "Double-cliquez pour éditer (Ctrl+Enter pour valider)"}
                            >
                              {card.description}
                            </motion.p>
                          )}
                        </>
                      )}

                      {/* Apple Music Info for large cards */}
                      {isLarge && card.appleMusicData && (
                        <div className="flex items-center gap-4 mb-4">
                          {card.appleMusicData.artwork && (
                            <img
                              src={card.appleMusicData.artwork}
                              alt={card.appleMusicData.name}
                              className="w-16 h-16 rounded-lg object-cover border border-white/30"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-lg truncate">
                              {card.appleMusicData.name}
                            </p>
                            {card.appleMusicData.artistName && (
                              <p className="text-white/90 text-base truncate">
                                {card.appleMusicData.artistName}
                              </p>
                            )}
                            {card.appleMusicData.albumName && (
                              <p className="text-white/70 text-sm truncate">
                                {card.appleMusicData.albumName}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs text-white/60">
                              {card.appleMusicData.durationInMillis && (
                                <span className="flex items-center gap-1">
                                  <Icons.Clock size={12} />
                                  {Math.floor(card.appleMusicData.durationInMillis / 60000)}:
                                  {Math.floor((card.appleMusicData.durationInMillis % 60000) / 1000).toString().padStart(2, '0')}
                                </span>
                              )}
                              {card.appleMusicData.genreNames && card.appleMusicData.genreNames.length > 0 && (
                                <span className="flex items-center gap-1">
                                  <Icons.Tag size={12} />
                                  {card.appleMusicData.genreNames[0]}
                                </span>
                              )}
                            </div>
                          </div>
                          {card.appleMusicData.previewUrl && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={handlePlayAppleMusic}
                              className={`p-3 rounded-full backdrop-blur-sm border border-white/30 transition-all ${
                                isPlayingAppleMusic 
                                  ? 'bg-green-500/80 border-green-400/50' 
                                  : 'bg-white/20 hover:bg-white/30'
                              }`}
                            >
                              {isPlayingAppleMusic ? (
                                <Icons.Pause size={20} className="text-white" />
                              ) : (
                                <Icons.Play size={20} className="text-white" />
                              )}
                            </motion.button>
                          )}
                        </div>
                      )}

                      {/* Action button - Seulement si URL est définie */}
                      {card.url && (
                        <motion.button
                          whileHover={!isDragOverlay && !isBeingDragged ? { scale: 1.05 } : {}}
                          whileTap={!isDragOverlay && !isBeingDragged ? { scale: 0.95 } : {}}
                          onClick={handleLinkClick}
                          transition={{ 
                            type: 'spring', 
                            stiffness: 400, 
                            damping: 25 
                          }}
                          className={`
                            inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm 
                            border border-white/30 rounded-full font-medium
                            hover:bg-white/30 transition-all duration-300
                            ${isLarge ? 'px-6 py-3 text-sm' : 'px-4 py-2 text-xs'}
                            ${typography.textAlign === 'center' ? 'mx-auto' : 
                              typography.textAlign === 'right' ? 'ml-auto' : ''}
                          `}
                          style={{ 
                            color: getTextColor(),
                            fontFamily: fontFamilyMap[typography.fontFamily],
                            fontWeight: typography.descriptionWeight,
                            backgroundColor: useCompanyColors ? `${profile.companyPrimaryColor}40` : undefined,
                            borderColor: useCompanyColors ? `${profile.companyPrimaryColor}80` : undefined
                          }}
                        >
                          {card.appleMusicData ? 'Écouter' : card.calendlyData ? 'Réserver' : isLarge ? 'Découvrir' : 'Voir'}
                          <Icons.ArrowRight size={isLarge ? 16 : 14} />
                        </motion.button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-700"
              style={{ 
                background: `radial-gradient(circle at center, ${getTextColor()}, transparent 70%)` 
              }}
            />

            {/* Premium shine effect */}
            <motion.div
              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
                transform: 'translateX(-100%)',
              }}
              animate={{
                transform: ['translateX(-100%)', 'translateX(100%)'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut'
              }}
            />

            {/* Indicateur de sélection avec raccourcis */}
            {isSelected && !isEditingTitle && !isEditingDescription && !isPreviewMode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-lg text-xs text-white font-mono"
              >
                {card.isProfileCard ? (
                  'Carte Profil • Del:Supprimer'
                ) : (
                  `Sélectionné • F2:Éditer • Del:Supprimer ${card.appleMusicData?.previewUrl ? '• Space:Play' : ''}`
                )}
              </motion.div>
            )}

            {/* Indicateur d'édition */}
            {(isEditingTitle || isEditingDescription) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 right-2 px-2 py-1 bg-blue-500/90 backdrop-blur-sm rounded-lg text-xs text-white font-mono flex items-center gap-1"
              >
                <Icons.Edit3 size={12} />
                {isEditingTitle ? 'Édition titre' : 'Édition description'}
              </motion.div>
            )}

            {/* Indicateur carte profil */}
            {card.isProfileCard && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 left-2 px-2 py-1 bg-orange-500/90 backdrop-blur-sm rounded-lg text-xs text-white font-mono flex items-center gap-1"
              >
                <Icons.User size={12} />
                Profil
              </motion.div>
            )}

            {/* Indicateur vidéo */}
            {card.backgroundVideo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 left-2 px-2 py-1 bg-purple-500/90 backdrop-blur-sm rounded-lg text-xs text-white font-mono flex items-center gap-1"
              >
                <Icons.Play size={12} />
                Vidéo
              </motion.div>
            )}

            {/* Indicateur Apple Music */}
            {card.appleMusicData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 left-2 px-2 py-1 bg-pink-500/90 backdrop-blur-sm rounded-lg text-xs text-white font-mono flex items-center gap-1"
              >
                <Icons.Music size={12} />
                Apple Music
                {isPlayingAppleMusic && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-green-400 rounded-full"
                  />
                )}
              </motion.div>
            )}

            {/* Indicateur Calendly */}
            {card.calendlyData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 left-2 px-2 py-1 bg-blue-500/90 backdrop-blur-sm rounded-lg text-xs text-white font-mono flex items-center gap-1"
              >
                <Icons.Calendar size={12} />
                Calendly
              </motion.div>
            )}

            {/* Indicateur Formulaire */}
            {card.contactFormData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-2 left-2 px-2 py-1 bg-teal-500/90 backdrop-blur-sm rounded-lg text-xs text-white font-mono flex items-center gap-1"
              >
                {card.contactFormData.type === 'contact' ? (
                  <Icons.MessageSquare size={12} />
                ) : (
                  <Icons.Mail size={12} />
                )}
                {card.contactFormData.type === 'contact' ? 'Contact' : 'Newsletter'}
              </motion.div>
            )}

            {/* Indicateur Layout Interne */}
            {internalLayout.enabled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-2 left-2 px-2 py-1 bg-purple-500/90 backdrop-blur-sm rounded-lg text-xs text-white font-mono flex items-center gap-1"
              >
                <Icons.Grid size={12} />
                Layout
                {internalLayout.showGrid && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-purple-400 rounded-full"
                  />
                )}
              </motion.div>
            )}

            {/* Erreur Apple Music */}
            {appleMusicError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-lg text-xs text-white flex items-center gap-1"
              >
                <Icons.AlertCircle size={12} />
                {appleMusicError}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAppleMusicError(null)}
                  className="ml-auto"
                >
                  <Icons.X size={12} />
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Menu contextuel */}
      <ContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={() => setContextMenu({ isOpen: false, position: { x: 0, y: 0 } })}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}
        onCopyLink={card.url ? handleCopyLink : undefined}
        onChangeColor={handleChangeColor}
        hasUrl={!!card.url}
      />
    </>
  );
};
