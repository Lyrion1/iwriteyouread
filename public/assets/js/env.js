// Environment Configuration
// This file should be loaded before other scripts on pages that need environment variables
// In production, environment variables are injected by Netlify at build time

// Stripe Link for "Buy Me a Coffee" button (legacy - kept for backwards compatibility)
// Set this in Netlify: Site settings > Environment variables > STRIPE_LINK
const STRIPE_LINK = "https://your-real-stripe-link.com";

// Stripe Publishable Key for client-side Stripe integration
// Set this in Netlify: Site settings > Environment variables > STRIPE_PUBLISHABLE_KEY
// This key is safe to expose in client-side code
// Note: In production, replace this placeholder with the actual key from environment variables
// The stripe.js script will check if this is still a placeholder and log an error
const STRIPE_PUBLISHABLE_KEY = "pk_test_placeholder"; // Replace with actual key in Netlify

// Add other environment variables here as needed
