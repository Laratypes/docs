# The sauf CLI

`sauf` is Laratype's command-line tool. It runs the dev server, builds the application, generates types for the frontend and creates new files from templates. The DI transform will live in this package too ([#194](https://github.com/Laratypes/Laratype/pull/194), in review).

This page covers the commands that v1 changes most: `sauf dev`, `sauf build`, `sauf types:generate` and the `make:*` generators. The [CLI spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/cli.md) lists every v1 command named so far. All of them are planned, and most are described on the page of their area:

| Command | What it does | Issue | Page |
|---|---|---|---|
| `sauf dev` | Dev server | [#126](https://github.com/Laratypes/Laratype/issues/126) | [sauf dev](#sauf-dev) |
| `sauf build` | Production build | [#128](https://github.com/Laratypes/Laratype/issues/128) | [sauf build](#sauf-build) |
| `sauf types:generate` | Writes `api.ts` for a frontend in another repository | [#133](https://github.com/Laratypes/Laratype/issues/133) | [sauf types:generate](#sauf-types-generate) |
| `sauf route:list` | Lists the route registry | [#104](https://github.com/Laratypes/Laratype/issues/104) | [Routing › Route registry](./routing#route-registry) |
| `sauf make:*` | Creates files from templates | [#134](https://github.com/Laratypes/Laratype/issues/134) | [make:* generators](#make-generators) |
| `sauf db:introspect` | Generates the `Database` interface from the schema | [#148](https://github.com/Laratypes/Laratype/issues/148) | [Database](./database) |
| `sauf db:seed` | Runs the seeders | [#149](https://github.com/Laratypes/Laratype/issues/149) | [Database](./database) |
| `sauf queue:work`, `queue:failed`, `queue:retry` | Queue worker and failed jobs | [#169](https://github.com/Laratypes/Laratype/issues/169) | [Queues](./queues#failed-jobs-and-the-worker) |
| `sauf schedule:run`, `schedule:work`, `schedule:list` | Scheduler | [#171](https://github.com/Laratypes/Laratype/issues/171) | [Task scheduling](./scheduling#running-the-scheduler) |
| `sauf storage:link` | Not described yet | [#168](https://github.com/Laratypes/Laratype/issues/168) | [Storage](./storage#testing-and-the-cli) |
| `sauf oauth:keys` | Generates the OAuth2 JWT keys | [#179](https://github.com/Laratypes/Laratype/issues/179) | [OAuth2 server](./oauth2#grants-and-the-token-guard) |
| `sauf oauth:client` | OAuth2 clients, including personal access clients | [#180](https://github.com/Laratypes/Laratype/issues/180) | [OAuth2 server](./oauth2#scopes-clients-and-consent) |

What happens to the 0.5 command `db:init`, which has no v1 issue, is not specified yet. Neither are the command that runs migrations ([#148](https://github.com/Laratypes/Laratype/issues/148)) and the command that purges expired OAuth2 tokens ([#180](https://github.com/Laratypes/Laratype/issues/180)).

Commands that you write yourself are covered in [Console commands](./console).

On `master`, `sauf` is still the 0.5 CLI. Everything on this page is planned.

## sauf dev <Status issue="126" />

`sauf dev` starts the development server and restarts it when a file changes. In 0.5 it runs Vite in SSR mode with SWC.

In v1 the dev server uses the same plugin chain as `sauf build` and the test preset (see [Build › One plugin chain](./build#one-plugin-chain)):

- The DI transform runs before SWC, so constructor injection works in dev the same way as in a build ([#102](https://github.com/Laratypes/Laratype/issues/102)).
- The app boots from the build manifest instead of scanning the file system at runtime ([#125](https://github.com/Laratypes/Laratype/issues/125)).
- `sauf dev` will watch `app/contracts/**` and regenerate the frontend types without a restart ([#142](https://github.com/Laratypes/Laratype/issues/142), see [Type generation › Watch mode](./type-generation#watch-mode)).
- `--strict-contract` turns on [strict contract mode](./controllers#strict-contract-mode) ([#157](https://github.com/Laratypes/Laratype/issues/157)).

Which 0.5 options carry over to v1 is not specified yet: `--port`, `--host`, and `--hmr`, which is on `master` but not in v0.5.4.

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

What happens in v1 to the other 0.5 generators is not specified yet ([#134](https://github.com/Laratypes/Laratype/issues/134)). Generators for the v1 services, such as jobs, events, listeners and mailables, are not specified either.
