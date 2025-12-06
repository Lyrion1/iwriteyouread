// Main JavaScript for iwriteyouread.org

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            menuIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnButton = mobileMenuButton.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnButton) {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        }
    });
});

// Newsletter Modal Functions
function openNewsletterModal() {
    const modal = document.getElementById('newsletter-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        // Store modal shown state in localStorage
        localStorage.setItem('newsletterModalShown', 'true');
    }
}

function closeNewsletterModal() {
    const modal = document.getElementById('newsletter-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    }
}

// Show newsletter modal on first visit after 5 seconds (only on homepage)
document.addEventListener('DOMContentLoaded', function() {
    const isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html';
    const modalShown = localStorage.getItem('newsletterModalShown');
    
    if (isHomepage && !modalShown) {
        setTimeout(function() {
            openNewsletterModal();
        }, 5000); // Show after 5 seconds
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('newsletter-modal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeNewsletterModal();
            }
        });
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('shadow-md');
        navbar.classList.add('shadow-sm');
    } else {
        navbar.classList.remove('shadow-sm');
        navbar.classList.add('shadow-md');
    }
    
    lastScroll = currentScroll;
});

// Book Page: Toggle Excerpt
function toggleExcerpt() {
    const excerptContent = document.getElementById('excerpt-content');
    const excerptIcon = document.getElementById('excerpt-icon');
    
    if (excerptContent && excerptIcon) {
        excerptContent.classList.toggle('hidden');
        excerptIcon.classList.toggle('rotate');
    }
}

// Contact Form Handler
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formMessage = document.getElementById('form-message');
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission (replace with actual endpoint)
    setTimeout(function() {
        // Show success message
        formMessage.className = 'p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg';
        formMessage.textContent = 'Thank you for your message! I\'ll get back to you soon.';
        formMessage.classList.remove('hidden');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        
        // Hide message after 5 seconds
        setTimeout(function() {
            formMessage.classList.add('hidden');
        }, 5000);
    }, 1000);
    
    // In production, replace the above with actual form submission:
    /*
    fetch('YOUR_FORM_ENDPOINT', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        formMessage.className = 'p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg';
        formMessage.textContent = 'Thank you for your message! I\'ll get back to you soon.';
        formMessage.classList.remove('hidden');
        form.reset();
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    })
    .catch(error => {
        formMessage.className = 'p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg';
        formMessage.textContent = 'Oops! Something went wrong. Please try again or email directly.';
        formMessage.classList.remove('hidden');
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    });
    */
}

// Keyboard Navigation for Modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('newsletter-modal');
        if (modal && !modal.classList.contains('hidden')) {
            closeNewsletterModal();
        }
    }
});

// Add animation on scroll for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all blog posts and cards
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.blog-post, .card-hover');
    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
});

// Lazy Loading for Images
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// Utility: Format Date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Utility: Truncate Text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

// Utility: Create Tag Element
function createTagElement(tag) {
    const tagElement = document.createElement('span');
    tagElement.className = 'inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full';
    tagElement.textContent = tag;
    return tagElement;
}

// Handle External Links
document.addEventListener('DOMContentLoaded', function() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});

// Console message for developers
console.log('%c👋 Welcome to iwriteyouread.org', 'font-size: 16px; font-weight: bold; color: #1d4ed8;');
console.log('%cInterested in the technical details? View the source code.', 'font-size: 12px; color: #666;');

// Support Button Handler
document.addEventListener('DOMContentLoaded', function() {
    const supportButton = document.getElementById('support-button');
    if (supportButton) {
        // In production, this will be injected by Netlify at build time
        const stripeCheckoutUrl = typeof STRIPE_CHECKOUT_URL !== 'undefined' 
            ? STRIPE_CHECKOUT_URL 
            : 'https://your-real-stripe-link.com';
        supportButton.href = stripeCheckoutUrl;
    }
});
