# Build and deployment

v1 builds an application with one command, `sauf build`, and the result runs with plain `node dist/index.js`. The dev server, the build and the tests share one plugin chain, so dependency injection and decorators behave the same way in all three.

On `master` the build is still the 0.5 one: `tsc -b tsconfig.build.json` compiles the app, then `sauf build` copies the entry files and runs `tsc-alias`. The runtime finds config, routes, providers and commands by their file paths, which prevents bundling. Everything on this page is planned, and the details are design notes from the [build spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/build.md) and its issues. They may still change.

Once v1 is released, an app's scripts become:

```json
{
  "scripts": {
    "build": "sauf build",
    "start": "node dist/index.js"
  }
}
```

## The build manifest <Status issue="125" />

The manifest is a virtual module, `virtual:laratype/app`. It imports the app's providers, config files, routes, commands, models, migrations and seeders with static imports, so a bundler can follow them.

It replaces the runtime path discovery of 0.5. You don't register route files or providers in a list: the manifest finds them in the [project structure](./first-endpoint#project-structure). The dev server boots from the manifest too.

## One plugin chain <Status issue="126" />

`sauf dev`, `sauf build` and the [test preset](./testing) use the same plugins, in this order:

```
laratype:manifest  →  laratype:di  →  swc  →  alias
```

| Plugin | What it does |
|---|---|
| `laratype:manifest` | Builds the manifest above ([#125](https://github.com/Laratypes/Laratype/issues/125)). |
| `laratype:di` | Runs the [DI transform](./dependency-injection#how-constructor-injection-works) before SWC and keeps the source maps. It works with the dev server's restart ([#102](https://github.com/Laratypes/Laratype/issues/102)). |
| `swc` | Compiles decorators. It keeps `decoratorMetadata: true` while the ORM is TypeORM ([#88](https://github.com/Laratypes/Laratype/issues/88)). |
| `alias` | Resolves the `tsconfig` paths in the bundler, so `tsc-alias` is no longer needed. |

The chain is one function, `laratypePlugins()`. The goal is the same DI metadata in dev and in a build.

## Type checking <Status issue="127" />

Bundlers don't type-check, so the first step of `sauf build` runs `tsc --noEmit`. A type error fails the build. `--no-typecheck` skips this step.

## Bundling <Status issue="128" />

The second step bundles the app with Vite in SSR mode, through the plugin chain:

- The output is `dist/server.js` and `dist/cli.js`.
- Dependencies stay external, so `node_modules` must be present at runtime. [Standalone builds](#standalone-builds) change that.
- Source maps are written.

## Verifying the app <Status issue="129" />

The third step boots the app without listening and without connecting to a database. It checks:

- the DI graph, with the [boot-time checks](./dependency-injection#boot-time-checks) of the container ([#113](https://github.com/Laratypes/Laratype/issues/113));
- the [route registry](./routing#route-registry);
- model bindings;
- policies.

A missing binding fails the build with a clear message, so the error shows up before deployment.

## Generating types <Status issue="133" />

The fourth step runs `sauf types:generate`, which writes `api.ts` for the frontend and `openapi.json`. An error here fails the build. See [Type generation](./type-generation).

## Node and Bun <Status issue="130" />

The last step writes the entry for the platform chosen with `--platform`:

- `node`: reuses the 0.5 Node adapter;
- `bun`: a new Bun adapter.

The entry is `dist/index.js`. In v0.5.4, `--platform` exists but only `node` is supported.

## Heroku <Status issue="172" />

Heroku runs a plain Node process, so the app is built with `--platform node`. The Node adapter will listen on `0.0.0.0:$PORT` when `PORT` is set, and on `HOST` when that is set. A `Procfile` starts the web process:

```
web: node dist/index.js
```

The issue also plans a worker process for the queue ([#169](https://github.com/Laratypes/Laratype/issues/169)) and migrations in Heroku's release phase ([#148](https://github.com/Laratypes/Laratype/issues/148)). Neither has a spec yet.

## Vercel <Status issue="173" />

`--platform vercel` writes Vercel's Build Output API layout (`.vercel/output`). The app runs as a Node function through Hono's `hono/vercel` adapter, and static assets are included.

- Scheduled tasks run through Vercel Cron, which calls a `schedule:run` route protected by a secret. The scheduler is specified later ([#171](https://github.com/Laratypes/Laratype/issues/171)).
- A function can't host a long-running queue worker.
- Database connections need pooling.

## Standalone builds <Status issue="155" />

`sauf build --standalone` bundles the dependencies into the output as well, except native modules. The app then runs without `node_modules`, which keeps Docker images small. This is in the last milestone (M4).

## Edge runtimes <Status issue="156" />

Hono already runs on Cloudflare and Deno. Adapters for them, and providers that are safe on the edge, are planned for the last milestone (M4). Before that, v1 targets Node, Bun and Vercel only. The option names for these platforms are not specified yet.

## Bun DI plugin <Status issue="116" />

This section and the next one are about how the framework's own packages are built. An application doesn't configure either of them.

The framework packages are built with Bun (`bun.build.js`). The same DI transform will run there as a Bun plugin, so framework classes that the container resolves also work from the published `dist/` files.

## Browser targets and bundle budget <Status issue="132" />

`@laratype/contract` and `@laratype/client` run in the browser. They are built with `target: 'browser'` and `sideEffects: false`, and CI will check them:

- no `node:*` imports;
- the runtime of the client and the contract packages stays **under 5 kB gzip**, not counting the schema library you choose (see [Client › Creating a client](./client#creating-a-client));
- a frontend fixture type-checks against the built `dist/`.

The source of `@laratype/contract` is already checked for browser safety on `master`: a test compiles it with only the `ES2022` and `DOM` libraries and no Node types.
