// Blog JavaScript for iwriteyouread.org

let allPosts = [];
let currentFilter = 'all';

// Constants for image fallback URLs
const FALLBACK_IMAGE_URL = 'https://source.unsplash.com/featured/?writing,book,essay';
const PRIORITY_TAGS = ['Democracy', 'American Politics', 'Liberty', 'Justice'];

// Load blog posts from JSON
async function loadBlogPosts() {
    const loadingElement = document.getElementById('loading');
    const emptyStateElement = document.getElementById('empty-state');
    const blogPostsContainer = document.getElementById('blog-posts');
    
    try {
        const response = await fetch('/assets/blog/posts.json');
        
        if (!response.ok) {
            throw new Error('Failed to load blog posts');
        }
        
        const data = await response.json();
        allPosts = data.posts || [];
        
        // Hide loading
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Display posts
        if (allPosts.length > 0) {
            displayPosts(allPosts);
            if (emptyStateElement) {
                emptyStateElement.classList.add('hidden');
            }
        } else {
            if (emptyStateElement) {
                emptyStateElement.classList.remove('hidden');
            }
        }
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        
        // Hide loading
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        
        // Show empty state
        if (emptyStateElement) {
            emptyStateElement.classList.remove('hidden');
        }
    }
}

// Display blog posts
function displayPosts(posts) {
    const blogPostsContainer = document.getElementById('blog-posts');
    
    if (!blogPostsContainer) return;
    
    // Clear container
    blogPostsContainer.innerHTML = '';
    
    // Create post elements
    posts.forEach(post => {
        const postElement = createPostElement(post);
        blogPostsContainer.appendChild(postElement);
    });
}

