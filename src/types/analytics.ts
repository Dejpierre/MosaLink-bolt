export interface AnalyticsEvent {
  id: string;
  type: 'click' | 'view' | 'share' | 'export' | 'card_add' | 'card_edit' | 'profile_view';
  cardId?: string;
  timestamp: Date;
  metadata?: {
    // Données de l'utilisateur
    userAgent?: string;
    referrer?: string;
    country?: string;
    city?: string;
    device?: 'mobile' | 'tablet' | 'desktop';
    browser?: string;
    os?: string;
    
    // Données de la session
    sessionId?: string;
    sessionDuration?: number;
    isNewVisitor?: boolean;
    
    // Données spécifiques à l'événement
    cardTitle?: string;
    cardUrl?: string;
    clickPosition?: { x: number; y: number };
    scrollPosition?: number;
    timeOnPage?: number;
    
    // Données de conversion
    conversionValue?: number;
    conversionType?: string;
    
    // Données A/B testing (Pro uniquement)
    variant?: string;
    experimentId?: string;
  };
}

export interface AnalyticsStats {
  // Métriques de base (tous les plans)
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  
  // Métriques avancées (Starter+)
  clicksByCard?: { [cardId: string]: number };
  topReferrers?: Array<{ source: string; count: number }>;
  deviceBreakdown?: { mobile: number; tablet: number; desktop: number };
  hourlyStats?: Array<{ hour: number; views: number; clicks: number }>;
  
  // Métriques Pro
  conversionRate?: number;
  averageSessionDuration?: number;
  bounceRate?: number;
  geographicData?: Array<{ country: string; count: number }>;
  browserStats?: Array<{ browser: string; count: number }>;
  clickHeatmap?: Array<{ x: number; y: number; intensity: number }>;
  funnelData?: Array<{ step: string; conversions: number; dropoff: number }>;
  
  // Données temporelles
  period: 'today' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsFilter {
  dateRange: {
    start: Date;
    end: Date;
  };
  cardIds?: string[];
  eventTypes?: AnalyticsEvent['type'][];
  devices?: string[];
  countries?: string[];
  referrers?: string[];
}

export interface ConversionGoal {
  id: string;
  name: string;
  type: 'click' | 'time_on_page' | 'scroll_depth' | 'custom';
  target: {
    cardId?: string;
    url?: string;
    timeThreshold?: number; // en secondes
    scrollPercentage?: number;
    customEvent?: string;
  };
  value?: number; // valeur monétaire de la conversion
  isActive: boolean;
  createdAt: Date;
}

export interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  config: {
    cardChanges?: { [cardId: string]: Partial<any> }; // Changements de cartes
    layoutChanges?: any; // Changements de layout
    profileChanges?: any; // Changements de profil
  };
  trafficPercentage: number; // % du trafic qui voit cette variante
  isActive: boolean;
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: ABTestVariant[];
  goal: ConversionGoal;
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
  results?: {
    [variantId: string]: {
      views: number;
      conversions: number;
      conversionRate: number;
      confidence: number; // niveau de confiance statistique
    };
  };
  createdAt: Date;
}