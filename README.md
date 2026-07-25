# Kent Shen — Workbench (React + Vite)

A personal catalog site for Chrome extensions and web services. Built with
React + Vite. Traditional Chinese is the default/primary language; the
English locale and the language toggle stay fully wired up for later.
Visual theme is a dark, geek/hacker terminal look — green-phosphor by
default, with an amber-CRT palette toggle, scanline overlay, glow accents,
and a typed boot-sequence intro animation on first visit each session
(skippable via click or Enter/Escape, and automatically skipped for
`prefers-reduced-motion` users).

**Single flat page, no categories/routing for now** — the catalog is only
5 items, so everything renders as one list with no nav tabs, no pagination,
and no client-side routing (react-router-dom was removed). Each product
still carries a `category` field in the data (`extensions` / `services`),
so re-introducing grouped category pages later is a rendering change, not
a data migration — see "Bringing categories back" below.

## Known TODOs

- `JOB-ANALYZER` and `TRIP-PLANNER` entries (in `src/i18n/en.json` /
  `src/i18n/zh.json`) still have `"url": "#"` placeholders — swap in the
  real deployed URLs once you have them.
- Theme colors live in `src/styles/style.css` under `:root` (green,
  default) and `html[data-mode="amber"]` (amber alt-palette) — both use the
  same CSS variable names, so changing a color there updates it everywhere.
- Boot sequence copy lives in `ui.boot.lines` in each locale file; timing
  constants (`CHAR_DELAY`, `LINE_PAUSE`, `HOLD_AFTER`) are in
  `src/components/BootSequence.jsx`.
- The Claude Skills catalog (`category: "skills"`) was removed — it's
  becoming its own standalone product. `ProductEntry.jsx` still has the
  unused rendering path for skill-style cards (trigger chips, screenshot
  placeholder, CTA button) in case a similar category comes back.

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

Covers: the page renders with no category nav, no explore grid, and no
pagination; all 5 current products render and the removed ones don't; the
footer has no bio paragraph or podcast link; language toggle flips all
copy + `<html lang>`; the green/amber palette toggle flips `data-mode`; the
boot sequence shows on a fresh session but is skipped on repeat visits.

## Adding a new product

Everything lives in `src/i18n/en.json` and `src/i18n/zh.json` — both files
must be edited together, using the same `id` per entry, or the two
languages will drift out of sync. Since there's no category UI right now,
new entries just get appended to the `products` array and show up in the
same flat list — the `category` field can be left as whatever's accurate,
it's just not read by anything yet.

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

## Bringing categories back later

If the catalog grows enough to want grouping/pagination again: the old
`ExploreGrid.jsx`, `CategorySection.jsx`, and route-based `CategoryPage.jsx`
were deleted (not just hidden) when this was simplified, along with
`react-router-dom` — so reviving them means re-adding the router dependency
and rebuilding those components, not just flipping a flag. `Pagination.jsx`
was kept in the repo, unused, since it's small and framework-agnostic.

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
    Pagination.jsx             — unused for now, kept for when the list grows
    Icons.jsx                 — terminal/CRT toggle icon
    BootSequence.jsx          — typed boot animation shown once per session
  styles/style.css            — hacker/terminal theme (design tokens, scanlines, glow)
  utils/markdown.jsx          — tiny **bold**/[link]() renderer, no dangerouslySetInnerHTML
```
