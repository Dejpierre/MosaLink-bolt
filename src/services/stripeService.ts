// This file is kept as a placeholder but functionality is removed
// Stripe integration is disabled

class StripeService {
  // Mock methods that return empty or default values
  async initialize() {
    return null;
  }

  async createCheckoutSession() {
    console.log('Stripe integration is disabled');
    return { sessionId: 'mock-session-id', url: '#' };
  }

  async redirectToCheckout() {
    console.log('Stripe integration is disabled');
  }

  async createPortalSession() {
    console.log('Stripe integration is disabled');
    return { url: '#' };
  }

  async redirectToPortal() {
    console.log('Stripe integration is disabled');
  }

  async getBillingInfo() {
    console.log('Stripe integration is disabled');
    return {
      paymentMethods: [],
      invoices: []
    };
  }
}

export const stripeService = new StripeService();