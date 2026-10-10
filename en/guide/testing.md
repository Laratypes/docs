# Testing

v1 plans a test preset for [Vitest](https://vitest.dev) in a new package, `@laratype/testing`. It is planned in [#131](https://github.com/Laratypes/Laratype/issues/131), and the [build spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/build.md#testing-preset) has only short design notes so far. The function names below come from there; their signatures are not specified yet.

## The Vitest preset <Status issue="131" />

By default Vitest compiles TypeScript with esbuild. esbuild doesn't run the DI transform and doesn't emit decorator metadata, so constructor injection and ORM entities would behave differently in tests than in the app.

`defineLaratypeConfig()` builds a Vitest config that uses the same [plugin chain](./build#one-plugin-chain) as `sauf dev` and `sauf build`:

::: info Illustrative example
Planned in [#131](https://github.com/Laratypes/Laratype/issues/131). None of this code runs today, and the options of `defineLaratypeConfig()` are not specified yet.
:::

```ts
// vitest.config.ts
import { defineLaratypeConfig } from '@laratype/testing' // package per #131, not final

export default defineLaratypeConfig()
```

## Test apps <Status issue="131" />

`createTestApp()` boots the application from the [build manifest](./build#the-build-manifest), the same way the server does. The test app provides:

- `app.swap()`. The spec names it but doesn't describe it yet;
- a typed `request()` for calling the app's endpoints. It is typed by `AppApi`, the type of the [API object](./contracts#the-api-object). The old `AppRouter` type is retired.

How `createTestApp()`, `app.swap()` and `request()` are called is not specified yet. The preset is done when the tests of the example app run through it.
