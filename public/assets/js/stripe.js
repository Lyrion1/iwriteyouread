// Stripe Checkout Integration
// Handles "Buy Me a Coffee" button click and initiates Stripe Checkout for £5

// Get the buy coffee button
const buyCoffeeButton = document.getElementById('buy-coffee-button');

if (buyCoffeeButton) {
  // Add click handler
  buyCoffeeButton.addEventListener('click', async function(e) {
    e.preventDefault();
    
    // Fixed amount of £5
    const amount = 5;
    
    // Disable button during processing
    const originalButtonText = buyCoffeeButton.innerHTML;
    buyCoffeeButton.disabled = true;
    buyCoffeeButton.innerHTML = '☕ Processing...';
    
    try {
      // Call Netlify Function to create checkout session
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create checkout session';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          // If response is not JSON, use default error message
          console.error('Error parsing error response:', jsonError);
        }
        throw new Error(errorMessage);
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      
      // Show error to user
      buyCoffeeButton.innerHTML = 'Error - Retry';
      buyCoffeeButton.setAttribute('aria-label', 'Error occurred, please try again');
      
      // Reset after 3 seconds
      setTimeout(() => {
        buyCoffeeButton.disabled = false;
        buyCoffeeButton.innerHTML = originalButtonText;
        buyCoffeeButton.removeAttribute('aria-label');
      }, 3000);
    }
  });
}
