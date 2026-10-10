# Views

v1 plans a view layer in three steps: serving a Vite frontend ([#174](https://github.com/Laratypes/Laratype/issues/174)), typed pages over the Inertia protocol ([#181](https://github.com/Laratypes/Laratype/issues/181)) and server-side rendering ([#182](https://github.com/Laratypes/Laratype/issues/182)). 0.5 has no view layer.

The design comes from the [view spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/view.md) and the three issues, and it may still change.

## Serving a Vite SPA <Status issue="174" />

- **`vite()` helper:** in development it injects the Vite client and HMR. In production it reads `manifest.json` to write the asset tags.
- **Static files:** `public/` is served with `serveStatic`, and a fallback route serves the SPA.
- **Build:** `sauf build` also builds the frontend entry (see [Build and deployment](./build)).
- **Reference app:** the backend serves `examples/fullstack-vue` in development and in production ([#136](https://github.com/Laratypes/Laratype/issues/136)).

The package that holds `vite()` is not specified yet, and neither is where `public/` and the frontend entry sit in the project layout.

## Inertia pages <Status issue="181" />

The server side of the [Inertia](https://inertiajs.com) protocol: `X-Inertia` responses, the asset version check (409), partial reloads and shared props. The official `@inertiajs/vue3`, `@inertiajs/react` and `@inertiajs/svelte` adapters then work unchanged.

`definePage(name, propsSchema)` declares a page in the contract, and `page()` is its typed response. The page props are typed on the frontend.

::: info Illustrative example
Planned in [#181](https://github.com/Laratypes/Laratype/issues/181). None of this code runs today. The parameters of `page()` are not specified yet.
:::

```ts
import * as z from 'zod'
import { definePage } from '@laratype/contract' // package per #181, not final

export const showUser = definePage('Users/Show', z.object({ user: z.object({ id: z.number(), name: z.string() }) }))
```

How a page reaches the frontend types, next to `defineApi` and `AppApi` (see [Contracts › The API object](./contracts#the-api-object)) or separately, is not specified yet.

## SSR <Status issue="182" />

- **Entry:** a Vite SSR entry, loaded with `ssrLoadModule` in development and bundled in production.
- **Fallback:** when SSR fails, the page falls back to rendering on the client.
- **Examples** for Vue, React and Svelte.
