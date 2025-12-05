# Blog Post Template

This directory contains the blog posts data and Markdown templates for the iwriteyouread.org website.

## Adding a New Blog Post

### Option 1: Using JSON (Current Implementation)

Add a new entry to `posts.json`:

```json
{
  "id": "your-post-slug",
  "title": "Your Post Title",
  "date": "2025-01-20",
  "summary": "A brief summary of your post (1-2 sentences).",
  "image": "/assets/blog/images/your-post-image.jpg",
  "tags": ["American Politics", "Democracy"],
  "url": "/blog/your-post-slug.html"
}
```

### Option 2: Using Markdown (For Future Implementation)

Create a new Markdown file in the `blog/posts/` directory:

**Filename:** `2025-01-20-your-post-slug.md`

**Frontmatter Format:**
```markdown
---
title: Your Post Title
date: 2025-01-20
summary: A brief summary of your post (1-2 sentences).
image: /assets/blog/images/your-post-image.jpg
tags:
  - American Politics
  - Democracy
author: iwriteyouread
---

# Your Post Title

Your content goes here...

## Section Heading

More content...

### Subsection

And so on...
```

## Available Tags

- American Politics
- Liberty
- Immigration
- Democracy
- Justice

## Image Guidelines

- **Dimensions:** 1200x630px (optimal for Open Graph)
- **Format:** JPG or PNG
- **Size:** Under 500KB
- **Location:** `/assets/blog/images/`

## Writing Guidelines

1. **Title:** Clear, compelling, specific (50-60 characters)
2. **Summary:** 1-2 sentences that capture the essence (150-160 characters)
3. **Content:** 
   - Use clear headings (H2, H3)
   - Keep paragraphs short (3-4 sentences)
   - Include relevant links
   - Use bold for emphasis sparingly
4. **Tone:** Intellectual, thoughtful, bold but respectful

## SEO Best Practices

- Include primary keyword in title
- Use descriptive alt text for images
- Add internal links to related posts
- Keep URL slugs short and descriptive

## Example Post Structure

```markdown
---
title: The View from Outside: On Democracy and Distance
date: 2025-01-15
summary: Exploring what it means to observe American democracy from a position of intellectual distance.
image: /assets/blog/images/democracy-distance.jpg
tags:
  - Democracy
  - American Politics
---

# The View from Outside: On Democracy and Distance

**Introduction paragraph that hooks the reader...**

## The Observer's Advantage

First main section...

## Distance and Clarity

Second main section...

## Conclusion

Final thoughts...

---

*What do you think? Share your thoughts on [Twitter](#) or [contact me](/contact.html).*
```

## Publishing Workflow

1. Write your post in Markdown or add to JSON
2. Add accompanying image to `/assets/blog/images/`
3. Preview locally
4. Commit changes to repository
5. Deploy to Netlify (automatic)

## Notes

- All posts are displayed in reverse chronological order
- Tags enable filtering on the blog page
- External links should open in new tabs
- Keep consistent voice and style across all posts
