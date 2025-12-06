// Stripe Checkout Integration
// Handles "Buy Me a Coffee" form submission and initiates Stripe Checkout

// Get the donation form
const donationForm = document.getElementById('donation-form');

if (donationForm) {
  // Add submit handler
  donationForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get the amount from the input
    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value);
    
    // Validate the amount
    if (!amount || amount < 1) {
      alert('Please enter a valid amount (minimum £1)');
      return;
    }
    
    // Get the submit button and disable it during processing
    const submitButton = donationForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '☕ Processing...';
    
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
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      alert('Sorry, there was an error processing your donation. Please try again.');
      
      // Re-enable button
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
}