// Create a single blog post element
function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-post bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all';
    article.dataset.tags = JSON.stringify(post.tags || []);
    
    // Create post link wrapper
    const postLink = document.createElement('a');
    postLink.href = post.url || '#';
    postLink.className = 'block';
    
    // BLOG IMAGE DYNAMIC FETCH (UNSPLASH)
    // Goal: Dynamically load free blog post images from Unsplash based on post tags
    // 1. Get the first tag for the blog post, or use a fallback like "writing"
    // 2. Generate Unsplash image URL for that tag with proper encoding
    // 3. Use this imageUrl in blog card with lazy loading
    
    // Post image - use Unsplash if no image provided
    let imageUrl = post.image;
    
    // If no image provided, generate Unsplash URL from first tag
    if (!imageUrl && post.tags && post.tags.length > 0) {
        // Try to use a priority tag if available, otherwise use first tag
        let selectedTag = post.tags[0];
        
        for (const tag of post.tags) {
            if (PRIORITY_TAGS.includes(tag)) {
                selectedTag = tag;
                break;
            }
        }
        
        // Trim and check if tag is not empty
        const trimmedTag = selectedTag.toLowerCase().trim();
        if (trimmedTag) {
            // Properly encode the tag for URL safety
            const tag = encodeURIComponent(trimmedTag);
            imageUrl = `https://source.unsplash.com/featured/?${tag}`;
        }
    }
    
    // If still no image, fallback to a soft writing-themed image
    if (!imageUrl) {
        imageUrl = FALLBACK_IMAGE_URL;
    }
    
    if (imageUrl) {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'relative h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = post.title;
        img.className = 'w-full h-full object-cover transition-transform duration-300 elegant-image';
        img.loading = 'lazy';
        
        // Add error handler to fallback to writing-themed image if primary fails
        img.onerror = function() {
            // Prevent infinite recursion by checking if we've already tried fallback
            if (this.dataset.fallbackAttempted) {
                console.error('Fallback image also failed, showing placeholder');
                // If even the fallback fails, show a nice placeholder
                const parent = this.parentElement;
                if (parent) {
                    // Remove the failed image element
                    parent.replaceChildren();
                    parent.className = 'relative h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center';
                    
                    const placeholderIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    placeholderIcon.setAttribute('class', 'w-24 h-24 text-blue-700');
                    placeholderIcon.setAttribute('fill', 'none');
                    placeholderIcon.setAttribute('stroke', 'currentColor');
                    placeholderIcon.setAttribute('viewBox', '0 0 24 24');
                    
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('stroke-linecap', 'round');
                    path.setAttribute('stroke-linejoin', 'round');
                    path.setAttribute('stroke-width', '2');
                    path.setAttribute('d', 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z');
                    
                    placeholderIcon.appendChild(path);
                    parent.appendChild(placeholderIcon);
                }
            } else {
                console.log('Primary Unsplash image failed, falling back to writing-themed image');
                this.dataset.fallbackAttempted = 'true';
                this.src = FALLBACK_IMAGE_URL;
            }
        };
        
        imageDiv.appendChild(img);
        postLink.appendChild(imageDiv);
    }
    
    article.appendChild(postLink);
    
    // Post content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'p-8';
    
    // Tags
    if (post.tags && post.tags.length > 0) {
        const tagsDiv = document.createElement('div');
        tagsDiv.className = 'flex flex-wrap gap-2 mb-4';
        
        post.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full';
            tagSpan.textContent = tag;
            tagsDiv.appendChild(tagSpan);
        });
        
        contentDiv.appendChild(tagsDiv);
    }
    
    // Title
    const titleLink = document.createElement('a');
    titleLink.href = post.url || '#';
    titleLink.className = 'block';
    
    const title = document.createElement('h2');
    title.className = 'font-serif text-2xl sm:text-3xl font-bold text-gray-900 mb-3 hover:text-blue-700 transition-colors';
    title.textContent = post.title;
    
    titleLink.appendChild(title);
    contentDiv.appendChild(titleLink);
    
    // Date
    if (post.date) {
        const date = document.createElement('p');
        date.className = 'text-sm text-gray-500 mb-4';
        date.textContent = formatDate(post.date);
        contentDiv.appendChild(date);
    }
    
    // Summary
    const summary = document.createElement('p');
    summary.className = 'text-gray-700 leading-relaxed mb-6';
    summary.textContent = post.summary;
    contentDiv.appendChild(summary);
    
    // Read more link
    const readMoreLink = document.createElement('a');
    readMoreLink.href = post.url || '#';
    readMoreLink.className = 'inline-flex items-center text-blue-700 font-semibold hover:text-blue-900 transition-colors';
    readMoreLink.innerHTML = `
        Read Full Essay
        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
    `;
    
    contentDiv.appendChild(readMoreLink);
    article.appendChild(contentDiv);
    
    return article;
}

// Filter posts by tag
function filterPosts(tag) {
    currentFilter = tag;
    
    // Update active filter button
    const filterButtons = document.querySelectorAll('.tag-filter');
    filterButtons.forEach(button => {
        if (button.dataset.tag === tag) {
            button.classList.add('active');
            button.classList.remove('bg-white', 'text-gray-700', 'border-gray-300');
            button.classList.add('bg-blue-700', 'text-white');
        } else {
            button.classList.remove('active');
            button.classList.remove('bg-blue-700', 'text-white');
            button.classList.add('bg-white', 'text-gray-700', 'border-gray-300');
        }
    });
    
    // Filter and display posts
    let filteredPosts = allPosts;
    
    if (tag !== 'all') {
        filteredPosts = allPosts.filter(post => {
            return post.tags && post.tags.includes(tag);
        });
    }
    
    displayPosts(filteredPosts);
    
    // Show/hide empty state
    const emptyStateElement = document.getElementById('empty-state');
    if (filteredPosts.length === 0 && emptyStateElement) {
        emptyStateElement.classList.remove('hidden');
    } else if (emptyStateElement) {
        emptyStateElement.classList.add('hidden');
    }
}

// Set up filter buttons
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.tag-filter');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tag = this.dataset.tag;
            filterPosts(tag);
        });
    });
    
    // Load blog posts
    loadBlogPosts();
});

// Format date utility (already in main.js but included here for modularity)
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}
