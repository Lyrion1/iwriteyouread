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

- `/public/works.html` (line ~313)
- `/public/blog.html` (line ~193)

Replace:
```javascript
const STRIPE_CHECKOUT_URL = "https://your-real-stripe-link.com";
```

With:
```javascript
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/YOUR-ACTUAL-STRIPE-LINK";
```

### Testing Locally

When testing locally, the button will use the placeholder URL defined in the HTML files. Update it with your test Stripe link if needed.

## Notes

- The "Support My Work" button appears on the Works and Blog pages
- The button styling uses a chocolate brown woodgrain theme (#5e3c2f)
- The button is positioned fixed at the bottom-right of the screen
- All external links include `rel="noopener noreferrer"` for security
