// Environment Configuration
// This file should be loaded before main.js on pages that need environment variables
// In production, replace the placeholder values with actual environment variables during build

// Stripe Link for "Buy Me a Coffee" button
// Set this in Netlify: Site settings > Environment variables > STRIPE_LINK
const STRIPE_LINK = "https://your-real-stripe-link.com";

// Backward compatibility
const STRIPE_CHECKOUT_URL = STRIPE_LINK;

// Add other environment variables here as needed
