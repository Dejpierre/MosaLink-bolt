// Design System - Tokens centralisés
export const designTokens = {
  // === COULEURS ===
  colors: {
    // Couleurs principales
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Couleur principale
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49'
    },
    
    // Couleurs secondaires
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Couleur secondaire
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764'
    },
    
    // Couleurs d'accent
    accent: {
      pink: '#ec4899',
      orange: '#f97316',
      green: '#10b981',
      red: '#ef4444',
      yellow: '#eab308',
      cyan: '#06b6d4'
    },
    
    // Couleurs neutres
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a'
    },
    
    // Couleurs avec transparence
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.2)',
      strong: 'rgba(255, 255, 255, 0.3)',
      dark: 'rgba(0, 0, 0, 0.1)',
      darkMedium: 'rgba(0, 0, 0, 0.2)',
      darkStrong: 'rgba(0, 0, 0, 0.3)'
    }
  },
  
  // === GRADIENTS ===
  gradients: {
    primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    secondary: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
    background: {
      light: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      dark: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      premium: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)'
    },
    card: {
      glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      hover: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)'
    }
  },
  
  // === ESPACEMENTS ===
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
    '5xl': '8rem'     // 128px
  },
  
  // === RAYONS DE BORDURE ===
  borderRadius: {
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    full: '9999px'
  },
  
  // === OMBRES ===
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
    glowPurple: '0 0 20px rgba(139, 92, 246, 0.3)',
    glowPink: '0 0 20px rgba(236, 72, 153, 0.3)'
  },
  
  // === TYPOGRAPHIE ===
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  
  // === ANIMATIONS ===
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms'
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },
  
  // === BREAKPOINTS ===
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

// === THÈMES ===
export const themes = {
  light: {
    background: designTokens.gradients.background.light,
    surface: designTokens.colors.neutral[50],
    text: {
      primary: designTokens.colors.neutral[900],
      secondary: designTokens.colors.neutral[600],
      muted: designTokens.colors.neutral[400]
    },
    border: designTokens.colors.neutral[200]
  },
  
  dark: {
    background: designTokens.gradients.background.dark,
    surface: designTokens.colors.neutral[900],
    text: {
      primary: designTokens.colors.neutral[50],
      secondary: designTokens.colors.neutral[300],
      muted: designTokens.colors.neutral[500]
    },
    border: designTokens.colors.neutral[700]
  },
  
  premium: {
    background: designTokens.gradients.background.premium,
    surface: designTokens.colors.glass.light,
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.8)',
      muted: 'rgba(255, 255, 255, 0.6)'
    },
    border: designTokens.colors.glass.medium
  }
};

// === COMPOSANTS PRÉDÉFINIS ===
export const componentStyles = {
  button: {
    primary: {
      background: designTokens.gradients.primary,
      color: '#ffffff',
      padding: `${designTokens.spacing.md} ${designTokens.spacing.xl}`,
      borderRadius: designTokens.borderRadius.lg,
      boxShadow: designTokens.shadows.md,
      transition: `all ${designTokens.animations.duration.normal} ${designTokens.animations.easing.easeInOut}`
    },
    secondary: {
      background: designTokens.colors.glass.light,
      color: designTokens.colors.neutral[700],
      border: `1px solid ${designTokens.colors.glass.medium}`,
      padding: `${designTokens.spacing.md} ${designTokens.spacing.xl}`,
      borderRadius: designTokens.borderRadius.lg,
      backdropFilter: 'blur(10px)'
    }
  },
  
  card: {
    default: {
      background: designTokens.gradients.card.glass,
      border: `1px solid ${designTokens.colors.glass.medium}`,
      borderRadius: designTokens.borderRadius['2xl'],
      padding: designTokens.spacing.xl,
      backdropFilter: 'blur(20px)',
      boxShadow: designTokens.shadows.lg
    },
    hover: {
      background: designTokens.gradients.card.hover,
      transform: 'translateY(-2px)',
      boxShadow: designTokens.shadows.xl
    }
  },
  
  input: {
    default: {
      background: designTokens.colors.glass.light,
      border: `1px solid ${designTokens.colors.glass.medium}`,
      borderRadius: designTokens.borderRadius.lg,
      padding: designTokens.spacing.md,
      color: designTokens.colors.neutral[700],
      fontSize: designTokens.typography.fontSize.base
    },
    focus: {
      borderColor: designTokens.colors.primary[500],
      boxShadow: `0 0 0 3px ${designTokens.colors.primary[500]}20`,
      outline: 'none'
    }
  }
};

// === UTILITAIRES ===
export const utils = {
  // Fonction pour créer des variantes de couleur
  createColorVariants: (baseColor: string) => ({
    50: `${baseColor}0D`,   // 5% opacity
    100: `${baseColor}1A`,  // 10% opacity
    200: `${baseColor}33`,  // 20% opacity
    300: `${baseColor}4D`,  // 30% opacity
    400: `${baseColor}66`,  // 40% opacity
    500: baseColor,         // 100% opacity
    600: `${baseColor}CC`,  // 80% opacity
    700: `${baseColor}B3`,  // 70% opacity
    800: `${baseColor}99`,  // 60% opacity
    900: `${baseColor}80`   // 50% opacity
  }),
  
  // Fonction pour créer des gradients personnalisés
  createGradient: (color1: string, color2: string, direction = '135deg') => 
    `linear-gradient(${direction}, ${color1} 0%, ${color2} 100%)`,
  
  // Fonction pour créer des ombres colorées
  createColoredShadow: (color: string, opacity = 0.3) => 
    `0 0 20px ${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
  
  // Fonction pour créer des styles glass morphism
  createGlassMorphism: (opacity = 0.1, blur = 20) => ({
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(255, 255, 255, ${opacity * 2})`
  })
};