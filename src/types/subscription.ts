export interface SubscriptionPlan {
  id: 'free' | 'starter' | 'pro';
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  stripePriceIds: {
    monthly: string;
    yearly: string;
  };
  features: {
    maxCards: number;
    gridSizes: string[];
    customColors: boolean;
    removeBranding: boolean;
    analytics: 'basic' | 'advanced' | 'pro';
    customDomain: boolean;
    themes: number;
    abTesting: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    exportBackup: boolean;
    prioritySupport: boolean;
  };
  popular?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  planId: 'free' | 'starter' | 'pro';
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  billingCycle: 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

export interface Usage {
  userId: string;
  cardsUsed: number;
  lastUpdated: Date;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'sepa_debit';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  created: Date;
  dueDate?: Date;
  pdfUrl?: string;
}

export interface BillingInfo {
  subscription: Subscription;
  paymentMethods: PaymentMethod[];
  upcomingInvoice?: {
    amount: number;
    currency: string;
    periodStart: Date;
    periodEnd: Date;
  };
  invoices: Invoice[];
}