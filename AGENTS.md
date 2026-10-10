# AGENTS.md

Guidance for AI agents and contributors working on laratype.dev, the VitePress documentation site for Laratype (repo `Laratypes/docs`).

## Commands

- Install: `pnpm install` (the repo has `pnpm-lock.yaml`; CI-style installs use `pnpm install --frozen-lockfile`).
- Dev server with live reload: `pnpm docs:dev`.
- Build the static site: `pnpm docs:build`. Run it before every commit. It must pass.
- Preview a build: `pnpm docs:preview`.

## Layout

- VitePress `2.0.0-alpha.12` (pinned, alpha) with Vue 3. Follow the patterns already in `.vitepress/` and avoid advanced VitePress APIs.
- `.vitepress/config.mts`: site config, EN sidebar and nav, search (Algolia), rewrites, `srcExclude`, `transformHead`.
- `vi/config.ts`: VI nav and sidebar (`defineAdditionalConfig`).
- `.vitepress/versions.ts`: the version dropdown and the `SHOW_V1_NEXT` flag.
- `.vitepress/theme/`: `Layout.vue` (language cookie, Unreleased banner slot) and `components/` (`UnreleasedBanner.vue`, `Planned.vue`).
- `en/` and `vi/`: page content. The two trees mirror each other; add, rename or remove pages in both.
- `public/assets/`: static files, referenced as `/assets/...` in Markdown, never as `public/assets/...`.
- `snippets/`: code included into pages with `<<< @/snippets/...`. It is excluded from routing. v1 snippets are synced from the Laratype repo and are never edited by hand.

## Locales and URLs

- **EN is at the root.** `rewrites: { 'en/:rest*': ':rest*' }` serves `en/x.md` at `/x`. EN links have no `/en` prefix.
- **VI is under `/vi`.** `vi/x.md` is served at `/vi/x`, and VI links keep the `/vi` prefix.
- Sidebars set a `base` (for example `/getting-started/essentials/http/`) and item `link`s are relative names (`routing`). Put the Markdown file in the directory that matches the `base`.

## Content versions

- The current content documents Laratype **0.5.4**, which is the default version everywhere.
- **v1 "next"** lives in `en/next/**` (`/next/`) and `vi/next/**` (`/vi/next/`). It has its own sidebar keys, `'/next/'` and `'/vi/next/'`.
  - Every next page gets the Unreleased banner automatically (route-based) and a `noindex` meta tag, so it stays out of Algolia and search engines.
  - A next page documents a feature only when its section in the Laratype spec (`docs/v1/<area>.md` in `Laratypes/Laratype`) has Status `merged @ <sha>`. Unmerged features get only `<Planned issue="N" />`, with no signatures.
  - Nothing links to `/next/` until `SHOW_V1_NEXT` in `.vitepress/versions.ts` is set to `true` (planned for DOC6, Laratypes/Laratype#211).

## Branches and PRs

- The remote has a branch named `docs`, so `docs/*` branch names cannot exist here.
  - Use `v1/<id>-<slug>` for v1 pages.
  - Use `site/<id>-<slug>` for 0.5 content and site fixes.
- PR descriptions reference the tracking issue in the main repo (`Refs Laratypes/Laratype#N`) and follow the section layout of `Laratypes/Laratype`'s `.github/pull_request_template.md`.
- **A merge to `main` deploys to production immediately.** Only the user merges.

## Writing

- Keep technical claims checked against the Laratype source for the documented version. When something looks wrong and you can't verify it, flag it in the PR instead of rewriting it.
- Prose changes must not touch code fences, inline code, link targets or frontmatter unless the change is a technical fix.
