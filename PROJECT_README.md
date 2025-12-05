# iwriteyouread.org - Official Website

Official website for "The Spirit of America: Views from the Other Side" — a bold literary and philosophical reflection on modern democracy, liberty, and the cultural pulse of America.

## 🌟 Features

- **Fully Responsive Design** - Mobile-first approach with TailwindCSS
- **Fast Loading** - Optimized for performance with minimal dependencies
- **SEO Optimized** - Complete meta tags, Open Graph, and sitemap
- **Blog System** - JSON-based blog with tag filtering and clean Medium-style layout
- **Newsletter Integration** - Buttondown email signup forms
- **E-commerce Ready** - Gumroad integration for book sales
- **Accessibility** - ARIA labels and semantic HTML
- **Modern UI** - Clean, professional design with smooth animations

## 📁 Project Structure

```
iwriteyouread/
├── public/                      # All deployable files
│   ├── index.html              # Homepage
│   ├── about.html              # About page
│   ├── book.html               # Book details and purchase
│   ├── blog.html               # Blog listing with filters
│   ├── contact.html            # Contact form and newsletter
│   ├── 404.html                # Custom 404 page
│   ├── robots.txt              # SEO crawler instructions
│   ├── sitemap.xml             # XML sitemap
│   └── assets/
│       ├── css/
│       │   └── styles.css      # Custom styles
│       ├── js/
│       │   ├── main.js         # Main JavaScript
│       │   └── blog.js         # Blog functionality
│       ├── images/             # Images and favicon
│       └── blog/
│           ├── posts.json      # Blog posts data
│           └── README.md       # Blog post template guide
├── netlify.toml                # Netlify configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `public`
3. Deploy!

The site will be automatically deployed on every push to the main branch.

### Manual Deployment

Simply upload the contents of the `public` folder to any static hosting service:
- GitHub Pages
- Vercel
- AWS S3 + CloudFront
- Any web server

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **TailwindCSS** - Utility-first CSS framework (CDN)
- **Vanilla JavaScript** - No frameworks, pure JS
- **Google Fonts** - Lora (serif) and Inter (sans-serif)
- **Buttondown** - Newsletter service
- **Gumroad** - E-commerce for book sales

## 📝 Adding Blog Posts

### Method 1: JSON (Current)

Edit `/public/assets/blog/posts.json`:

```json
{
  "id": "post-slug",
  "title": "Post Title",
  "date": "2025-01-20",
  "summary": "Post summary...",
  "image": "/assets/blog/images/image.jpg",
  "tags": ["Democracy", "Liberty"],
  "url": "/blog/post-slug.html"
}
```

### Method 2: Markdown (Future)

See `/public/assets/blog/README.md` for Markdown template instructions.

## 🎨 Customization

### Colors

Primary colors can be customized in TailwindCSS:
- **Primary Blue:** `#1d4ed8` (blue-700)
- **Dark Blue:** `#1e40af` (blue-800)
- **Light Blue:** `#3b82f6` (blue-500)

### Fonts

- **Headings:** Lora (serif)
- **Body:** Inter (sans-serif)

Change fonts in the `<head>` of HTML files and in `styles.css`.

### Content

- **Author bio:** Edit `about.html`
- **Book description:** Edit `book.html`
- **Social links:** Update footer and contact page
- **Newsletter form:** Replace Buttondown URL in forms
- **Gumroad links:** Update product URLs in `book.html`

## 🔧 Configuration

### Newsletter (Buttondown)

Replace `iwriteyouread` with your Buttondown username:
```html
<form action="https://buttondown.email/api/emails/embed-subscribe/YOUR-USERNAME">
```

### Gumroad

Update product links in `book.html`:
```html
<a href="https://YOUR-USERNAME.gumroad.com/l/YOUR-PRODUCT">
```

### Social Media

Update social media handles in footer and contact page:
- Twitter: `@iwriteyouread`
- Instagram: `@iwriteyouread`
- YouTube: `@iwriteyouread`
- Threads: `@iwriteyouread`

### Analytics (Optional)

Add Google Analytics or Plausible Analytics to track visitors:

```html
<!-- Add before </head> in all HTML files -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-ID"></script>
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance

- **Lighthouse Score:** 95+ on all metrics
- **Fast loading:** < 2 seconds on 3G
- **Optimized images:** Lazy loading enabled
- **Minimal JavaScript:** ~17KB gzipped
- **CDN delivery:** TailwindCSS via CDN

## 🔒 Security

- HTTPS enforced via Netlify
- Security headers configured in `netlify.toml`
- No user authentication required
- Newsletter signup via trusted third-party (Buttondown)
- Form protection via Netlify Forms (if configured)

## 📄 License

All rights reserved © 2025 iwriteyouread.org

## 🤝 Contributing

This is a personal author website. For suggestions or bug reports, please contact via the website form.

## 📞 Support

For technical issues or questions:
- Website: [iwriteyouread.org/contact](https://iwriteyouread.org/contact)
- Email: contact@iwriteyouread.org

## 🙏 Acknowledgments

- TailwindCSS for the amazing CSS framework
- Google Fonts for Lora and Inter typefaces
- Netlify for hosting and deployment
- Buttondown for newsletter service
- Gumroad for e-commerce platform

---

**Built with ❤️ for thoughtful discourse on democracy, liberty, and the American experience.**
