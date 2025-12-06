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
      // Show validation error visually
      amountInput.style.borderColor = '#ef4444';
      amountInput.focus();
      
      // Reset border color after 3 seconds
      setTimeout(() => {
        amountInput.style.borderColor = '#ddd';
      }, 3000);
      
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
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      
      // Show error to user
      amountInput.style.borderColor = '#ef4444';
      submitButton.innerHTML = '❌ Error';
      
      // Reset after 3 seconds
      setTimeout(() => {
        amountInput.style.borderColor = '#ddd';
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }, 3000);
    }
  });
}
