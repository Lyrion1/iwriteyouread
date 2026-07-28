# iwriteyouread Auto-Blog Worker

A Cloudflare Worker that runs nightly at 23:00 UTC to generate and publish one
new blog post to iwriteyouread.org using the Anthropic API.

## What it does

Each night the worker:
1. Calls the Anthropic API to write a new blog post in Alexander Afolabi's
   established literary voice (literary reflection, writing craft notes, or
   poetry commentary).
2. Commits the new HTML file to `public/blog/` in this repository.
3. Updates `public/assets/blog/posts.json` so the post appears on the blog
   listing page.
4. Adds the new URL to `public/sitemap.xml`.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- A [Cloudflare](https://www.cloudflare.com/) account
- An [Anthropic](https://www.anthropic.com/) API key
- A GitHub personal access token (classic) with `repo` scope (or a fine-grained
  token with Contents read and write for the `Lyrion1/iwriteyouread` repository)

### Install Wrangler

```bash
npm install -g wrangler
wrangler login
```

### Add secrets

```bash
wrangler secret put ANTHROPIC_API_KEY
# paste your Anthropic API key when prompted

wrangler secret put GITHUB_TOKEN
# paste your GitHub token when prompted
```

Alternatively, both secrets can be added directly in the Cloudflare dashboard
under **Workers and Pages > your worker > Settings > Variables and Secrets**,
with no CLI required. This is the same approach used to set up the
`9inth-house-engine` worker.

### Deploy

```bash
cd worker
wrangler deploy
```

Wrangler will confirm the cron schedule (`0 23 * * *`, i.e. every night at
23:00 UTC) and provide the worker URL.

## Manual trigger

A POST request to `https://<worker-url>/trigger` with an `Authorization` header
(value: the word `Bearer` followed by a space and your `GITHUB_TOKEN` value)
will run the blog engine immediately, outside the scheduled cron. Useful for
testing after deployment.

## Configuration

The cron schedule, repository, and branch are all set in `wrangler.toml`. The
prompts and HTML template used for post generation live in `src/index.js`.

## Required secrets summary

| Secret            | Where to get it                          |
|-------------------|------------------------------------------|
| `ANTHROPIC_API_KEY` | console.anthropic.com > API Keys        |
| `GITHUB_TOKEN`    | github.com > Settings > Developer settings > Personal access tokens |
