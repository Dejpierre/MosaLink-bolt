import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Check if Stripe is properly configured
export const isStripeConfigured = () => {
  return !!(
    stripeSecretKey && 
    stripeSecretKey !== 'your-stripe-secret-key' &&
    !stripeSecretKey.startsWith('sk_test_your')
  );
};

// Create Stripe instance only if properly configured
export const stripe = isStripeConfigured()
  ? new Stripe(stripeSecretKey!, {
      apiVersion: '2023-10-16', // Use the latest API version
    })
  : null;