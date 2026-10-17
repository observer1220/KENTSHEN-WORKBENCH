# Kent Shen — Workbench (React + Vite)

Personal site at **kentshen.com**: numbered plates of works, a Markdown blog, and a contact form. Styled in the International Typographic (Swiss) style: 12-column grid, flush-left Archivo + Noto Sans TC (weights 400 vs 900 only), IBM Plex Mono for labels, square corners, hairline and 2px rules, one red (--red). Traditional Chinese is the default language (src/i18n/zh.json; the English file is kept in sync but there is no language toggle for now).

## Pages

| Path | What |
| --- | --- |
| `/` | Wordmark + facts, works as numbered plates (with search), latest post + contact blocks |
| `/blog` | Post list (date, title, summary) |
| `/blog/<slug>` | A single post |
| `/contact` | Contact form (builds a `mailto:` link, no backend) |

Routing is a ~60-line History API router in `src/router.jsx`. The Worker is
configured with `not_found_handling: "single-page-application"` so deep links
like `/blog/<slug>` load `index.html`.

**Works:** each work is a large numbered plate (its og-image at ~620px wide so the text in it stays readable, full width on phones) with a 2px rule, number, name, type/year and one-line tagline underneath. Image `alt` text carries the name and tagline.

## Title, icons, link preview, install

- Browser title: **Kent Shen's Workspace** (`meta.title` in both i18n files and
  `index.html`; a post's tab title is `<post> — Kent Shen's Workspace`).
- `public/favicon.svg` (K + red square), `favicon-32.png`, `apple-touch-icon.png`,
  `icon-192/512.png`, `icon-maskable-512.png`, and `manifest.webmanifest`
  (standalone, white). The social/link-preview image is `public/og-image.png`
  (1200×630), referenced by the `og:*` / `twitter:*` tags in `index.html`.
- These PNGs were drawn once with canvas (K from the SVG, wordmark in Archivo 900)
  and committed; to change them, re-render and replace the files.
- The footer shows **加入主畫面 +** only when it can help: Chrome/Edge/Android
  when the browser offers installation (opens the native prompt), and iOS
  (shows "Share → Add to Home Screen"). It is hidden once installed.
- All routes share one `index.html`, so link previews of individual posts show
  the site-level title/image (see the known limit below).

## Writing blog posts

Add a Markdown file to `content/blog/`. The filename is the URL slug
(`my-post.md` → `/blog/my-post`). Posts are bundled at build time — no
database.

```md
---
title: Post title
date: 2026-10-09
tags: Cloudflare, notes
summary: One line shown in the post list.
---

Normal Markdown here (headings, lists, code fences, quotes, images, links).

::embed[https://www.threads.com/@user/post/XXXX]
::embed[https://youtu.be/VIDEO_ID]
::embed[https://example.com/article | Card title | Card description]
```

`::embed[...]` must sit on its own line (not inside a code fence).

- **Threads post** → official Threads embed.
- **YouTube** (`watch`, `youtu.be`, `shorts`) → privacy-enhanced iframe.
- **Any other URL** → link card showing the host plus the optional
  `title | description` you write. There is no server to fetch Open Graph
  data, so the card does not auto-fill them.

Post HTML is produced by `marked` and injected with `dangerouslySetInnerHTML`.
That is acceptable because posts are committed to this repo by the owner; do
not feed it untrusted content.

**Known limit:** posts render in the browser, so link previews (Threads,
Slack, search results) show the generic site title/description, not the post's.
Pre-rendering each post to static HTML at build time would fix this.

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # vitest + @testing-library/react
npm run build     # static files → dist/
```

## Deploy

`./deploy.sh main` runs tests + build, commits, and pushes to `main`;
Cloudflare Workers Builds deploys from GitHub.

- `wrangler.jsonc` — Worker `kentshen`, assets from `./dist`, custom domain
  `kentshen.com`, `workers.dev` kept enabled.
- `worker/index.js` — 301-redirects any `*.workers.dev` request (old shared
  links) to `https://kentshen.com` with the same path/query, otherwise serves
  the static assets. Don't disable the `workers.dev` route in the dashboard:
  the redirect depends on it staying reachable.

## Adding a work

Edit `src/i18n/zh.json` and `src/i18n/en.json` together, same `id` in both.
Copy the product's own `og-image.png` (1200×630) into `public/thumbnails/`.

```json
{
  "id": "new-thing",
  "category": "services",
  "status": "live",
  "date": "2026.10",
  "title": "NEW-THING",
  "kind": "網站",
  "tagline": "One plain-text line shown in the index.",
  "desc": "Longer description (searchable; supports **bold**).",
  "thumbnail": "/thumbnails/new-thing.png",
  "links": [{ "label": "visit", "url": "https://..." }]
}
```

`tagline`, `desc`, `title` and `kind` are all searched by the search box.
Thumbnails are static copies; re-copy them if a product's OG image changes.
(`screenshot` / `feedback` fields in the JSON are leftovers from a retired
gallery layout and are unused.)

## Contact email

`src/components/ContactPage.jsx` sets `CONTACT_EMAIL`; the form opens the
visitor's mail client with the fields filled in.

## Structure

```
content/blog/*.md          blog posts
src/
  blog/posts.js            loads posts, frontmatter, ::embed parsing
  components/              Header, Home, BlogPage, Embed, ThreadsEmbed, ContactPage
  i18n/                    zh.json, en.json, LocaleContext
  router.jsx               History API router + <Link>
  styles/style.css         all styles (tokens at the top)
worker/index.js            workers.dev → kentshen.com redirect + asset serving
public/thumbnails/         each work's og-image
```
