// Stripe Checkout Integration
// Handles "Buy Me a Coffee" form submission and initiates Stripe Checkout with custom amount

// Get the donation form
const donationForm = document.getElementById('donation-form');
const donationAmountInput = document.getElementById('donation-amount');

if (donationForm && donationAmountInput) {
  // Add submit handler
  donationForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get the custom amount from input
    const amountValue = donationAmountInput.value.trim();
    const amount = parseFloat(amountValue);
    
    // Validate the amount
    if (!amountValue || !Number.isFinite(amount) || amount < 1) {
      // Show error state on input
      donationAmountInput.classList.add('error');
      console.error('Invalid amount entered:', amountValue);
      
      // Remove error state after 3 seconds
      setTimeout(() => {
        donationAmountInput.classList.remove('error');
      }, 3000);
      return;
    }
    
    // Remove any error state
    donationAmountInput.classList.remove('error');
    
    // Get the submit button
    const submitButton = donationForm.querySelector('button[type="submit"]');
    if (!submitButton) return;
    
    // Disable form during processing
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    donationAmountInput.disabled = true;
    submitButton.innerHTML = 'Processing...';
    
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
      submitButton.innerHTML = 'Error - Retry';
      submitButton.setAttribute('aria-label', 'Error occurred, please try again');
      donationAmountInput.classList.add('error');
      
      // Reset after 3 seconds
      setTimeout(() => {
        submitButton.disabled = false;
        donationAmountInput.disabled = false;
        submitButton.innerHTML = originalButtonText;
        submitButton.removeAttribute('aria-label');
        donationAmountInput.classList.remove('error');
      }, 3000);
    }
  });
}
