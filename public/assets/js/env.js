// Environment Configuration
// This file should be loaded before other scripts on pages that need environment variables
// In production, these values should be set in Netlify environment variables

// Stripe Link for "Buy Me a Coffee" button (legacy - kept for backwards compatibility)
// Set this in Netlify: Site settings > Environment variables > STRIPE_LINK
const STRIPE_LINK = "https://your-real-stripe-link.com";

// Stripe Publishable Key for client-side Stripe integration
// Set this in Netlify: Site settings > Environment variables > STRIPE_PUBLISHABLE_KEY
// This key is safe to expose in client-side code
const STRIPE_PUBLISHABLE_KEY = typeof process !== 'undefined' && process.env && process.env.STRIPE_PUBLISHABLE_KEY 
  ? process.env.STRIPE_PUBLISHABLE_KEY 
  : "pk_test_placeholder"; // Replace with actual key in Netlify

// Add other environment variables here as needed
