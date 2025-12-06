// Stripe Checkout Integration
// Handles "Buy Me a Coffee" button click and initiates Stripe Checkout

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

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
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
