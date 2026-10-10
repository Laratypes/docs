# Service providers

Service providers set up the application. In v1 each provider receives the [container](./dependency-injection), registers its bindings in `register()`, and uses them in `boot()`.

## Writing a provider <Status issue="99" pr="202" />

```ts
export class ClockServiceProvider extends ServiceProvider {
  register() {
    this.app.singleton(CLOCK, () => ({ now: () => new Date() }))
  }

  boot() {
    this.app.make(CLOCK).now()
  }
}
```

`this.app` is the container, not the Hono app. Boot runs in two phases:

1. **`register()`** runs on every provider, in order. Only add bindings here, because providers later in the list haven't registered yet.
2. **`boot()`** runs on every provider, in order, once all of them have registered. Every binding is available.

Both methods may be async. An error thrown in either one stops the boot.

A provider can also implement `down()` to clean up. Cleanups run in reverse order, so the last provider to boot is the first to shut down.

## Provider types <Status issue="99" pr="202" />

All three classes come from `@laratype/support`:

| Class | Use it for |
|---|---|
| `ServiceProvider` | Core bindings. Receives the container as `this.app`. |
| `AppServiceProvider` | Application setup that needs the HTTP app. `this.apps` is the Hono app, resolved from the `HTTP_APP` token. |
| `RouteAppServiceProvider` | Registering routes. Implement `routes()`. |

Code that needs the Hono app outside these classes resolves it with `app.make(HTTP_APP)`.

## How the application boots <Status issue="99" pr="202" />

`bootProviders(app, providers)` creates each provider with the container, runs all `register()` calls, then all `boot()` calls, and returns the `down()` cleanups in reverse order. The HTTP kernel and `sauf` commands both boot through it.

The kernel creates one container per process (`Serve.getContainer()`) and binds `HTTP_APP` in it.

Two limits apply while the work is in review:

- The kernel's container is created without the dependency registry, so it can only autowire classes whose constructors take no arguments. Switching it to `new Container({ deps: depsRegistry })` is part of [#102](https://github.com/Laratypes/Laratype/issues/102).
- `RouteAppServiceProvider` still stores routes in a global. They move into the container in [#114](https://github.com/Laratypes/Laratype/issues/114).

::: info Illustrative example
ServiceProvider v2 is in review in PR [#202](https://github.com/Laratypes/Laratype/pull/202). The example is type-checked against that pull request.
:::

```ts
import { Container, token } from '@laratype/core'
import { bootProviders, ServiceProvider } from '@laratype/support'

export interface Clock { now(): Date }
export const CLOCK = token<Clock>('clock')

export class ClockServiceProvider extends ServiceProvider {
  // register(): bindings only. Every provider registers before any provider boots.
  register() {
    this.app.singleton(CLOCK, () => ({ now: () => new Date() }))
  }

  // boot(): every binding from every provider is available here.
  boot() {
    this.app.make(CLOCK).now()
  }
}

export async function main() {
  const app = new Container()
  // Instantiates each provider with the container, runs all register(), then all boot(), in order.
  const downs = await bootProviders(app, [ClockServiceProvider])
  // Cleanups come back in reverse boot order.
  for (const down of downs) await down()
}
```

## Modules <Status issue="153" />

Large applications split by domain will be able to group providers and routes into modules. Modules are optional; an application made of plain providers keeps working.

```ts
export const BillingModule = defineModule({
  providers: [MailServiceProvider],
  routes: [billingRoutes],
  imports: [AuthModule],
})
```

- `providers` lists service provider classes.
- `routes` lists route groups, the values built with `Route.prefix(...).group(...)`.
- `imports` lists other modules.

How a module reaches the kernel is not settled yet: it may be discovered from `app/modules/` by the build manifest, or registered explicitly.

::: info Illustrative example
`defineModule` comes from the design in [#153](https://github.com/Laratypes/Laratype/issues/153). Its signature is not settled yet.
:::
