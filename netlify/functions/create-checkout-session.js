// Netlify Function to create Stripe Checkout Session
// This function creates a Stripe Checkout session for a custom donation amount

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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
    if (!amount || amount < 1) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid amount. Minimum donation is £1.' }),
      };
    }
    
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
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};
