/**
 * Automated Blog Engine for iwriteyouread.org
 *
 * Runs nightly at 23:00 UTC. Calls the Anthropic API to write one new blog
 * post in Alexander Afolabi's established voice, then commits it to the
 * repository via the GitHub Contents API and updates the posts index and
 * sitemap.
 *
 * Required secrets (set via `wrangler secret put` or the Cloudflare dashboard
 * under Settings > Variables and Secrets):
 *   ANTHROPIC_API_KEY  - Anthropic API key
 *   GITHUB_TOKEN       - GitHub personal access token with contents read/write
 *                        for the Lyrion1/iwriteyouread repository
 */

const GITHUB_REPO = "Lyrion1/iwriteyouread";
const GITHUB_BRANCH = "main";
const GITHUB_API_BASE = "https://api.github.com";

// ── Anthropic prompt ────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are writing a blog post for Alexander Afolabi's site iwriteyouread.org.

Alexander is an independent writer whose work explores democracy, culture, identity,
and the intersections of politics with lived experience. His voice is measured and
literary: he writes in complete, unhurried sentences; favours short paragraphs for
rhetorical punch; uses concrete examples rather than abstractions; and never lets
anger replace clarity. He writes from the perspective of an outside observer of
American and British political life.

Rules you must follow without exception:
- Never use em dashes (-- or the Unicode character U+2014). Use commas, colons,
  semicolons, or parentheses instead.
- Never fabricate biographical claims about Alexander Afolabi or any real person.
- Never invent quotations. Do not attribute words to any named individual unless
  you are reproducing a well-known, verifiable phrase (e.g. a famous short motto).
  Even then, keep attributed material brief and strictly accurate.
- Do not claim that any event occurred unless it is a well-established historical
  or current-affairs fact you are confident about. When in doubt, speak generally.
