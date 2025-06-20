import { loadStripe, Stripe } from '@stripe/stripe-js';

class StripeService {
  private stripe: Stripe | null = null;
  private publishableKey: string;

  constructor() {
    this.publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  }

  async initialize(): Promise<Stripe | null> {
    if (typeof window === 'undefined') return null;
    
    if (!this.stripe && this.publishableKey) {
      this.stripe = await loadStripe(this.publishableKey);
    }
    return this.stripe;
  }

  async createCheckoutSession(priceId: string, customerId?: string) {
    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        customerId,
        successUrl: `${window.location.origin}/billing/success`,
        cancelUrl: `${window.location.origin}/pricing`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    return response.json();
  }

  async redirectToCheckout(sessionId: string) {
    const stripe = await this.initialize();
    if (!stripe) {
      throw new Error('Stripe not initialized');
    }

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) {
      throw error;
    }
  }

  async createPortalSession(customerId: string) {
    const response = await fetch('/api/stripe/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: `${window.location.origin}/billing`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create portal session');
    }

    return response.json();
  }

  async redirectToPortal(customerId: string) {
    const { url } = await this.createPortalSession(customerId);
    window.location.href = url;
  }

  async updateSubscription(subscriptionId: string, priceId: string) {
    const response = await fetch('/api/stripe/update-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        priceId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }

    return response.json();
  }

  async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true) {
    const response = await fetch('/api/stripe/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
        cancelAtPeriodEnd,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return response.json();
  }

  async pauseSubscription(subscriptionId: string) {
    const response = await fetch('/api/stripe/pause-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to pause subscription');
    }

    return response.json();
  }

  async resumeSubscription(subscriptionId: string) {
    const response = await fetch('/api/stripe/resume-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to resume subscription');
    }

    return response.json();
  }

  async getBillingInfo(customerId: string) {
    const response = await fetch(`/api/stripe/billing-info/${customerId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get billing info');
    }

    return response.json();
  }

  async retryPayment(invoiceId: string) {
    const response = await fetch('/api/stripe/retry-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to retry payment');
    }

    return response.json();
  }
}

export const stripeService = new StripeService();