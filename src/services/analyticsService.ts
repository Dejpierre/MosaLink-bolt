import { AnalyticsEvent, AnalyticsStats, AnalyticsFilter, ConversionGoal, ABTest } from '../types/analytics';
import { UserPlan } from '../types';

class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private sessionStart: Date;
  private isNewVisitor: boolean;
  private isInitialized: boolean = false;

  constructor() {
    this.sessionId = '';
    this.sessionStart = new Date();
    this.isNewVisitor = false;
  }

  // Public method to initialize browser features - called only once from client
  public init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    // Set initialized flag FIRST to prevent recursion
    this.isInitialized = true;
    
    this.sessionId = this.generateSessionId();
    this.isNewVisitor = !localStorage.getItem('mosalink_visitor_id');
    
    if (this.isNewVisitor) {
      localStorage.setItem('mosalink_visitor_id', this.generateVisitorId());
    }

    // Charger les événements depuis le localStorage
    this.loadEvents();
    
    // Démarrer le suivi automatique
    this.startAutoTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateVisitorId(): string {
    return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadEvents(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem('mosalink_analytics_events');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.events = parsed.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp)
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des événements analytics:', error);
    }
  }

  private saveEvents(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Garder seulement les 1000 derniers événements pour éviter de surcharger le localStorage
      const eventsToSave = this.events.slice(-1000);
      localStorage.setItem('mosalink_analytics_events', JSON.stringify(eventsToSave));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des événements analytics:', error);
    }
  }

  private startAutoTracking(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined' || typeof navigator === 'undefined') return;
    
    // Suivi des vues de page
    this.trackEvent('view', undefined, {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      device: this.getDeviceType(),
      browser: this.getBrowser(),
      os: this.getOS(),
      sessionId: this.sessionId,
      isNewVisitor: this.isNewVisitor
    });

    // Suivi du temps passé sur la page
    let startTime = Date.now();
    const handleBeforeUnload = () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      this.trackEvent('view', undefined, {
        timeOnPage,
        sessionDuration: Math.round((Date.now() - this.sessionStart.getTime()) / 1000)
      });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Suivi du scroll
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      maxScroll = Math.max(maxScroll, scrollPercent);
    };
    window.addEventListener('scroll', handleScroll);

    // Sauvegarder le scroll max à la fermeture
    const handleScrollBeforeUnload = () => {
      if (maxScroll > 0) {
        this.trackEvent('view', undefined, { scrollPosition: maxScroll });
      }
    };
    window.addEventListener('beforeunload', handleScrollBeforeUnload);
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getBrowser(): string {
    if (typeof navigator === 'undefined') return 'Unknown';
    
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private getOS(): string {
    if (typeof navigator === 'undefined') return 'Unknown';
    
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }

  // Méthode principale pour tracker un événement
  trackEvent(
    type: AnalyticsEvent['type'], 
    cardId?: string, 
    additionalMetadata?: any
  ): void {
    // If not initialized, just return silently (don't try to initialize)
    if (!this.isInitialized) {
      console.warn('AnalyticsService not initialized. Call init() first.');
      return;
    }

    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      cardId,
      timestamp: new Date(),
      metadata: {
        sessionId: this.sessionId,
        device: this.getDeviceType(),
        browser: this.getBrowser(),
        os: this.getOS(),
        ...additionalMetadata
      }
    };

    this.events.push(event);
    this.saveEvents();

    console.log('📊 Événement tracké:', event);

    // En production, envoyer à votre backend
    // this.sendToBackend(event);
  }

  // Tracker un clic sur une carte
  trackCardClick(cardId: string, cardTitle: string, cardUrl: string, clickPosition?: { x: number; y: number }): void {
    this.trackEvent('click', cardId, {
      cardTitle,
      cardUrl,
      clickPosition,
      timestamp: new Date()
    });
  }

  // Tracker une vue de profil
  trackProfileView(): void {
    this.trackEvent('profile_view', undefined, {
      timestamp: new Date()
    });
  }

  // Tracker un partage
  trackShare(method: string): void {
    this.trackEvent('share', undefined, {
      shareMethod: method,
      timestamp: new Date()
    });
  }

  // Tracker un export
  trackExport(format: string): void {
    this.trackEvent('export', undefined, {
      exportFormat: format,
      timestamp: new Date()
    });
  }

  // Obtenir les statistiques selon le plan de l'utilisateur
  getStats(userPlan: UserPlan, filter?: AnalyticsFilter): AnalyticsStats {
    let filteredEvents = this.events;

    // Appliquer les filtres
    if (filter) {
      filteredEvents = this.events.filter(event => {
        const eventDate = event.timestamp;
        const inDateRange = eventDate >= filter.dateRange.start && eventDate <= filter.dateRange.end;
        const matchesCardId = !filter.cardIds || filter.cardIds.includes(event.cardId || '');
        const matchesEventType = !filter.eventTypes || filter.eventTypes.includes(event.type);
        const matchesDevice = !filter.devices || filter.devices.includes(event.metadata?.device || '');
        
        return inDateRange && matchesCardId && matchesEventType && matchesDevice;
      });
    }

    // Statistiques de base (tous les plans)
    const totalViews = filteredEvents.filter(e => e.type === 'view').length;
    const totalClicks = filteredEvents.filter(e => e.type === 'click').length;
    const uniqueVisitors = new Set(filteredEvents.map(e => e.metadata?.sessionId)).size;

    // Define clickEvents at a higher scope so it's accessible in both starter and pro blocks
    const clickEvents = filteredEvents.filter(e => e.type === 'click');

    const baseStats: AnalyticsStats = {
      totalViews,
      totalClicks,
      uniqueVisitors,
      period: 'month',
      startDate: filter?.dateRange.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: filter?.dateRange.end || new Date()
    };

    // Statistiques avancées pour Starter+
    if (userPlan === 'starter' || userPlan === 'pro') {
      // Clics par carte
      const clicksByCard: { [cardId: string]: number } = {};
      clickEvents.forEach(event => {
        if (event.cardId) {
          clicksByCard[event.cardId] = (clicksByCard[event.cardId] || 0) + 1;
        }
      });

      // Top referrers
      const referrerCounts: { [referrer: string]: number } = {};
      filteredEvents.forEach(event => {
        const referrer = event.metadata?.referrer || 'Direct';
        referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
      });
      const topReferrers = Object.entries(referrerCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Répartition par appareil
      const deviceCounts = { mobile: 0, tablet: 0, desktop: 0 };
      filteredEvents.forEach(event => {
        const device = event.metadata?.device as keyof typeof deviceCounts;
        if (device && deviceCounts.hasOwnProperty(device)) {
          deviceCounts[device]++;
        }
      });

      // Statistiques horaires
      const hourlyStats = Array.from({ length: 24 }, (_, hour) => {
        const hourEvents = filteredEvents.filter(e => e.timestamp.getHours() === hour);
        return {
          hour,
          views: hourEvents.filter(e => e.type === 'view').length,
          clicks: hourEvents.filter(e => e.type === 'click').length
        };
      });

      Object.assign(baseStats, {
        clicksByCard,
        topReferrers,
        deviceBreakdown: deviceCounts,
        hourlyStats
      });
    }

    // Statistiques Pro
    if (userPlan === 'pro') {
      const sessions = this.groupEventsBySession(filteredEvents);
      const sessionDurations = sessions.map(session => this.calculateSessionDuration(session));
      const averageSessionDuration = sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length || 0;
      
      // Taux de rebond (sessions avec une seule vue)
      const bounceSessions = sessions.filter(session => 
        session.filter(e => e.type === 'view').length === 1
      ).length;
      const bounceRate = (bounceSessions / sessions.length) * 100 || 0;

      // Données géographiques (simulées pour la démo)
      const geographicData = [
        { country: 'France', count: Math.floor(uniqueVisitors * 0.4) },
        { country: 'Canada', count: Math.floor(uniqueVisitors * 0.2) },
        { country: 'Belgique', count: Math.floor(uniqueVisitors * 0.15) },
        { country: 'Suisse', count: Math.floor(uniqueVisitors * 0.1) },
        { country: 'Autres', count: Math.floor(uniqueVisitors * 0.15) }
      ];

      // Statistiques de navigateur
      const browserCounts: { [browser: string]: number } = {};
      filteredEvents.forEach(event => {
        const browser = event.metadata?.browser || 'Unknown';
        browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      });
      const browserStats = Object.entries(browserCounts)
        .map(([browser, count]) => ({ browser, count }))
        .sort((a, b) => b.count - a.count);

      // Heatmap des clics (simulée)
      const clickHeatmap = clickEvents
        .filter(e => e.metadata?.clickPosition)
        .map(e => ({
          x: e.metadata!.clickPosition!.x,
          y: e.metadata!.clickPosition!.y,
          intensity: 1
        }));

      Object.assign(baseStats, {
        conversionRate: totalClicks > 0 ? (totalClicks / totalViews) * 100 : 0,
        averageSessionDuration,
        bounceRate,
        geographicData,
        browserStats,
        clickHeatmap
      });
    }

    return baseStats;
  }

  private groupEventsBySession(events: AnalyticsEvent[]): AnalyticsEvent[][] {
    const sessionGroups: { [sessionId: string]: AnalyticsEvent[] } = {};
    
    events.forEach(event => {
      const sessionId = event.metadata?.sessionId || 'unknown';
      if (!sessionGroups[sessionId]) {
        sessionGroups[sessionId] = [];
      }
      sessionGroups[sessionId].push(event);
    });

    return Object.values(sessionGroups);
  }

  private calculateSessionDuration(sessionEvents: AnalyticsEvent[]): number {
    if (sessionEvents.length === 0) return 0;
    
    const sortedEvents = sessionEvents.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const firstEvent = sortedEvents[0];
    const lastEvent = sortedEvents[sortedEvents.length - 1];
    
    return (lastEvent.timestamp.getTime() - firstEvent.timestamp.getTime()) / 1000;
  }

  // Obtenir les événements bruts (pour debug)
  getEvents(limit?: number): AnalyticsEvent[] {
    return limit ? this.events.slice(-limit) : this.events;
  }

  // Nettoyer les anciens événements
  cleanOldEvents(daysToKeep: number = 90): void {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp > cutoffDate);
    this.saveEvents();
  }

  // Exporter les données analytics
  exportData(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['timestamp', 'type', 'cardId', 'device', 'browser', 'referrer'];
      const rows = this.events.map(event => [
        event.timestamp.toISOString(),
        event.type,
        event.cardId || '',
        event.metadata?.device || '',
        event.metadata?.browser || '',
        event.metadata?.referrer || ''
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    
    return JSON.stringify(this.events, null, 2);
  }

  // Simuler des données pour la démo
  generateDemoData(days: number = 30): void {
    const now = new Date();
    const cardIds = ['card1', 'card2', 'card3', 'card4'];
    const devices = ['mobile', 'tablet', 'desktop'];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const referrers = ['google.com', 'twitter.com', 'linkedin.com', 'direct'];

    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const eventsPerDay = Math.floor(Math.random() * 50) + 10;

      for (let j = 0; j < eventsPerDay; j++) {
        const eventDate = new Date(date.getTime() + Math.random() * 24 * 60 * 60 * 1000);
        const eventType = Math.random() > 0.7 ? 'click' : 'view';
        const cardId = Math.random() > 0.3 ? cardIds[Math.floor(Math.random() * cardIds.length)] : undefined;

        this.events.push({
          id: `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: eventType,
          cardId,
          timestamp: eventDate,
          metadata: {
            sessionId: `demo_session_${Math.floor(Math.random() * 100)}`,
            device: devices[Math.floor(Math.random() * devices.length)] as any,
            browser: browsers[Math.floor(Math.random() * browsers.length)],
            referrer: referrers[Math.floor(Math.random() * referrers.length)],
            isNewVisitor: Math.random() > 0.7
          }
        });
      }
    }

    this.saveEvents();
    console.log(`📊 ${this.events.length} événements de démo générés`);
  }
}

export const analyticsService = new AnalyticsService();