- Write in the first person (the author's voice). Do not refer to "Alexander" in
  the text as a third party; the narrator is Alexander.

Your response must be valid JSON with this exact shape:
{
  "title": "...",
  "slug": "...",
  "tags": ["...", "..."],
  "summary": "...",
  "html_body": "..."
}

slug: lowercase, words separated by hyphens, no special characters, 3-6 words.
tags: 2-3 tags from this list: Democracy, American Politics, Liberty, Immigration,
      Justice, UK Politics, Culture, Writing, Literature, Poetry.
summary: 1-2 sentences describing the post (no em dashes).
html_body: the prose body of the post as HTML. Use only <p>, <h2>, and <h3> tags.
           No <div>, no inline styles, no em dashes anywhere in the text.
           Aim for 500-800 words of body text.`;

const USER_PROMPT = `Write one new blog post for iwriteyouread.org. Choose one of these themes:
- A literary reflection on language, meaning, or the craft of writing
- Commentary on a poem, a literary tradition, or the act of reading
- A meditation on democracy, dissent, or political language

The post should feel fresh, not like a repeat of existing topics on the site.
Return only the JSON object described in your instructions.`;

// ── Utility functions ────────────────────────────────────────────────────────

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

function buildPostHTML(post, date) {
  const dateFormatted = new Date(date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tagsHTML = post.tags
    .map(
      (t) =>
        `<span class="inline-block px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-full">${t}</span>`
    )
    .join("\n                    ");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${post.summary.replace(/"/g, "&quot;")}">
    <meta name="keywords" content="${post.tags.join(", ")}, Alexander Afolabi">
    <meta name="author" content="Alexander Afolabi">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="${post.title.replace(/"/g, "&quot;")} | iwriteyouread">
    <meta property="og:description" content="${post.summary.replace(/"/g, "&quot;")}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://iwriteyouread.org/blog/${post.slug}.html">
    <meta property="og:image" content="https://iwriteyouread.org/assets/logoo.png">

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${post.title.replace(/"/g, "&quot;")} | iwriteyouread">
    <meta name="twitter:description" content="${post.summary.replace(/"/g, "&quot;")}">
    <meta name="twitter:image" content="https://iwriteyouread.org/assets/logoo.png">

    <title>${post.title} | iwriteyouread</title>

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/logo.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/logoo.png">

    <!-- TailwindCSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Custom Styles -->
    <link rel="stylesheet" href="/assets/css/styles.css">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Playfair+Display:wght@400;700;900&family=Lato:wght@300;400;700&family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
</head>
<body class="font-sans text-gray-800 bg-white min-h-screen">

    <!-- Navigation Bar -->
    <nav id="navbar" class="fixed w-full top-0 z-50 bg-white shadow-sm transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex-shrink-0 flex items-center">
                    <img src="/assets/logoo.png" alt="Alexander Afolabi Logo" class="author-logo" />
                    <a href="/" class="text-2xl font-serif font-bold text-gray-900 hover:text-gray-700 transition-colors">
                        iwriteyouread
                    </a>
                </div>

                <div class="hidden md:flex space-x-8">
                    <a href="/" class="nav-link text-gray-700 hover:text-gray-900 transition-colors font-medium">Home</a>
                    <a href="/works.html" class="nav-link text-gray-700 hover:text-gray-900 transition-colors font-medium">The Gryphon's Quill</a>
                    <a href="/blog.html" class="nav-link text-gray-900 font-semibold">Blog</a>
                    <a href="/about.html" class="nav-link text-gray-700 hover:text-gray-900 transition-colors font-medium">About</a>
                    <a href="/contact.html" class="nav-link text-gray-700 hover:text-gray-900 transition-colors font-medium">Contact</a>
                </div>

                <button id="mobile-menu-button" class="md:hidden text-gray-700 hover:text-gray-900 focus:outline-none" aria-label="Toggle menu">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path id="menu-icon" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        <path id="close-icon" class="hidden" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>

        <div id="mobile-menu" class="hidden md:hidden bg-white border-t border-gray-200">
            <div class="px-4 pt-2 pb-4 space-y-2">
                <a href="/" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors font-medium">Home</a>
                <a href="/works.html" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors font-medium">The Gryphon's Quill</a>
                <a href="/blog.html" class="block px-3 py-2 bg-gray-100 text-gray-900 rounded-md font-semibold">Blog</a>
                <a href="/about.html" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors font-medium">About</a>
                <a href="/contact.html" class="block px-3 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors font-medium">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="pt-24 pb-20">
        <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Back to Blog -->
            <div class="mb-8">
                <a href="/blog.html" class="inline-flex items-center text-blue-700 hover:text-blue-900 font-medium transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Blog
                </a>
            </div>

            <!-- Article Header -->
            <header class="mb-12">
                <div class="flex flex-wrap gap-2 mb-4">
                    ${tagsHTML}
                </div>

                <h1 class="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    ${post.title}
                </h1>

                <div class="flex items-center text-gray-600 space-x-4">
                    <time datetime="${date}">${dateFormatted}</time>
                    <span>&#x2022;</span>
                    <span>By Alexander Afolabi</span>
                </div>
            </header>

            <!-- Article Content -->
            <div class="prose prose-lg max-w-none">
                ${post.html_body}
            </div>

            <!-- Article Footer -->
            <footer class="mt-12 pt-8 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600 mb-2">Written by</p>
                        <p class="font-semibold text-gray-900">Alexander Afolabi &#x270D;</p>
                    </div>
                    <a href="/blog.html" class="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors">
                        More Essays
                    </a>
                </div>
            </footer>

        </article>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                    <h3 class="font-serif text-xl font-bold mb-4">iwriteyouread</h3>
                    <p class="text-gray-400 leading-relaxed">
                        A bold voice exploring democracy, liberty, and the American experience through thoughtful essays and books.
                    </p>
                </div>

                <div>
                    <h3 class="font-serif text-xl font-bold mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a href="/" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
                        <li><a href="/works.html" class="text-gray-400 hover:text-white transition-colors">The Gryphon's Quill</a></li>
                        <li><a href="/blog.html" class="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                        <li><a href="/about.html" class="text-gray-400 hover:text-white transition-colors">About</a></li>
                        <li><a href="/contact.html" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                    </ul>
                </div>

                <div>
                    <h3 class="font-serif text-xl font-bold mb-4">Connect</h3>
                    <div class="flex space-x-4">
                        <a href="https://twitter.com/iwriteyouread" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg>
                        </a>
                        <a href="https://instagram.com/iwriteyouread" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                        </a>
                    </div>
                </div>
            </div>

            <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
                <p class="mb-2">&copy; 2025 iwriteyouread.org. All rights reserved.</p>
                <p class="text-sm text-gray-500">Built with purpose on iwriteyouread.org</p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script src="/assets/js/main.js"></script>

</body>
</html>`;
}

// ── GitHub Contents API helpers ──────────────────────────────────────────────

async function githubGet(path, token) {
  const url = `${GITHUB_API_BASE}/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url, {
    headers: {
      Authorization: "token " + token,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub GET ${path} failed ${res.status}: ${body}`);
  }
  return res.json();
}

