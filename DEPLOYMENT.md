# Deployment Guide for iwriteyouread.org

This guide will help you deploy the iwriteyouread.org website to Netlify and configure all necessary services.

## 📋 Pre-Deployment Checklist

### 1. Create Necessary Accounts

Before deploying, sign up for these free services:

- ✅ **GitHub Account** (you already have this)
- ⬜ **Netlify Account** - https://netlify.com (sign up with GitHub)
- ⬜ **Buttondown Account** - https://buttondown.email (for newsletter)
- ⬜ **Gumroad Account** - https://gumroad.com (for book sales)

### 2. Prepare Assets

Create and add these files before deploying:

- ⬜ **favicon.ico** - 32x32px icon for browser tabs
- ⬜ **og-image.jpg** - 1200x630px social media preview image
- ⬜ **author-photo.jpg** - High-quality author photo for About page
- ⬜ **book-cover.jpg** - Book cover image for Book page
- ⬜ **blog-post-images** - Featured images for blog posts (optional)

**Tip:** Use free tools like Canva, Figma, or GIMP to create these assets.

## 🚀 Deployment Steps

### Step 1: Deploy to Netlify

1. **Push Code to GitHub** (already done)
   ```bash
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub" and authorize Netlify
   - Select the `iwriteyouread` repository

3. **Configure Build Settings**
   - **Build command:** Leave empty (static site)
   - **Publish directory:** `public`
   - Click "Deploy site"

4. **Configure Custom Domain**
   - Go to Site Settings → Domain Management
   - Click "Add custom domain"
   - Enter: `iwriteyouread.org`
   - Follow DNS configuration instructions from your domain registrar

5. **Enable HTTPS**
   - Netlify automatically provisions SSL certificates
   - Wait a few minutes for it to be active

### Step 2: Configure Newsletter (Buttondown)

1. **Create Buttondown Account**
   - Sign up at https://buttondown.email
   - Choose your username (e.g., `iwriteyouread`)

2. **Update Newsletter Forms**
   - Open these files and replace the form action URL:
     - `public/index.html` (line ~250)
     - `public/contact.html` (line ~150)
   
   Replace:
   ```html
   action="https://buttondown.email/api/emails/embed-subscribe/iwriteyouread"
   ```
   With:
   ```html
   action="https://buttondown.email/api/emails/embed-subscribe/YOUR-USERNAME"
   ```

3. **Customize Email Settings**
   - In Buttondown dashboard, customize:
     - Welcome email
     - Email template design
     - Sender name and reply-to address

### Step 3: Configure Book Sales (Gumroad)

1. **Create Gumroad Account**
   - Sign up at https://gumroad.com
   - Complete your profile and payment setup

2. **Create Products**
   - Create two products:
     - "The Spirit of America - Hardcover"
     - "The Spirit of America - eBook"
   - Set prices, descriptions, and upload book files
   - Get product links

3. **Update Book Page**
   - Open `public/book.html`
   - Find the Gumroad button links (around line ~150 and ~157)
   
   Replace:
   ```html
   href="https://iwriteyouread.gumroad.com/l/spirit-of-america-hardcover"
   ```
   With your actual product URLs:
   ```html
   href="https://YOUR-USERNAME.gumroad.com/l/YOUR-PRODUCT-ID"
   ```

### Step 4: Update Social Media Links

Update all social media handles in these files:

**Files to update:**
- `public/index.html` (footer section)
- `public/about.html` (footer section)
- `public/book.html` (footer section)
- `public/blog.html` (footer section)
- `public/contact.html` (footer and social section)

**Find and replace:**
```html
<!-- Current placeholders -->
https://twitter.com/iwriteyouread
https://threads.net/@iwriteyouread
https://instagram.com/iwriteyouread
https://youtube.com/@iwriteyouread
```

With your actual social media URLs.

### Step 5: Add Analytics (Optional but Recommended)

#### Option A: Google Analytics

1. Create Google Analytics account
2. Get your tracking ID (e.g., `G-XXXXXXXXXX`)
3. Add this code before `</head>` in all HTML files:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

#### Option B: Plausible Analytics (Privacy-Friendly)

1. Sign up at https://plausible.io
2. Add your domain
3. Add this code before `</head>` in all HTML files:

```html
<script defer data-domain="iwriteyouread.org" src="https://plausible.io/js/script.js"></script>
```

### Step 6: Submit to Search Engines

1. **Google Search Console**
   - Go to https://search.google.com/search-console
   - Add your domain
   - Verify ownership (DNS or file upload)
   - Submit sitemap: `https://iwriteyouread.org/sitemap.xml`

