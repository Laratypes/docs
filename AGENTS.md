# AGENTS.md

Guidance for AI agents and contributors working on laratype.dev, the VitePress documentation site for Laratype (repo `Laratypes/docs`).

## Commands

- Install: `pnpm install` (the repo has `pnpm-lock.yaml`; CI-style installs use `pnpm install --frozen-lockfile`).
- Dev server with live reload: `pnpm docs:dev`.
- Build the static site: `pnpm docs:build`. Run it before every commit. It must pass.
- Preview a build: `pnpm docs:preview`.

## Layout

- VitePress `2.0.0-alpha.12` (pinned, alpha) with Vue 3. Follow the patterns already in `.vitepress/` and avoid advanced VitePress APIs.
- `.vitepress/config.mts`: site config, EN sidebar and nav, search (Algolia), rewrites, `srcExclude`.
- `vi/config.ts`: VI nav and sidebar (`defineAdditionalConfig`).
- `.vitepress/versions.ts`: the version dropdown and `isV05Path()`.
- `.vitepress/theme/`: `Layout.vue` (language cookie, version banner slot) and `components/` (`VersionBanner.vue`, `Status.vue`, `Planned.vue`).
- `en/` and `vi/`: page content. The two trees mirror each other; add, rename or remove pages in both.
- `public/assets/`: static files, referenced as `/assets/...` in Markdown, never as `public/assets/...`.
- `snippets/`: code included into pages with `<<< @/snippets/...`. It is excluded from routing. `snippets/v1/` is a verbatim copy of `docs/v1/examples` from the Laratype repo, refreshed with `node scripts/sync-v1-snippets.mjs <path-to-Laratype> [ref]` (it records the source SHA in `snippets/v1/SOURCE.txt`). Never edit it by hand.

## Locales and URLs

- **EN is at the root.** `rewrites: { 'en/:rest*': ':rest*' }` serves `en/x.md` at `/x`. EN links have no `/en` prefix.
- **VI is under `/vi`.** `vi/x.md` is served at `/vi/x`, and VI links keep the `/vi` prefix.
- Sidebars set a `base` (for example `/v0.5/getting-started/essentials/http/`) and item `link`s are relative names (`routing`). Put the Markdown file in the directory that matches the `base`.

## Content versions

- **v1 is the default.** It lives at the root: `en/index.md`, `en/guide/**` (`/`, `/guide/`) and `vi/index.md`, `vi/guide/**` (`/vi/`, `/vi/guide/`). v1 is in development and not on npm yet.
  - The source of truth is the Laratype spec (`docs/v1/<area>.md` in `Laratypes/Laratype`). A page never adds API the spec doesn't have; ask PM about gaps.
  - Pages cover the whole planned v1. Each section heading ends with a badge: `<Status available />` (code on Laratype `master` only; examples included from `snippets/v1/<area>/`) or `<Status issue="N" pr="M" />` (planned; `pr` names an open code PR). Examples from `snippets/v1/<area>/proposed/` and hand-written planned code sit under a `::: info Illustrative example` box. Database/ORM gets a placeholder until S5 (Laratypes/Laratype#88).
  - When a code PR merges: re-sync the snippets, change that section's badge to `<Status available />`, move its include from `proposed/` to the area folder (the Laratype repo moves the file in the same PR), and drop the illustrative box.
- **0.5.4 is an archive** at `en/v0.5/**` (`/v0.5/`) and `vi/v0.5/**` (`/vi/v0.5/`). It documents the current npm release. Its internal links use `/v0.5/` and `/vi/v0.5/` paths.
- A route-based banner on every page (`VersionBanner.vue`) points v1 readers to the archive and archive readers back to v1. The version dropdown has two entries: v1 (in development) → `/` and v0.5.4 → `/v0.5/`.
- Both versions are indexed by search.
- Never put v1 pages under `/getting-started/`, `/api/`, `/vi/getting-started/`, `/vi/api/` or `/en/`. `vercel.json` permanently redirects those paths to the 0.5.4 archive, so such a page would be unreachable in production.

## Branches and PRs

- The remote has a branch named `docs`, so `docs/*` branch names cannot exist here.
  - Use `v1/<id>-<slug>` for v1 pages.
  - Use `site/<id>-<slug>` for 0.5 content and site fixes.
- PR descriptions reference the tracking issue in the main repo (`Refs Laratypes/Laratype#N`) and follow the section layout of `Laratypes/Laratype`'s `.github/pull_request_template.md`.
- **A merge to `main` deploys to production immediately.** Only the user merges.

## Writing

- Keep technical claims checked against the Laratype source for the documented version. When something looks wrong and you can't verify it, flag it in the PR instead of rewriting it.
- Prose changes must not touch code fences, inline code, link targets or frontmatter unless the change is a technical fix.
