# Configuration

Typed configuration and a validated environment are planned for v1, in `@laratype/core`.

::: info Illustrative example
The calls on this page come from the design in [#152](https://github.com/Laratypes/Laratype/issues/152). Their exact signatures are not settled yet.
:::

## Config files <Status issue="152" />

Config files live in `app/config/` and are written with `defineConfig(...)`, one file per area (for example `app/config/database.ts`). The build manifest collects them, so there is no list to maintain.

## Reading config values <Status issue="152" />

`config()` reads a value by its dot path, and the type is inferred from the path:

```ts
config('database.default')
```

The type comes from the config files themselves. How that type is registered (a generated declaration file or a `declare module` block) is not settled yet.

## Validating the environment <Status issue="152" />

`defineEnv()` takes a schema for the environment variables, and the application validates the environment against it at boot:

```ts
defineEnv(z.object({ /* one entry per variable */ }))
```

An invalid environment stops the boot instead of failing later, while a request is being handled. Which file holds `defineEnv` and what the error output looks like are not settled yet.
