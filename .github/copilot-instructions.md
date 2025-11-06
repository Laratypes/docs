## Purpose
Short, actionable guidance for AI coding assistants working on this repository (a VitePress documentation site).

## Quick start (developer workflows)
- Install dependencies: prefer pnpm (repo contains `pnpm-lock.yaml`), but npm/yarn work too.
  - pnpm: `pnpm install`
  - npm: `npm install`
- Local dev (live-reload): `pnpm run docs:dev` (or `npm run docs:dev`).
- Build static site: `pnpm run docs:build`.
- Preview a built site: `pnpm run docs:preview`.

These scripts are defined in `package.json`.

## High-level architecture (what you'll see)
- A VitePress site using Vue 3 (`vitepress` devDependency and `vue` dependency).
- Multi-lingual content stored under `en/` (English) and `vi/` (Vietnamese). Each language folder mirrors the other.
- Site config and theme live in `.vitepress/`:
  - `.vitepress/config.mts` — primary routing, sidebar, locale, and Algolia search config.
  - `.vitepress/theme/` — custom Layout.vue and theme CSS.
- Static public assets are served from `public/assets/` and referenced as `/assets/...` in markdown/frontmatter.

## Important repository-specific conventions
- Language routing: the `vi` locale is served at root (no `/vi` prefix) due to the `rewrites`/`locales` setup in `.vitepress/config.mts`. English pages use the `/en` prefix. Follow existing link patterns when authoring content in a language folder.
- Sidebar & links: the sidebar config often sets a `base` (e.g. `/getting-started/`) and item `link`s are relative names (e.g. `quick-start`). When adding pages, place the markdown under the directory matching the `base`, and use the same relative file name.
- Page entry points: every directory that should be routable contains an `index.md` or `something.md`. Top-level language index pages are `en/index.md` and `vi/index.md`.
- Assets: reference images with `/assets/...`, not `public/assets/...` (VitePress serves `public` as root).
- Theme changes: small UI/behavior tweaks belong in `.vitepress/theme/*` (e.g. cookie language handling is implemented in `.vitepress/theme/Layout.vue`).

## Integration points and environment
- Search uses Algolia; `.vitepress/config.mts` reads `ALGOLIA_APP_ID` and `ALGOLIA_API_KEY` from the environment — set these when previewing production search.
- The project is a content site; no server-side code or automated tests are present in the repo. Expect edits to be Markdown-heavy.

## Editing guidance & examples
- To add a new Getting Started page in English:
  1. Create `en/getting-started/your-section/your-page.md`.
  2. Add the route to the sidebar in `.vitepress/config.mts` under the corresponding `base` (use the existing pattern of `base + link`).
  3. Reference images with `/assets/your-image.png` and place them under `public/assets/`.

- Example patterns to follow:
  - `en/index.md` frontmatter points to `/en/getting-started/introduction/quick-start` (see `en/index.md`).
  - `vi/index.md` links omit `/vi` because `.vitepress/config.mts` rewrites `vi/:rest*` to `:rest*` (see `rewrites` in config).

## Cautions and gotchas
- VitePress version is an alpha release here (`vitepress` 2.0.0-alpha.x). Be conservative with advanced VitePress APIs — prefer following patterns already in `.vitepress/`.
- Keep translations in sync: `en/` and `vi/` folder structures intentionally mirror one another. When adding or renaming pages, update both locales or confirm the intent.

## Files to consult directly
- `package.json` — scripts for dev/build/preview
- `.vitepress/config.mts` — routing, sidebar, locales, and search
- `.vitepress/theme/Layout.vue` — site-level client behavior (e.g., language cookie)
- `en/` and `vi/` — canonical content locations
- `public/assets/` — images and static assets

If any of the above is unclear or you'd like examples expanded (e.g., a template frontmatter for new pages or a checklist for adding translations), tell me which section to expand and I will iterate.
