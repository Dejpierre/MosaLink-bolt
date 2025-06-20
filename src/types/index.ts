export type GridSize = '1x1' | '2x1' | '3x1' | '4x1' | '5x1' | '6x1' | '7x1' | '8x1' | '9x1' | '10x1' | '11x1' | '12x1' |
                      '1x2' | '2x2' | '3x2' | '4x2' | '5x2' | '6x2' | '7x2' | '8x2' | '9x2' | '10x2' | '11x2' | '12x2' |
                      '1x3' | '2x3' | '3x3' | '4x3' | '5x3' | '6x3' | '7x3' | '8x3' | '9x3' | '10x3' | '11x3' | '12x3' |
                      '1x4' | '2x4' | '3x4' | '4x4' | '5x4' | '6x4' | '7x4' | '8x4' | '9x4' | '10x4' | '11x4' | '12x4';

export type FontFamily = 'inter' | 'poppins' | 'roboto' | 'playfair' | 'montserrat' | 'lora' | 'oswald' | 'dancing-script';
export type FontWeight = '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type TextAlign = 'left' | 'center' | 'right';
export type UserPlan = 'free' | 'starter' | 'pro';
export type ProfileType = 'personal' | 'company';

export interface Typography {
  fontFamily: FontFamily;
  titleWeight: FontWeight;
  descriptionWeight: FontWeight;
  textAlign: TextAlign;
  titleSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  descriptionSize?: 'xs' | 'sm' | 'base' | 'lg';
}

export interface AppleMusicData {
  type: 'song' | 'album' | 'playlist' | 'artist';
  id: string;
  name: string;
  artistName?: string;
  albumName?: string;
  artwork?: string;
  previewUrl?: string;
  appleMusicUrl?: string;
  isrc?: string;
  releaseDate?: string;
  genreNames?: string[];
  durationInMillis?: number;
  trackNumber?: number;
  discNumber?: number;
}

// Formulaire de contact ou newsletter
export interface ContactFormData {
  type: 'contact' | 'newsletter';
  buttonText?: string;
  placeholderText?: string;
  successMessage?: string;
}

// NOUVEAU: Intégration Calendly
export interface CalendlyData {
  url: string; // URL Calendly (ex: https://calendly.com/username/meeting)
  displayMode: 'popup' | 'inline' | 'redirect'; // Mode d'affichage
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: { [key: string]: string };
  };
  utm?: {
    utmCampaign?: string;
    utmSource?: string;
    utmMedium?: string;
    utmContent?: string;
    utmTerm?: string;
  };
  embedHeight?: number; // Hauteur pour le mode inline (défaut: 630px)
  hideEventTypeDetails?: boolean;
  hideLandingPageDetails?: boolean;
  primaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
}

// Nouveau système de layout interne
export type InternalLayoutZone = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface InternalLayoutElement {
  id: string;
  type: 'text' | 'image' | 'icon' | 'button' | 'music' | 'video';
  zone: InternalLayoutZone;
  content?: string; // Pour le texte
  imageUrl?: string; // Pour les images
  iconName?: string; // Pour les icônes
  buttonText?: string; // Pour les boutons
  buttonUrl?: string; // Pour les boutons
  styles?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: string;
    padding?: string;
  };
}

export interface InternalLayout {
  enabled: boolean;
  elements: InternalLayoutElement[];
  showGrid?: boolean; // Pour afficher la grille en mode édition
}

// NOUVEAU: Système de fond global
export type GlobalBackgroundType = 'color' | 'gradient' | 'image' | 'video' | 'pattern';

export interface GlobalBackgroundSettings {
  type: GlobalBackgroundType;
  // Pour les couleurs
  color?: string;
  // Pour les gradients
  gradient?: {
    type: 'linear' | 'radial';
    direction?: string; // ex: '45deg', 'to right'
    colors: string[];
    stops?: number[];
  };
  // Pour les images
  image?: {
    url: string;
    size: 'cover' | 'contain' | 'auto';
    position: 'center' | 'top' | 'bottom' | 'left' | 'right';
    repeat: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
    attachment: 'scroll' | 'fixed';
    opacity?: number;
  };
  // Pour les vidéos
  video?: {
    url: string;
    opacity?: number;
    blur?: number;
    speed?: number;
  };
  // Pour les motifs
  pattern?: {
    type: 'dots' | 'grid' | 'diagonal' | 'waves' | 'hexagon' | 'triangles';
    color: string;
    size: number;
    opacity: number;
  };
  // Overlay général
  overlay?: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
}

// NOUVEAU: Position dans la grille
export interface GridPosition {
  col: number;
  row: number;
}

export interface BentoCard {
  id: string;
  title: string;
  description: string;
  url: string;
  backgroundColor: string;
  textColor: string;
  size: GridSize;
  order: number;
  icon?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  videoSettings?: {
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    overlay?: boolean; // Pour afficher le contenu par-dessus la vidéo
  };
  appleMusicData?: AppleMusicData;
  calendlyData?: CalendlyData; // NOUVEAU: Données Calendly
  contactFormData?: ContactFormData; // NOUVEAU: Données de formulaire
  typography?: Typography;
  internalLayout?: InternalLayout; // Nouveau système de layout interne
  isProfileCard?: boolean; // NOUVEAU: Indique si cette carte contient le profil
  gridPosition?: GridPosition; // NOUVEAU: Position libre dans la grille
}

export interface ProfileData {
  type: ProfileType; // NOUVEAU: Type de profil (personnel ou entreprise)
  firstName: string;
  lastName: string;
  bio: string;
  profileImage: string;
  location?: string;
  website?: string;
  companyName?: string; // NOUVEAU: Nom de l'entreprise
  companyLogo?: string; // NOUVEAU: Logo de l'entreprise
  companyPrimaryColor?: string; // NOUVEAU: Couleur principale de l'entreprise
  companySecondaryColor?: string; // NOUVEAU: Couleur secondaire de l'entreprise
  position?: string; // NOUVEAU: Poste dans l'entreprise
}

// NOUVEAU: Configuration du placement du profil
export interface ProfilePlacement {
  mode: 'header' | 'bento'; // En haut ou dans un bloc bento
  cardId?: string; // ID de la carte qui contient le profil (si mode = 'bento')
  headerStyle?: 'compact' | 'full'; // Style du header (si mode = 'header')
}

export interface AppState {
  cards: BentoCard[];
  selectedCardId: string | null;
  isDarkMode: boolean;
  isEditing: boolean;
  history: BentoCard[][];
  historyIndex: number;
  profile: ProfileData;
  profilePlacement: ProfilePlacement; // NOUVEAU: Configuration du placement du profil
  globalBackground: GlobalBackgroundSettings; // NOUVEAU: Configuration du fond global
}

export interface CardTemplate {
  id: string;
  name: string;
  icon: string;
  card: Omit<BentoCard, 'id' | 'order'>;
}

// Nouveau système de templates de mise en page
export interface LayoutTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail?: string; // URL de l'aperçu
  category: 'business' | 'personal' | 'creative' | 'portfolio' | 'restaurant' | 'custom';
  tags: string[];
  cards: Omit<BentoCard, 'id' | 'order'>[];
  profile?: Partial<ProfileData>;
  profilePlacement?: ProfilePlacement; // NOUVEAU: Configuration du profil dans le template
  globalBackground?: GlobalBackgroundSettings; // NOUVEAU: Fond global du template
  createdAt: Date;
  updatedAt: Date;
  isCustom: boolean; // true si créé par l'utilisateur
  author?: string;
  usageCount?: number;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}