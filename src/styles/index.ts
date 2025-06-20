// Point d'entrée pour les styles personnalisés
// Vous pouvez importer et exporter des styles, thèmes, ou utilitaires CSS ici

// Exemple d'utilitaire pour générer des dégradés
export const createGradient = (color1: string, color2: string, direction = '90deg') => {
  return `linear-gradient(${direction}, ${color1}, ${color2})`;
};

// Exemple de thème avec des variables de couleurs
export const theme = {
  colors: {
    primary: '#9267FD',
    secondary: '#00C680',
    accent: '#FE6BAC',
    warning: '#FFBA59',
    info: '#53C5FF',
    success: '#00C680',
    error: '#FF5A5A',
    background: '#F3F4F1',
    text: '#1F2937',
    textLight: '#6B7280',
  },
  fonts: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
  },
  transitions: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
  },
};

// Exemple de fonction pour générer des classes CSS dynamiques
export const generateUtilityClass = (property: string, value: string) => {
  return { [property]: value };
};

// Exemple de mixins pour des styles réutilisables
export const mixins = {
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  absoluteCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  truncate: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  glassmorphism: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
};

// Exportation par défaut
export default {
  theme,
  createGradient,
  generateUtilityClass,
  mixins,
};