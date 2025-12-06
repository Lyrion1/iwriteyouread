// Stripe Checkout Integration
// Handles "Buy Me a Coffee" button click and initiates Stripe Checkout

// Load Stripe.js library
const stripeScript = document.createElement('script');
stripeScript.src = 'https://js.stripe.com/v3/';
stripeScript.async = true;
document.head.appendChild(stripeScript);

// Wait for Stripe to load and initialize
stripeScript.onload = function() {
  // Check if STRIPE_PUBLISHABLE_KEY is defined (from env.js)
  if (typeof STRIPE_PUBLISHABLE_KEY === 'undefined' || !STRIPE_PUBLISHABLE_KEY) {
    console.error('STRIPE_PUBLISHABLE_KEY is not defined. Please set it in Netlify environment variables.');
    return;
  }

  // Initialize Stripe with publishable key
  const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

  // Get the support button
  const supportButton = document.getElementById('support-button');
  
  if (supportButton) {
    // Enable the button and remove disabled styling
    supportButton.style.pointerEvents = 'auto';
    supportButton.style.opacity = '1';
    supportButton.style.cursor = 'pointer';
    
    // Add click handler
    supportButton.addEventListener('click', async function(e) {
      e.preventDefault();
      
      // Disable button during processing
      supportButton.style.pointerEvents = 'none';
      supportButton.style.opacity = '0.6';
      supportButton.innerHTML = '☕ Processing...';
      
      try {
        // Call Netlify Function to create checkout session
        const response = await fetch('/.netlify/functions/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { sessionId } = await response.json();

        // Redirect to Stripe Checkout
        const result = await stripe.redirectToCheckout({
          sessionId: sessionId,
        });

        if (result.error) {
          throw new Error(result.error.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Sorry, there was an error processing your donation. Please try again.');
        
        // Re-enable button
        supportButton.style.pointerEvents = 'auto';
        supportButton.style.opacity = '1';
        supportButton.innerHTML = '☕ Buy Me a Coffee';
      }
    });
  }
};
