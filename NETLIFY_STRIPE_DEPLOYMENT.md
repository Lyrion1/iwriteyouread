# Netlify Stripe Deployment Configuration

## Overview
This document outlines the correct Netlify configuration for the Stripe-powered "Buy Me a Coffee" donation button.

## Deployment Configuration Checklist

### ✅ 1. Stripe Dependency Configuration
- **Location**: `netlify/functions/package.json`
- **Status**: ✅ Configured correctly
- **Dependency**: `"stripe": "14.25.0"` (exact version pinned)
- **Lock file**: `netlify/functions/package-lock.json` (v14.25.0 installed)

### ✅ 2. Netlify Functions Directory
- **Configuration file**: `netlify.toml`
- **Setting**: `functions = "netlify/functions"`
- **Status**: ✅ Configured correctly
- **Location**: Line 8 of netlify.toml

### ✅ 3. Serverless Function Location
- **File**: `netlify/functions/create-checkout-session.js`
- **Status**: ✅ Located in correct directory
- **Endpoint**: `/.netlify/functions/create-checkout-session`

### ✅ 4. Stripe Initialization
- **Pattern**: `const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);`
- **Status**: ✅ Implemented correctly on line 4
- **Security**: Uses environment variable (not hardcoded)

### ✅ 5. Environment Variables (Required)
The following environment variables MUST be configured in Netlify dashboard:

1. **STRIPE_SECRET_KEY** (Required for backend)
   - **Scope**: Functions + Build
   - **Context**: All (Production, Deploy previews, Branch deploys)
   - **Where to find**: Stripe Dashboard → Developers → API keys → Secret key
   - **Format**: `sk_test_...` (test) or `sk_live_...` (production)

2. **STRIPE_PUBLISHABLE_KEY** (Required for frontend)
   - **Scope**: Functions + Build
   - **Context**: All
   - **Where to find**: Stripe Dashboard → Developers → API keys → Publishable key
   - **Format**: `pk_test_...` (test) or `pk_live_...` (production)

## Deployment Steps

### Step 1: Verify Code Configuration
All code configuration is complete:
- ✅ Stripe dependency in package.json
- ✅ package-lock.json committed
- ✅ Functions directory configured in netlify.toml
- ✅ Function uses secure environment variable access

### Step 2: Configure Netlify Environment Variables
1. Go to Netlify Dashboard
2. Select your site
3. Navigate to **Site configuration** → **Environment variables**
4. Add both required environment variables:
   - `STRIPE_SECRET_KEY` (your secret key from Stripe)
   - `STRIPE_PUBLISHABLE_KEY` (your publishable key from Stripe)
5. Set scopes to **Functions** and **Builds**
6. Set context to **All**

### Step 3: Deploy or Redeploy
After setting environment variables:
1. Trigger a new deploy (or merge this PR to trigger automatic deployment)
2. Netlify will:
   - Read `netlify.toml` for configuration
   - Install dependencies from `netlify/functions/package.json`
   - Build the functions
   - Deploy the site

### Step 4: Test the Integration
1. Visit your site's blog page
2. Click "Buy Me a Coffee" button
3. Verify Stripe Checkout session is created successfully
4. Test a payment (use Stripe test card: `4242 4242 4242 4242`)

## Troubleshooting

### Issue: "stripe is not defined" or "Cannot find module 'stripe'"
**Solution**: Ensure `package-lock.json` is committed and Netlify runs `npm install` in the functions directory.

### Issue: "Missing API key"
**Solution**: 
1. Verify `STRIPE_SECRET_KEY` is set in Netlify environment variables
2. Check the scope is set to include "Functions"
3. Redeploy the site after setting environment variables

### Issue: Functions not found (404)
**Solution**:
1. Verify `netlify.toml` has `functions = "netlify/functions"`
2. Verify function file is in `netlify/functions/` directory
3. Check function filename matches the expected endpoint

### Issue: Build fails with dependency errors
**Solution**:
1. Ensure `package-lock.json` is committed
2. Verify `package.json` is valid JSON
3. Check Netlify build logs for specific error messages

## Files Checklist

### Required Files (Must be committed)
- ✅ `netlify/functions/package.json`
- ✅ `netlify/functions/package-lock.json`
- ✅ `netlify/functions/create-checkout-session.js`
- ✅ `netlify.toml`
- ✅ `public/assets/js/stripe.js` (frontend integration)

### Excluded Files (Must NOT be committed)
- ❌ `netlify/functions/node_modules/` (in .gitignore)
- ❌ `.env` files with secrets (in .gitignore)

## Security Best Practices

1. ✅ **Never commit secrets**: API keys are in environment variables, not code
2. ✅ **Separate keys**: Use test keys for development, live keys for production
3. ✅ **Secure initialization**: Stripe initialized server-side only
4. ✅ **Environment variables**: Properly scoped to Functions + Build
5. ✅ **No hardcoded keys**: All keys accessed via `process.env`

## Integration Flow

```
User clicks button
    ↓
Frontend (stripe.js)
    ↓
POST /.netlify/functions/create-checkout-session
    ↓
Netlify Function (create-checkout-session.js)
    ↓
Stripe API (with STRIPE_SECRET_KEY)
    ↓
Return session ID
    ↓
Redirect to Stripe Checkout
    ↓
Payment success → /donation-thank-you.html
Payment cancel → /blog.html
```

## Verification Commands

### Local Testing (Optional)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to project directory
cd /path/to/iwriteyouread

# ⚠️ SECURITY WARNING: Set environment variables in .env file (NEVER commit this!)
# Verify .env is in .gitignore before creating it
# Exposing these keys could lead to unauthorized charges on your Stripe account
grep -q "^\.env$" .gitignore || echo ".env" >> .gitignore

echo "STRIPE_SECRET_KEY=sk_test_your_key" > .env
echo "STRIPE_PUBLISHABLE_KEY=pk_test_your_key" >> .env

# Run Netlify dev server
netlify dev

# Test function
curl -X POST http://localhost:8888/.netlify/functions/create-checkout-session
```

## Support Resources

- **Netlify Functions**: https://docs.netlify.com/functions/overview/
- **Stripe Node.js**: https://stripe.com/docs/api/node
- **Environment Variables**: https://docs.netlify.com/environment-variables/overview/
- **Stripe API Keys**: https://dashboard.stripe.com/apikeys

## Status: ✅ Ready for Deployment

All code configuration is complete. The only remaining step is to configure the environment variables in the Netlify dashboard before deploying.
