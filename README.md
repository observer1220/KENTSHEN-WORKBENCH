# Kent Shen — Workbench (React + Vite)

A personal catalog site for web services. Built with React + Vite.
Traditional Chinese is the default/primary language; the English locale
and the language toggle stay fully wired up for later. Visual theme is a
low-key, Japanese-retro look — warm washi-paper background, sumi ink text,
Noto Serif TC headings — with an indigo/vermillion accent-palette
toggle. No glow, scanlines, or neon; the toggle just swaps which accent
color (ai-zome indigo vs. bengara vermillion) leads.

Product catalog renders as a horizontal, carousel-style gallery
(`Gallery.jsx`) — one scroll-snapped card per product with a screenshot,
description, and (when available) the Threads post it's backed by,
embedded live via Meta's official oEmbed script.

**Single flat page, no categories/routing** — the catalog is only 4 items,
so everything renders as one list with no nav tabs, no pagination, and no
client-side routing. Each product still carries a `category` field in the
data (`extensions` / `services`), so re-introducing grouped category pages
later is a rendering change, not a data migration.

**Contact is a view swap, not a route** — clicking "Contact" in the footer
swaps the main content for a form (category dropdown, name, phone, email,
description) via local component state, no URL change. Submitting builds a
`mailto:` link with the fields filled in — there's no backend.

## ⚠️ Before deploying: set your real contact email

`src/components/ContactPage.jsx` has a placeholder at the top:

```js
const CONTACT_EMAIL = "your-email@example.com";
```

Replace it with your real address, or the contact form will try to email
a fake one.

## Known TODOs

- `JOB-ANALYZER` is hidden for now (removed from `src/i18n/en.json` /
  `src/i18n/zh.json`) — re-add it as a product entry whenever it's ready to
  show again.
- Theme colors live in `src/styles/style.css` under `:root` (green,
  default) and `html[data-mode="amber"]` (amber alt-palette) — both use the
  same CSS variable names, so changing a color there updates it everywhere.
- The Claude Skills catalog (`category: "skills"`) was removed — it's
  becoming its own standalone product. `ProductEntry.jsx` still has the
  unused rendering path for skill-style cards (trigger chips, screenshot
  placeholder, CTA button) in case a similar category comes back.
- The contact form only sends via `mailto:` (opens the visitor's own email
  client) — there's no server-side handling. If you want submissions saved
  somewhere (e.g. a Cloudflare D1 table via a Pages Function) instead of
  relying on the visitor's mail client, that's a natural next step given
  your existing Workers setup.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173 — hot reload
```

## Build for deployment

```bash
npm run build      # outputs static files to dist/
npm run preview    # serve the built dist/ locally to sanity-check
```

`dist/` is a plain static folder — deploy it anywhere (Cloudflare Pages,
Netlify, GitHub Pages, etc.). No SPA fallback rule is needed since there's
only one route.

**Cloudflare Pages build settings:**

- Build command: `npm run build`
- Build output directory: `dist`

## Tests

```bash
npm test    # runs the smoke test suite (vitest + @testing-library/react)
```

Covers: the page renders with no category nav, no explore grid, no
pagination, and no boot overlay; all 4 current products render (and the
hidden/removed ones don't); the lyrics extension has no source-code link;
the footer has no bio paragraph, no podcast link, and no GitHub link;
clicking Contact swaps in the form (and Back returns to the product list);
language toggle flips all copy + `<html lang>`; the green/amber palette
toggle flips `data-mode`.

## Adding a new product

Everything lives in `src/i18n/en.json` and `src/i18n/zh.json` — both files
must be edited together, using the same `id` per entry, or the two
languages will drift out of sync.

```json
{
  "id": "new-thing",
  "category": "services",
  "status": "live",
  "date": "2026.08",
  "title": "...",
  "kind": "Website",
  "desc": "supports **bold** and [links](https://example.com)",
  "links": [{ "label": "visit", "url": "https://..." }]
}
```

## Project structure

```
src/
  i18n/
    en.json, zh.json        — all UI copy + product data, per language
    LocaleContext.jsx        — language state, detection, persistence
    ModeContext.jsx           — green/amber phosphor palette state, persistence
  components/
    Header.jsx, Footer.jsx
    ProductList.jsx           — flat list of every product, no grouping
    ProductEntry.jsx          — one product card (plus an unused skill-card variant)
    ContactPage.jsx            — contact form, swapped in via App's local state
    Pagination.jsx             — unused for now, kept for when the list grows
    Icons.jsx                 — terminal/CRT toggle icon
  styles/style.css            — hacker/terminal theme (design tokens, scanlines, glow)
  utils/markdown.jsx          — tiny **bold**/[link]() renderer, no dangerouslySetInnerHTML
```
