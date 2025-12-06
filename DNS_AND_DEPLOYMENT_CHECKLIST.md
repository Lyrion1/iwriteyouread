# DNS and Deployment Checklist for iwriteread.org

This document provides a step-by-step checklist for deploying the iwriteyouread website with custom domain configuration, environment variables, and all necessary integrations.

## ✅ DNS Configuration

### Step 1: Configure Domain in Netlify

- [ ] Log in to Netlify dashboard
- [ ] Navigate to: **Site Settings > Domain Management**
- [ ] Click **"Add Domain"** button
- [ ] Enter your custom domain: `iwriteread.org`
- [ ] Click **"Verify"**

### Step 2: Update DNS Settings at Domain Registrar

Update your domain registrar (e.g., GoDaddy, Namecheap, Google Domains) with these DNS records:

#### A Record (Root Domain)
```
Type: A
Name: @ (or leave blank for root domain)
Value: 75.2.60.5
TTL: 3600 (or Auto)
```

#### CNAME Record (www subdomain)
```
Type: CNAME
Name: www
Value: yoursite.netlify.app (replace with your actual Netlify subdomain)
TTL: 3600 (or Auto)
```

### Step 3: Wait for DNS Propagation

- [ ] Wait 1-48 hours for DNS propagation (usually 1-2 hours)
- [ ] Check DNS propagation at: https://dnschecker.org
- [ ] Verify domain points to Netlify

### Step 4: Enable HTTPS

- [ ] Netlify automatically provisions SSL certificate
- [ ] Wait 5-10 minutes for certificate activation
- [ ] Verify HTTPS works: `https://iwriteread.org`
- [ ] Enable "Force HTTPS" in Netlify domain settings

---

## 🔐 Environment Variables Configuration

### Stripe Integration (Buy Me a Coffee Button)

#### Step 1: Create Stripe Account
- [ ] Sign up at https://stripe.com
- [ ] Complete account verification
- [ ] Navigate to Dashboard > Developers > API keys

#### Step 2: Create Payment Link
- [ ] Go to Stripe Dashboard > Payment Links
- [ ] Create new payment link for donations
- [ ] Set donation amount or allow custom amounts
- [ ] Copy the payment link URL

#### Step 3: Add Environment Variables in Netlify
- [ ] Go to Netlify > Site Settings > Environment Variables
- [ ] Click "Add Variable"

Add these variables:
```
STRIPE_PUBLIC_KEY = pk_live_... (your publishable key)
STRIPE_SECRET_KEY = sk_live_... (your secret key - NEVER commit to Git!)
STRIPE_CHECKOUT_URL = https://buy.stripe.com/... (your payment link)
```

#### Step 4: Update Support Button
The "Buy Me a Coffee" button on `/blog.html` will automatically use the environment variables once configured.

---

## 📧 Email Configuration

### Option 1: Zoho Mail (Free)

- [ ] Sign up at https://www.zoho.com/mail
- [ ] Add custom domain: `iwriteread.org`
- [ ] Create email: `hello@iwriteread.org`
- [ ] Update MX records in domain registrar
- [ ] Test sending/receiving emails

### Option 2: Google Workspace (Paid)

- [ ] Sign up at https://workspace.google.com
- [ ] Add domain and verify ownership
- [ ] Create email: `hello@iwriteread.org`
- [ ] Update MX records
- [ ] Test email functionality

---

## 📊 SEO & Analytics Setup

### Google Search Console

- [ ] Go to https://search.google.com/search-console
- [ ] Add property: `iwriteread.org`
- [ ] Verify ownership (DNS TXT record or file upload)
- [ ] Submit sitemap: `https://iwriteread.org/sitemap.xml`
- [ ] Monitor indexing status

### Google Analytics (Optional)

- [ ] Create account at https://analytics.google.com
- [ ] Get tracking ID (G-XXXXXXXXXX)
- [ ] Add tracking code to all HTML pages (before `</head>`)
- [ ] Verify data collection

### Bing Webmaster Tools

- [ ] Go to https://www.bing.com/webmasters
- [ ] Add and verify site
- [ ] Submit sitemap
- [ ] Monitor indexing

---

## 💰 Monetization Setup

### Newsletter Integration (Buttondown)

- [ ] Sign up at https://buttondown.email
- [ ] Configure newsletter settings
- [ ] Update newsletter form action URLs in HTML files
- [ ] Test subscription flow
- [ ] Customize welcome email

### Amazon Affiliate Links (Already Configured)

The Works page already has Amazon UK links configured:
- Paperback: https://www.amazon.co.uk/dp/B0G58J7DF5
- Kindle: https://www.amazon.co.uk/dp/B0G4XPKX4K

To monetize:
- [ ] Join Amazon Associates program
- [ ] Replace with affiliate links
- [ ] Add required disclosure

### Additional Monetization Options

Consider implementing:

- [ ] **Patreon/Substack**: Create page for ongoing support
- [ ] **Google AdSense**: Add to blog pages for passive income
- [ ] **EthicalAds**: Privacy-friendly alternative to AdSense
- [ ] **Paywalled Content**: Create premium "Deep Dives" section
- [ ] **Medium Partner Program**: Crosspost essays for additional income
- [ ] **Affiliate Links**: Bookshop.org, other book retailers

