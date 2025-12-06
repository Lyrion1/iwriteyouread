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
    if (!Number.isFinite(amount) || amount < 1) {
      // Show validation error visually
      amountInput.classList.add('error');
      amountInput.focus();
      
      // Reset error state after 3 seconds
      setTimeout(() => {
        amountInput.classList.remove('error');
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
      amountInput.classList.add('error');
      submitButton.innerHTML = '❌ Error';
      
      // Reset after 3 seconds
      setTimeout(() => {
        amountInput.classList.remove('error');
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }, 3000);
    }
  });
}
