# The sauf CLI

`sauf` is Laratype's command-line tool. It runs the dev server, builds the application, generates types for the frontend and creates new files from templates. The package also holds the DI transform.

This page covers the commands that v1 changes: `sauf dev`, `sauf build`, `sauf types:generate` and the `make:*` generators. The full v1 command list is not specified yet. It will come with the CLI spec ([#219](https://github.com/Laratypes/Laratype/issues/219)). Console commands of your own, queues, the scheduler and the other services are covered there too. Some commands belong to one area and are described on its page, such as `sauf route:list` in [Routing › Route registry](./routing#route-registry).

On `master`, `sauf` is still the 0.5 CLI. Everything on this page is planned.

## sauf dev <Status issue="126" />

`sauf dev` starts the development server and restarts it when a file changes. In 0.5 it runs Vite in SSR mode with SWC.

In v1 the dev server uses the same plugin chain as `sauf build` and the test preset (see [Build › One plugin chain](./build#one-plugin-chain)):

- The DI transform runs before SWC, so constructor injection works in dev the same way as in a build ([#102](https://github.com/Laratypes/Laratype/issues/102)).
- The app boots from the build manifest instead of scanning the file system at runtime ([#125](https://github.com/Laratypes/Laratype/issues/125)).
- `sauf dev` will watch `app/contracts/**` and regenerate the frontend types without a restart ([#142](https://github.com/Laratypes/Laratype/issues/142), see [Type generation › Watch mode](./type-generation#watch-mode)).

The v1 options of `sauf dev` are not specified yet.

## sauf build <Status issue="128" />

`sauf build` turns the application into a production bundle in `dist/`. It type-checks, bundles, verifies that the app can boot, generates types and writes the entry for the target platform. Each step is described in [Build and deployment](./build).

The options named so far:

| Option | What it does | Issue |
|---|---|---|
| `--no-typecheck` | Skips the `tsc --noEmit` step | [#127](https://github.com/Laratypes/Laratype/issues/127) |
| `--platform node`, `--platform bun` | Writes the entry for Node or Bun | [#130](https://github.com/Laratypes/Laratype/issues/130) |
| `--platform vercel` | Writes the Vercel build output | [#173](https://github.com/Laratypes/Laratype/issues/173) |
| `--standalone` | Bundles the dependencies too | [#155](https://github.com/Laratypes/Laratype/issues/155) |

In v0.5.4, `sauf build` accepts only `--platform node`. The app's build script runs `tsc -b` first, and `sauf build` then copies the entry files and runs `tsc-alias`. v1 replaces this with the single `sauf build`.

## sauf types:generate <Status issue="133" />

`sauf types:generate` writes one `api.ts` file for a frontend that lives outside the monorepo. `sauf build` runs it as one of its steps. See [Type generation](./type-generation).

## make:* generators <Status issue="134" />

The `make:*` commands create a file from a template. v0.5.4 has these generators:

`make:command`, `make:controller`, `make:factory`, `make:gate`, `make:middleware`, `make:model`, `make:policy`, `make:request`, `make:resource`, `make:seeder`

For v1, [#134](https://github.com/Laratypes/Laratype/issues/134) plans these changes:

- a new `make:contract` generator;
- the controller, request and resource templates move to the v1 API: [controllers](./controllers) typed with `Ctx`, [FormRequest](./validation#formrequest) built on a contract, and typed [resources](./responses#resources);
- the generated files type-check in the example app.

Templates that contain schemas follow two rules from the contract work ([#91](https://github.com/Laratypes/Laratype/issues/91), [#85](https://github.com/Laratypes/Laratype/issues/85)):

- They import zod as `import * as z from "zod"`. With zod 4, `import { z } from "zod/v4"` makes the frontend bundle about three times larger (about 47 KiB gzip instead of 16 KiB). For frontend bundles, `zod/v4-mini` is smaller still (about 8.3 KiB).
- They write `z.coerce.number<number>()`. Plain `z.coerce.number()` has the input type `unknown` in zod 4, so the client's types become `unknown` too.

What happens to the other generators in v1 is not specified yet. It is part of the CLI spec ([#219](https://github.com/Laratypes/Laratype/issues/219)).
