import { loadStripe } from '@stripe/stripe-js';

// Replace with your publishable key from the Stripe dashboard
export const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '');
