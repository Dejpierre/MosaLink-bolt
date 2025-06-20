// Design System - Composants réutilisables
import { designTokens, themes, componentStyles } from './tokens';

// === CLASSES CSS UTILITAIRES ===
export const cssClasses = {
  // Layouts
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  flexCenter: 'flex items-center justify-center',
  flexBetween: 'flex items-center justify-between',
  gridResponsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  
  // Texte
  textGradient: 'bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent',
  textShadow: 'drop-shadow-sm',
  
  // Boutons
  btnPrimary: 'px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105',
  btnSecondary: 'px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 hover:border-white/30 transition-all duration-300',
  btnGhost: 'px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200',
  
  // Cartes
  cardGlass: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl',
  cardHover: 'hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300',
  
  // Inputs
  input: 'w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-colors duration-200',
  textarea: 'w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:border-white/40 focus:outline-none transition-colors duration-200 resize-none',
  
  // Animations
  fadeIn: 'animate-in fade-in duration-300',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200',
  
  // États
  loading: 'animate-pulse',
  disabled: 'opacity-50 cursor-not-allowed',
  selected: 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent',
  
  // Responsive
  hiddenMobile: 'hidden md:block',
  hiddenDesktop: 'block md:hidden',
  
  // Scrollbar personnalisée
  scrollbar: 'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30'
};

// === COMPOSANTS STYLÉS ===
export const styledComponents = {
  // Modal
  modal: {
    overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4',
    content: 'bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto',
    header: 'flex items-center justify-between mb-6',
    title: 'text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent',
    closeButton: 'p-2 rounded-lg hover:bg-white/10 transition-colors'
  },
  
  // Sidebar
  sidebar: {
    container: 'h-full bg-white/10 backdrop-blur-xl border-r border-white/20 flex flex-col',
    header: 'p-6 border-b border-white/20',
    content: 'flex-1 overflow-y-auto',
    tab: 'flex-1 flex items-center justify-center gap-2 p-2 rounded-md text-sm font-medium transition-all',
    tabActive: 'bg-white/20 text-white shadow-lg',
    tabInactive: 'text-gray-400 hover:text-white hover:bg-white/10'
  },
  
  // Cards
  bentoCard: {
    container: 'relative h-full w-full min-h-[120px] rounded-2xl p-6 overflow-hidden transition-all duration-500 ease-out',
    selected: 'ring-2 ring-white/50 ring-offset-2 ring-offset-transparent shadow-2xl',
    hover: 'hover:shadow-xl',
    dragOverlay: 'shadow-2xl ring-2 ring-white/30',
    content: 'relative z-10 h-full flex flex-col',
    icon: 'p-2 rounded-lg bg-white/20 backdrop-blur-sm',
    title: 'font-bold text-lg mb-1 leading-tight',
    description: 'text-sm opacity-90 leading-snug',
    button: 'mt-3 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-xs font-medium self-start hover:bg-white/30 transition-colors duration-300'
  },
  
  // Profile
  profile: {
    container: 'relative mb-8 p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 overflow-hidden',
    image: 'w-24 h-24 lg:w-32 lg:h-32 rounded-2xl object-cover border-4 border-white/20 shadow-2xl',
    name: 'text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2',
    bio: 'text-gray-300 text-lg leading-relaxed mb-4 max-w-2xl',
    info: 'flex flex-wrap items-center gap-4 text-sm text-gray-400',
    editButton: 'flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-300 text-sm font-medium'
  }
};

// === THÈME MANAGER ===
export class ThemeManager {
  private currentTheme: keyof typeof themes = 'premium';
  
  setTheme(theme: keyof typeof themes) {
    this.currentTheme = theme;
    this.applyTheme();
  }
  
  getCurrentTheme() {
    return themes[this.currentTheme];
  }
  
  private applyTheme() {
    const theme = this.getCurrentTheme();
    const root = document.documentElement;
    
    // Appliquer les variables CSS
    root.style.setProperty('--theme-background', theme.background);
    root.style.setProperty('--theme-surface', theme.surface);
    root.style.setProperty('--theme-text-primary', theme.text.primary);
    root.style.setProperty('--theme-text-secondary', theme.text.secondary);
    root.style.setProperty('--theme-text-muted', theme.text.muted);
    root.style.setProperty('--theme-border', theme.border);
  }
  
  // Méthodes utilitaires
  getColor(path: string) {
    const keys = path.split('.');
    let value: any = designTokens.colors;
    
    for (const key of keys) {
      value = value[key];
      if (!value) return null;
    }
    
    return value;
  }
  
  createCustomGradient(color1: string, color2: string) {
    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
  }
}

// Instance globale du gestionnaire de thème
export const themeManager = new ThemeManager();

// === HOOKS PERSONNALISÉS ===
export const useDesignSystem = () => {
  return {
    tokens: designTokens,
    themes,
    components: componentStyles,
    classes: cssClasses,
    styled: styledComponents,
    themeManager
  };
};

// === CONSTANTES DE COULEURS POPULAIRES ===
export const popularColors = {
  social: {
    twitter: '#1da1f2',
    github: '#333333',
    linkedin: '#0077b5',
    instagram: '#e4405f',
    youtube: '#ff0000',
    facebook: '#1877f2',
    discord: '#5865f2',
    tiktok: '#000000'
  },
  
  brands: {
    google: '#4285f4',
    apple: '#000000',
    microsoft: '#00a1f1',
    amazon: '#ff9900',
    netflix: '#e50914',
    spotify: '#1db954',
    uber: '#000000',
    airbnb: '#ff5a5f'
  },
  
  categories: {
    work: '#6366f1',
    social: '#ec4899',
    entertainment: '#f97316',
    education: '#10b981',
    health: '#ef4444',
    finance: '#eab308',
    travel: '#06b6d4',
    food: '#84cc16'
  }
};