// Blog JavaScript for iwriteyouread.org

let allPosts = [];
let currentFilter = 'all';

// Category-to-image mapping for blog post thumbnails
// Maps post categories/tags to predefined thumbnail images
const CATEGORY_IMAGE_MAP = {
    'Immigration': '/images/immigration.svg',
    'UK Politics': '/images/uk-politics.svg',
    'Culture': '/images/culture.svg',
    'Liberty': '/images/liberty.svg',
    'Democracy': '/images/democracy.svg',
    'Justice': '/images/justice.svg',
    'American Politics': '/images/us-politics.svg'
};

// Default fallback image for posts without matching categories
const DEFAULT_IMAGE = '/images/default.svg';

// Priority tags for selecting the most relevant category image
const PRIORITY_TAGS = ['Democracy', 'American Politics', 'Liberty', 'Justice', 'Immigration', 'UK Politics', 'Culture'];

// Function to get image URL based on post tags
// Returns predefined category image or default fallback
function getImageForTag(tag) {
    // Validate tag parameter
    if (!tag || typeof tag !== 'string' || !tag.trim()) {
        return DEFAULT_IMAGE;
    }
    
    // Check if tag matches a category in our mapping
    const normalizedTag = tag.trim();
    if (CATEGORY_IMAGE_MAP[normalizedTag]) {
        return CATEGORY_IMAGE_MAP[normalizedTag];
    }
    
    // Return default if no match found
    return DEFAULT_IMAGE;
}

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
    
    // Refresh AOS to detect new elements (if AOS is loaded)
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Create a single blog post element
function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'blog-post bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all';
    article.dataset.tags = JSON.stringify(post.tags || []);
    
    // Add AOS fade-up animation
    article.setAttribute('data-aos', 'fade-up');
    
    // Create post link wrapper
    const postLink = document.createElement('a');
    postLink.href = post.url || '#';
    postLink.className = 'block';
    
    // BLOG IMAGE CATEGORY MAPPING
    // Goal: Use predefined category-based thumbnail images for blog posts
    // 1. Get the first matching tag from the post that has a category image
    // 2. Use that category's predefined thumbnail image
    // 3. Fallback to default image if no matching category
    
    // Post image - use category mapping
    let imageUrl = post.image;
    
    // If no image provided, select image based on post tags
    if (!imageUrl && post.tags && post.tags.length > 0) {
        // Try to use a priority tag if available, otherwise use first matching tag
        let selectedTag = null;
        
        // First, check for priority tags
        for (const tag of post.tags) {
            if (PRIORITY_TAGS.includes(tag) && CATEGORY_IMAGE_MAP[tag]) {
                selectedTag = tag;
                break;
            }
        }
        
        // If no priority tag found, use first tag that has a mapping
        if (!selectedTag) {
            for (const tag of post.tags) {
                if (CATEGORY_IMAGE_MAP[tag]) {
                    selectedTag = tag;
                    break;
                }
            }
        }
        
        // Use the getImageForTag function to get the mapped image
        imageUrl = selectedTag ? getImageForTag(selectedTag) : DEFAULT_IMAGE;
    }
    
    // If still no image, fallback to default
    if (!imageUrl) {
        imageUrl = DEFAULT_IMAGE;
    }
    
    if (imageUrl) {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'relative h-64 overflow-hidden bg-gradient-to-br from-blue-100 to-blue-200';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = post.title;
        img.className = 'w-full h-full object-cover transition-transform duration-300 elegant-image';
        img.loading = 'lazy';
        
        // Add error handler to fallback to default image if category image fails
        img.onerror = function() {
            // Prevent infinite recursion by checking if we've already tried fallback
            if (this.dataset.fallbackAttempted) {
                console.error('Default image also failed, showing placeholder');
                // If even the default fails, show a nice placeholder
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
                console.log('Category image failed, falling back to default image');
                this.dataset.fallbackAttempted = 'true';
                this.src = DEFAULT_IMAGE;
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
