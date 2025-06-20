import { SubscriptionPlan } from '../types/subscription';

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: {
      monthly: 0,
      yearly: 0
    },
    stripePriceIds: {
      monthly: '',
      yearly: ''
    },
    features: {
      maxCards: 3,
      gridSizes: ['1x1', '2x1'],
      customColors: false,
      removeBranding: false,
      analytics: 'basic',
      customDomain: false,
      themes: 0,
      abTesting: false,
      apiAccess: false,
      whiteLabel: false,
      exportBackup: false,
      prioritySupport: false
    }
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: {
      monthly: 3.99,
      yearly: 39.99
    },
    stripePriceIds: {
      monthly: 'price_starter_monthly', // Replace with actual Stripe price IDs
      yearly: 'price_starter_yearly'
    },
    features: {
      maxCards: 25,
      gridSizes: ['1x1', '2x1', '1x2', '2x2', '3x1', '3x2', '4x1', '4x2'],
      customColors: true,
      removeBranding: true,
      analytics: 'advanced',
      customDomain: true,
      themes: 5,
      abTesting: false,
      apiAccess: false,
      whiteLabel: false,
      exportBackup: false,
      prioritySupport: false
    },
    popular: true
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: {
      monthly: 8.99,
      yearly: 89.99
    },
    stripePriceIds: {
      monthly: 'price_pro_monthly', // Replace with actual Stripe price IDs
      yearly: 'price_pro_yearly'
    },
    features: {
      maxCards: Infinity,
      gridSizes: [
        '1x1', '2x1', '3x1', '4x1', '5x1', '6x1', '7x1', '8x1', '9x1', '10x1', '11x1', '12x1',
        '1x2', '2x2', '3x2', '4x2', '5x2', '6x2', '7x2', '8x2', '9x2', '10x2', '11x2', '12x2',
        '1x3', '2x3', '3x3', '4x3', '5x3', '6x3', '7x3', '8x3', '9x3', '10x3', '11x3', '12x3',
        '1x4', '2x4', '3x4', '4x4', '5x4', '6x4', '7x4', '8x4', '9x4', '10x4', '11x4', '12x4'
      ],
      customColors: true,
      removeBranding: true,
      analytics: 'pro',
      customDomain: true,
      themes: Infinity,
      abTesting: true,
      apiAccess: true,
      whiteLabel: true,
      exportBackup: true,
      prioritySupport: true
    }
  }
};

export const TRIAL_DAYS = 7;
export const GRACE_PERIOD_DAYS = 3;