# Environment Variables Setup

## Netlify Configuration

This project uses environment variables for the Stripe-powered "Buy Me a Coffee" donation button. The variables need to be configured in Netlify's dashboard.

## Required Environment Variables

### 1. STRIPE_PUBLISHABLE_KEY (Required)

This environment variable contains the Stripe publishable key for client-side API access. This key is safe to expose in browser code.

**To set up in Netlify:**

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to "Site configuration" > "Environment variables"
4. Click "Add a variable"
5. Set:
   - **Key**: `STRIPE_PUBLISHABLE_KEY`
   - **Value**: Your Stripe publishable key (e.g., `pk_live_xxxxxxxxxxxxxxxxxx` or `pk_test_xxxxxxxxxxxxxxxxxx` for testing)
   - **Scopes**: Select "Functions" and "Builds"
   - **Context**: All (Production, Deploy previews, Branch deploys)

6. Click "Create variable"

**Where to find it**: Stripe Dashboard > Developers > API keys > Publishable key

**Note**: This key is safe to expose in client-side code. Use your test key (`pk_test_...`) for development and your live key (`pk_live_...`) for production.

### 2. STRIPE_SECRET_KEY (Required)

This environment variable contains the Stripe secret key for server-side API access. **CRITICAL**: This key must be kept secret and should only be used in Netlify Functions, never in client-side code.

**To set up in Netlify:**

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to "Site configuration" > "Environment variables"
4. Click "Add a variable"
5. Set:
   - **Key**: `STRIPE_SECRET_KEY`
   - **Value**: Your Stripe secret key (e.g., `sk_live_xxxxxxxxxxxxxxxxxx` or `sk_test_xxxxxxxxxxxxxxxxxx` for testing)
   - **Scopes**: Select "Functions" and "Builds"
   - **Context**: All (Production, Deploy previews, Branch deploys)

6. Click "Create variable"
7. Redeploy your site for changes to take effect

**Where to find it**: Stripe Dashboard > Developers > API keys > Secret key

**Security Warning**: The secret key should ONLY be used in Netlify Functions (serverless backend) and NEVER exposed in client-side JavaScript. Keep this key confidential and never commit it to the repository.

### 3. STRIPE_CHECKOUT_URL (Optional - Legacy)

This environment variable was used for the previous implementation and is now optional. It's kept for backwards compatibility but is no longer actively used by the current Stripe Checkout integration.

**To set up in Netlify (optional):**

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to "Site configuration" > "Environment variables"
4. Click "Add a variable"
5. Set:
   - **Key**: `STRIPE_CHECKOUT_URL`
   - **Value**: Your Stripe payment link (e.g., `https://buy.stripe.com/your-actual-link`)
   - **Scopes**: Select "Production" and "Deploy previews" as needed

6. Click "Create variable"

## How the Integration Works

1. User clicks "Buy Me a Coffee" button on the blog page
2. Client-side JavaScript (`stripe.js`) calls the Netlify Function
3. Netlify Function (`create-checkout-session.js`) uses the secret key to create a Stripe Checkout session
4. User is redirected to Stripe's hosted checkout page
5. After successful payment, user is redirected to `/donation-thank-you.html`
6. If cancelled, user is redirected back to `/blog.html`

## Testing Locally

When testing locally, the button will use placeholder values. To test the full integration:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Set environment variables in a `.env` file (don't commit this file!)
3. Run `netlify dev` to test functions locally

Example `.env` file (for local testing only):
```
STRIPE_PUBLISHABLE_KEY=pk_test_your_test_key
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
```

## Stripe Checkout Session Configuration

The donation is configured as:
- **Amount**: £5.00 (fixed)
- **Currency**: GBP (British Pounds)
- **Payment methods**: Card (credit/debit)
- **Mode**: One-time payment
- **Success URL**: `/donation-thank-you.html`
- **Cancel URL**: `/blog.html`

## Security Notes

- ✅ Publishable key is safe to use in client-side code
- ❌ Secret key must NEVER be exposed in client-side code
- ✅ All payment processing happens on Stripe's secure servers
- ✅ No sensitive payment data is stored on this site
- ✅ Uses Stripe's PCI-compliant checkout flow

## File Structure

```
/netlify/functions/
  ├── create-checkout-session.js  (Backend function using secret key)
  └── package.json                (Stripe dependency)

/public/assets/js/
  ├── env.js                      (Environment configuration)
  └── stripe.js                   (Client-side integration using publishable key)

/public/
  ├── blog.html                   (Page with donation button)
  └── donation-thank-you.html     (Success page)
```

## Troubleshooting

**Button is disabled/grayed out:**
- Check that `STRIPE_PUBLISHABLE_KEY` is set in Netlify
- Check browser console for JavaScript errors
- Redeploy the site after setting environment variables

**"Failed to create checkout session" error:**
- Check that `STRIPE_SECRET_KEY` is set in Netlify
- Verify the secret key is valid in your Stripe dashboard
- Check Netlify function logs for detailed errors

**Payment doesn't redirect to thank you page:**
- Verify the success URL is correctly configured
- Check that `/donation-thank-you.html` exists and is accessible

## Notes

- The "Buy Me a Coffee" button appears on the Blog page
- The button uses a brown coffee-themed design with hover effects
- The button is positioned fixed at the bottom-right of the screen
- Mobile responsive and optimized for speed
- Minimal dependencies (only Stripe.js library loaded)