async function githubPut(path, token, content, message, sha) {
  const url = `${GITHUB_API_BASE}/repos/${GITHUB_REPO}/contents/${path}`;
  const body = {
    message,
    content: btoa(String.fromCharCode(...new TextEncoder().encode(content))),
    branch: GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: "token " + token,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`GitHub PUT ${path} failed ${res.status}: ${errBody}`);
  }
  return res.json();
}

function decodeBase64(encoded) {
  const cleaned = encoded.replace(/\n/g, "");
  return new TextDecoder().decode(Uint8Array.from(atob(cleaned), (c) => c.charCodeAt(0)));
}

// ── Anthropic API call ───────────────────────────────────────────────────────

async function generatePost(apiKey) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: USER_PROMPT }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API failed ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const raw = data.content[0].text.trim();

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON object found in Anthropic response");

  const post = JSON.parse(jsonMatch[0]);

  for (const field of ["title", "slug", "tags", "summary", "html_body"]) {
    if (!post[field]) throw new Error(`Missing field in post JSON: ${field}`);
  }

  if (!Array.isArray(post.tags)) throw new Error("tags must be an array");

  post.slug = slugify(post.slug || post.title);

  const emDashPattern = /\u2014|--/g;
  if (
    emDashPattern.test(post.title) ||
    emDashPattern.test(post.summary) ||
    emDashPattern.test(post.html_body)
  ) {
    post.title = post.title.replace(/\u2014|--/g, ",");
    post.summary = post.summary.replace(/\u2014|--/g, ",");
    post.html_body = post.html_body.replace(/\u2014|--/g, ",");
  }

  return post;
}

// ── Update posts.json ────────────────────────────────────────────────────────

async function updatePostsIndex(token, post, date) {
  const filePath = "public/assets/blog/posts.json";
  const existing = await githubGet(filePath, token);
  const currentContent = decodeBase64(existing.content);
  const data = JSON.parse(currentContent);

  const newEntry = {
    id: post.slug,
    slug: post.slug,
    title: post.title,
    date,
    summary: post.summary,
    image: "",
    tags: post.tags,
    url: `/blog/${post.slug}.html`,
  };

  data.posts.unshift(newEntry);

  await githubPut(
    filePath,
    token,
    JSON.stringify(data, null, 2) + "\n",
    `blog: add "${post.title}" to posts index`,
    existing.sha
  );
}

// ── Update sitemap.xml ───────────────────────────────────────────────────────

async function updateSitemap(token, post, date) {
  const filePath = "public/sitemap.xml";
  const existing = await githubGet(filePath, token);
  const currentContent = decodeBase64(existing.content);

  const newEntry = `  <url>
    <loc>https://iwriteyouread.org/blog/${post.slug}.html</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

  const updated = currentContent.replace("</urlset>", `${newEntry}\n</urlset>`);

  await githubPut(
    filePath,
    token,
    updated,
    `blog: add "${post.title}" to sitemap`,
    existing.sha
  );
}

// ── Main handler ─────────────────────────────────────────────────────────────

async function runBlogEngine(env) {
  const { ANTHROPIC_API_KEY, GITHUB_TOKEN } = env;

  if (!ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY secret is not set");
  if (!GITHUB_TOKEN) throw new Error("GITHUB_TOKEN secret is not set");

  const post = await generatePost(ANTHROPIC_API_KEY);
  const date = todayISO();

  const htmlContent = buildPostHTML(post, date);
  const filePath = `public/blog/${post.slug}.html`;

  let existingSha;
  try {
    const existing = await githubGet(filePath, GITHUB_TOKEN);
    existingSha = existing.sha;
  } catch {
    existingSha = undefined;
  }

  await githubPut(
    filePath,
    GITHUB_TOKEN,
    htmlContent,
    `blog: publish "${post.title}"`,
    existingSha
  );

  await updatePostsIndex(GITHUB_TOKEN, post, date);
  await updateSitemap(GITHUB_TOKEN, post, date);

  return { success: true, slug: post.slug, title: post.title, date };
}

// ── Cloudflare Worker export ─────────────────────────────────────────────────

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      runBlogEngine(env).then((result) => {
        console.log("Blog post published:", JSON.stringify(result));
      })
    );
  },

  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === "/trigger" && request.method === "POST") {
      const authHeader = request.headers.get("Authorization");
      if (!authHeader || authHeader !== "Bearer " + env.GITHUB_TOKEN) {
        return new Response("Unauthorized", { status: 401 });
      }
      ctx.waitUntil(
        runBlogEngine(env)
          .then((result) => console.log("Manual trigger:", JSON.stringify(result)))
          .catch((err) => console.error("Manual trigger error:", err))
      );
      return new Response(JSON.stringify({ queued: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response("iwriteyouread auto-blog worker", { status: 200 });
  },
};
