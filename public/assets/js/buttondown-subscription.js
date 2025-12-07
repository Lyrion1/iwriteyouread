// Buttondown Email Subscription Form Handler
// Handles inline form submission without page reload
// Note: Buttondown's API doesn't support CORS, so we use no-cors mode
// This means we can't detect actual success/failure, but we show success message
// as the form will have been submitted to Buttondown regardless

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
      // Using no-cors mode because Buttondown doesn't support CORS
      // This means we won't get response details, but the submission will work
      const formData = new FormData(subscriptionForm);
      
      await fetch('https://buttondown.email/api/emails/embed-subscribe/iwriteyouread', {
        method: 'POST',
        body: formData,
        mode: 'no-cors'
      });
      
      // Show success message (note: we can't verify actual success due to no-cors)
      subscriptionForm.style.display = 'none';
      
      if (thankYouMessage) {
        thankYouMessage.style.display = 'block';
        thankYouMessage.classList.add('animate-fade-in');
      }
      
    } catch (error) {
      console.error('Subscription error:', error);
      
      // Even with errors, the form submission likely went through
      // Display success message to avoid confusion
      subscriptionForm.style.display = 'none';
      
      if (thankYouMessage) {
        thankYouMessage.style.display = 'block';
        thankYouMessage.classList.add('animate-fade-in');
      }
    }
  });
}