2. **Bing Webmaster Tools**
   - Go to https://www.bing.com/webmasters
   - Add and verify your site
   - Submit sitemap

## 🔧 Post-Deployment Configuration

### Update Open Graph Images

Once your images are ready:

1. Upload images to `/public/assets/images/`
2. Update meta tags in all HTML files:

```html
<meta property="og:image" content="https://iwriteyouread.org/assets/images/og-image.jpg">
<meta name="twitter:image" content="https://iwriteyouread.org/assets/images/og-image.jpg">
```

### Test Everything

After deployment, test these features:

- ✅ All pages load correctly
- ✅ Navigation works (including mobile menu)
- ✅ Newsletter signup forms work
- ✅ Gumroad book purchase buttons work
- ✅ Blog posts display correctly
- ✅ Tag filtering works on blog page
- ✅ Contact form submission (if configured)
- ✅ Social media links go to correct profiles
- ✅ Favicon displays in browser tab
- ✅ Mobile responsiveness
- ✅ Social media preview cards (share on Twitter/Facebook)

### Performance Optimization

1. **Compress Images**
   - Use TinyPNG or Squoosh to compress all images
   - Aim for under 100KB per image

2. **Enable Netlify Performance Features**
   - Go to Site Settings → Build & Deploy → Post Processing
   - Enable: Asset optimization, Bundle CSS, Minify JS

3. **Test Performance**
   - Use Google PageSpeed Insights
   - Use GTmetrix
   - Aim for 90+ scores

## 📝 Ongoing Maintenance

### Adding Blog Posts

1. Edit `/public/assets/blog/posts.json`
2. Add new post entry:
   ```json
   {
     "id": "new-post-slug",
     "title": "New Post Title",
     "date": "2025-01-20",
     "summary": "Post summary...",
     "image": "/assets/blog/images/post-image.jpg",
     "tags": ["Democracy"],
     "url": "/blog/new-post.html"
   }
   ```
3. Commit and push to GitHub
4. Netlify will auto-deploy

### Updating Content

- **Author bio:** Edit `/public/about.html`
- **Book description:** Edit `/public/book.html`
- **Homepage text:** Edit `/public/index.html`
- **Meta descriptions:** Update in each HTML file's `<head>`

## 🆘 Troubleshooting

### Site Not Updating After Push

- Check Netlify deploy log for errors
- Clear browser cache (Ctrl+Shift+R)
- Check that changes were pushed to correct branch

### Newsletter Signup Not Working

- Verify Buttondown URL is correct
- Check Buttondown dashboard for subscribers
- Test with different email address

### Gumroad Buttons Not Working

- Verify product URLs are correct
- Check that products are published in Gumroad
- Test in incognito mode

### Images Not Loading

- Check file paths are correct (case-sensitive)
- Verify images are in `/public/assets/images/`
- Check file extensions match HTML references

## 📞 Support Resources

- **Netlify Docs:** https://docs.netlify.com
- **Buttondown Docs:** https://docs.buttondown.email
- **Gumroad Help:** https://help.gumroad.com
- **TailwindCSS Docs:** https://tailwindcss.com/docs

## ✅ Final Checklist

Before announcing your site:

- ⬜ Custom domain configured and working
- ⬜ HTTPS enabled
- ⬜ All social media links updated
- ⬜ Newsletter integration working
- ⬜ Book purchase links working
- ⬜ All images uploaded and optimized
- ⬜ Analytics installed
- ⬜ Submitted to search engines
- ⬜ Tested on mobile devices
- ⬜ Tested on multiple browsers
- ⬜ SEO meta tags verified
- ⬜ Author photo and bio updated
- ⬜ Contact email configured

Congratulations! Your author website is now live! 🎉
