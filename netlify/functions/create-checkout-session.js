// Netlify Function to create Stripe Checkout Session
// This function creates a Stripe Checkout session for a custom donation amount

exports.handler = async (event, context) => {
  // CORS headers for all responses
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle CORS preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Validate and initialize Stripe with the secret key
  const secretKey = process.env.STRIPE_SECRET_KEY;

  // Validate that the secret key exists
  if (!secretKey) {
    console.error('STRIPE_SECRET_KEY environment variable is not set');
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Server configuration error. Please contact the administrator.' 
      }),
    };
  }

  // Validate that the secret key has the correct format and detect mode
  const isLiveMode = secretKey.startsWith('sk_live_');
  const isTestMode = secretKey.startsWith('sk_test_');

  if (!isLiveMode && !isTestMode) {
    console.error('STRIPE_SECRET_KEY has invalid format - must start with sk_test_ or sk_live_');
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Server configuration error. Please contact the administrator.' 
      }),
    };
  }

  // Log the mode (without exposing the key)
  console.log(`Stripe initialized in ${isLiveMode ? 'LIVE' : 'TEST'} mode`);

  // Initialize Stripe with the validated secret key
  const stripe = require('stripe')(secretKey);

  // Get the origin for redirect URLs
  // Use origin header if available, otherwise extract origin from referer, fallback to production URL
  let baseUrl = event.headers.origin;
  if (!baseUrl && event.headers.referer) {
    try {
      const refererUrl = new URL(event.headers.referer);
      baseUrl = refererUrl.origin;
    } catch (e) {
      baseUrl = 'https://iwriteyouread.org';
    }
  }
  if (!baseUrl) {
    baseUrl = 'https://iwriteyouread.org';
  }

  // Log request (without sensitive data)
  console.log('Checkout session request received');
  console.log('Base URL:', baseUrl);

  try {
    // Parse the request body to get the custom amount
    let amount;
    try {
      const body = JSON.parse(event.body);
      amount = body.amount;
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid request body' }),
      };
    }
    
    // Validate the amount
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 1) {
      console.log('Invalid amount received:', amount);
      return {
        statusCode: 400,
        headers: corsHeaders,
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
            unit_amount: Math.round(amount * 100), // Convert £ to pence
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/thank-you`,
      cancel_url: `${baseUrl}/blog.html`,
    });

    console.log('Checkout session created successfully:', session.id);
    // Only log session URL in test mode for security
    if (isTestMode) {
      console.log('Session URL (test mode):', session.url);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
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
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: errorMessage,
        // Only include details in test mode for debugging
        ...(isTestMode && { details: error.message })
      }),
    };
  }
};
