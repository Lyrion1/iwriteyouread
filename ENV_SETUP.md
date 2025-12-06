# Environment Variables Setup

## Netlify Configuration

This project uses environment variables that need to be configured in Netlify. Follow these steps:

### 1. STRIPE_CHECKOUT_URL

This environment variable contains the Stripe Payment Link for the "Support My Work" button.

**To set up in Netlify:**

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to "Site configuration" > "Environment variables"
4. Click "Add a variable"
5. Set:
   - **Key**: `STRIPE_CHECKOUT_URL`
   - **Value**: Your actual Stripe payment link (e.g., `https://buy.stripe.com/your-actual-link`)
   - **Scopes**: Select "Production" and "Deploy previews" as needed

6. Click "Create variable"
7. Redeploy your site for changes to take effect

### Alternative: Manual Script Update

For immediate deployment without Netlify environment variable injection, you can manually update the value in:

- `/public/assets/js/env.js`

Replace:
```javascript
const STRIPE_CHECKOUT_URL = "https://your-real-stripe-link.com";
```

With:
```javascript
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/YOUR-ACTUAL-STRIPE-LINK";
```

### Testing Locally

When testing locally, the button will use the placeholder URL defined in `env.js`. The JavaScript will log a warning in the console if the placeholder URL is detected. Update `env.js` with your test Stripe link if needed.

### How It Works

1. The `env.js` file is loaded before `main.js` on pages with the Support button (Works and Blog)
2. The `main.js` file checks if `STRIPE_CHECKOUT_URL` is defined and updates the button's href
3. If the placeholder URL is detected, a warning is logged to the console (development only)

## Notes

- The "Support My Work" button appears on the Works and Blog pages
- The button styling uses a chocolate brown woodgrain theme (#5e3c2f)
- The button is positioned fixed at the bottom-right of the screen
- All external links include `rel="noopener noreferrer"` for security
- The placeholder URL will work but should be replaced with your actual Stripe link before production deployment
