# Blog Post Category Thumbnail Images

This directory contains thumbnail images for blog post categories. Each image is mapped to a specific category/tag.

## Current Images (SVG Placeholders)

These are temporary gradient SVG images that serve as placeholders. They should be replaced with actual high-quality images before production:

- `immigration.svg` - Immigration-themed posts (Blue gradient)
- `uk-politics.svg` - UK Politics posts (Red gradient)
- `culture.svg` - Culture-related posts (Purple gradient)
- `liberty.svg` - Liberty-themed posts (Green gradient)
- `democracy.svg` - Democracy posts (Cyan gradient)
- `justice.svg` - Justice-related posts (Orange gradient)
- `us-politics.svg` - American Politics posts (Blue-Red gradient)
- `default.svg` - Default fallback for posts without matching categories (Gray gradient)

## Image Requirements

When replacing these placeholders with actual images, ensure:

1. **Dimensions**: 800x400px (2:1 aspect ratio)
2. **Format**: JPG or PNG (keep the .svg extension or update mappings in blog.js)
3. **File size**: < 150KB per image for optimal performance
4. **Quality**: High-quality, professional images that represent the category
5. **Rights**: Ensure you have proper licenses/rights to use the images

## Usage

Images are automatically selected based on blog post tags. The mapping is defined in `/public/assets/js/blog.js`:

```javascript
const CATEGORY_IMAGE_MAP = {
    'Immigration': '/images/immigration.svg',
    'UK Politics': '/images/uk-politics.svg',
    'Culture': '/images/culture.svg',
    'Liberty': '/images/liberty.svg',
    'Democracy': '/images/democracy.svg',
    'Justice': '/images/justice.svg',
    'American Politics': '/images/us-politics.svg'
};
```

## Fallback Behavior

If a blog post has multiple tags:
1. The system first checks for priority tags (Democracy, American Politics, Liberty, Justice, Immigration, UK Politics, Culture)
2. Then checks for any tag that has a mapping
3. Falls back to `default.svg` if no matching category is found

## Recommendations for Replacement

Consider using:
- Stock photo services (Unsplash, Pexels, Pixabay) for free high-quality images
- Custom illustrations or graphics that match the site's aesthetic
- AI-generated images with appropriate licenses
- Original photography

Ensure all images maintain a consistent style and color palette that complements the site design.