---

## 🧪 Testing Checklist

### Functionality Tests

- [ ] All pages load correctly on desktop
- [ ] All pages load correctly on mobile
- [ ] Navigation menu works (desktop and mobile)
- [ ] "Buy Me a Coffee" button only appears on `/blog` page
- [ ] Newsletter signup works
- [ ] Amazon book purchase links work
- [ ] Social media links work
- [ ] Blog tag filtering works
- [ ] Blog post images load (Unsplash integration)

### Visual Tests

- [ ] Homepage displays new poetic intro correctly
- [ ] Works page: "What Readers Say" appears below all works
- [ ] About page displays logo image
- [ ] Logo appears in navigation on all pages
- [ ] Favicon displays in browser tab
- [ ] Images are optimized and load quickly

### SEO Tests

- [ ] Meta tags present on all pages
- [ ] Open Graph images load correctly
- [ ] Twitter Card preview works
- [ ] Test social sharing (Facebook, Twitter, LinkedIn)
- [ ] Sitemap accessible: `/sitemap.xml`
- [ ] Robots.txt accessible: `/robots.txt`

### Performance Tests

- [ ] Google PageSpeed Insights score > 90
- [ ] Mobile performance acceptable
- [ ] Images are compressed and optimized
- [ ] No console errors in browser developer tools

---

## 📱 Social Media Setup

### Create Accounts

- [ ] Twitter/X: @iwriteyouread
- [ ] Instagram: @iwriteyouread
- [ ] Threads: @iwriteyouread
- [ ] YouTube: @iwriteyouread
- [ ] LinkedIn: Create professional page

### Profile Setup

- [ ] Use logo (/assets/logoo.png) for all profile pictures
- [ ] Write consistent bio across platforms
- [ ] Link to website: https://iwriteread.org
- [ ] Pin introductory post about the website

### Update Website Links

Social media links are in footer of all HTML files. Verify they point to your actual profiles.

---

## 🚀 Launch Checklist

### Pre-Launch

- [ ] All functionality tested
- [ ] DNS propagation complete
- [ ] HTTPS enabled and working
- [ ] Environment variables configured
- [ ] Email setup complete
- [ ] Analytics installed
- [ ] SEO optimized
- [ ] Social media accounts created

### Launch Day

- [ ] Announce on social media
- [ ] Send email to existing contacts
- [ ] Submit to relevant directories
- [ ] Post on LinkedIn
- [ ] Engage with comments and feedback

### Post-Launch

- [ ] Monitor analytics
- [ ] Track newsletter signups
- [ ] Monitor book sales
- [ ] Respond to emails
- [ ] Create content calendar
- [ ] Schedule regular blog posts

---

## 📋 Content Updates

### Regular Updates Needed

- [ ] Publish new blog posts regularly (weekly/monthly)
- [ ] Update `/public/assets/blog/posts.json` when adding posts
- [ ] Refresh About page content as needed
- [ ] Add new works when published
- [ ] Update testimonials as received

### Maintenance Tasks

- [ ] Review and respond to newsletter subscribers
- [ ] Monitor website analytics monthly
- [ ] Check for broken links quarterly
- [ ] Update dependencies and security patches
- [ ] Backup content regularly

---

## 🆘 Troubleshooting

### Domain Not Working

1. Check DNS records are correct
2. Allow 24-48 hours for propagation
3. Clear browser cache
4. Check Netlify deploy status
5. Verify domain ownership in Netlify

### HTTPS Not Working

1. Ensure DNS is fully propagated
2. Check Netlify SSL certificate status
3. Force HTTPS in Netlify settings
4. Clear browser cache and try incognito

### Support Button Not Working

1. Verify environment variables are set in Netlify
2. Check Stripe payment link is valid
3. Ensure button code references correct variables
4. Test in different browsers

### Images Not Loading

1. Verify file paths are correct (case-sensitive)
2. Check images exist in `/public/assets/`
3. Clear browser cache
4. Check Netlify deploy log for errors

---

## 📞 Support Resources

- **Netlify Documentation**: https://docs.netlify.com
- **Stripe Documentation**: https://stripe.com/docs
- **DNS Configuration Help**: https://www.netlify.com/docs/custom-domains/
- **Buttondown Support**: https://docs.buttondown.email
- **TailwindCSS Docs**: https://tailwindcss.com/docs

---

## ✅ Final Verification

Before considering deployment complete, verify:

- [ ] `iwriteread.org` loads successfully
- [ ] HTTPS is enabled and forced
- [ ] All pages are accessible
- [ ] Buy Me a Coffee button works on blog page only
- [ ] Newsletter signup functional
- [ ] Book purchase links work
- [ ] Analytics tracking visits
- [ ] Email setup complete
- [ ] SEO tags correct on all pages
- [ ] Social media links updated

---

**Congratulations!** 🎉 Your website is now live and fully configured!

For ongoing support and updates, refer to the main [DEPLOYMENT.md](./DEPLOYMENT.md) file.
