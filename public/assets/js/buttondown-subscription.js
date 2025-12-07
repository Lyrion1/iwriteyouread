// Buttondown Email Subscription Form Handler
// Handles inline form submission without page reload

const subscriptionForm = document.getElementById('buttondown-subscription-form');

if (subscriptionForm) {
  subscriptionForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form elements
    const emailInput = subscriptionForm.querySelector('input[name="email"]');
    const submitButton = subscriptionForm.querySelector('button[type="submit"]');
    const thankYouMessage = document.getElementById('thank-you-message');
    
    // Get the email value
    const email = emailInput.value.trim();
    
    // Validate email
    if (!email) {
      emailInput.focus();
      return;
    }
    
    // Disable button during submission
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Subscribing...';
    
    try {
      // Submit to Buttondown
      const formData = new FormData(subscriptionForm);
      
      const response = await fetch('https://buttondown.email/api/emails/embed-subscribe/iwriteyouread', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Buttondown doesn't support CORS, so we use no-cors mode
      });
      
      // Since we're using no-cors, we won't get a readable response
      // But if we reach here without error, we assume success
      
      // Hide the form
      subscriptionForm.style.display = 'none';
      
      // Show thank you message with fade-in
      if (thankYouMessage) {
        thankYouMessage.style.display = 'block';
        thankYouMessage.classList.add('animate-fade-in');
      }
      
    } catch (error) {
      console.error('Subscription error:', error);
      
      // Reset button on error
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
      
      // Show error message
      alert('There was an error processing your subscription. Please try again.');
    }
  });
}
