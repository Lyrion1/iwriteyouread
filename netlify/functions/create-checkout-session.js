// Netlify Function to create Stripe Checkout Session
// This function creates a Stripe Checkout session for a custom donation amount

// Validate and initialize Stripe with the secret key
const secretKey = process.env.STRIPE_SECRET_KEY;

// Validate that the secret key exists
if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set. Please configure it in Netlify settings.');
}

// Validate that the secret key has the correct format
if (!secretKey.startsWith('sk_')) {
  throw new Error('STRIPE_SECRET_KEY has an invalid format. It should start with "sk_test_" or "sk_live_".');
}

// Detect if using test or live mode
const isLiveMode = secretKey.startsWith('sk_live_');
const isTestMode = secretKey.startsWith('sk_test_');

if (!isLiveMode && !isTestMode) {
  throw new Error('STRIPE_SECRET_KEY must be either a test key (sk_test_) or live key (sk_live_).');
}

// Log the mode (without exposing the key)
console.log(`Stripe initialized in ${isLiveMode ? 'LIVE' : 'TEST'} mode`);

// Initialize Stripe with the validated secret key
const stripe = require('stripe')(secretKey);

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Get the origin for redirect URLs
  const origin = event.headers.origin || event.headers.referer || 'https://iwriteyouread.org';
  const baseUrl = origin.replace(/\/$/, ''); // Remove trailing slash if present

  // Log request (without sensitive data)
  console.log('Checkout session request received');
  console.log('Origin:', origin);

  try {
    // Parse the request body to get the custom amount
    let amount;
    try {
      const body = JSON.parse(event.body);
      amount = body.amount;
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid request body' }),
      };
    }
    
    // Validate the amount
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 1) {
      console.log('Invalid amount received:', amount);
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid amount. Minimum donation is £1.' }),
      };
    }
    
    console.log('Creating checkout session for amount:', amount, 'GBP');
    
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Buy Me a Coffee',
              description: 'Support Alexander Afolabi\'s writing and essays',
            },
            unit_amount: Math.round(parseFloat((amount * 100).toFixed(2))), // Convert £ to pence with proper rounding
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/thank-you`,
      cancel_url: `${baseUrl}/blog.html`,
    });

    console.log('Checkout session created successfully:', session.id);
    console.log('Session URL:', session.url);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Provide more specific error messages
    let errorMessage = 'An error occurred while creating the checkout session.';
    let statusCode = 500;
    
    // Check for Stripe-specific errors
    if (error.type === 'StripeAuthenticationError') {
      errorMessage = 'Stripe authentication failed. The API key may be invalid or missing.';
      console.error('Stripe authentication error - check STRIPE_SECRET_KEY configuration');
    } else if (error.type === 'StripeAPIError') {
      errorMessage = 'Stripe API error occurred. Please try again later.';
      console.error('Stripe API error:', error.message);
    } else if (error.type === 'StripeConnectionError') {
      errorMessage = 'Could not connect to Stripe. Please check your internet connection.';
      console.error('Stripe connection error:', error.message);
    } else if (error.type === 'StripeInvalidRequestError') {
      errorMessage = 'Invalid request to Stripe API.';
      statusCode = 400;
      console.error('Stripe invalid request error:', error.message);
    } else {
      // For other errors, use the error message if available
      errorMessage = error.message || errorMessage;
    }
    
    return {
      statusCode: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: errorMessage,
        // Only include details in test mode for debugging
        ...(isTestMode && { details: error.message })
      }),
    };
  }
};
