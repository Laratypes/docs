# Introduction

Laratype v1 keeps the parts of Laravel that make an API pleasant to write: route files, FormRequest, Resources, Policies, facades and the `sauf make:*` generators. It adds a dependency injection container and an explicit request pipeline, and it carries types from the contract all the way to the frontend client.

v1 is a clean break from 0.5. Code written for 0.5.4 needs changes to run on v1, and the migration guide is tracked in [#154](https://github.com/Laratypes/Laratype/issues/154). [Upgrading from 0.5](./upgrade) lists what will change.

Each section in this guide carries a badge. <Status available /> means the code is on Laratype's `master` branch, and its examples are type-checked there. <Status issue="83" /> means the design is decided but the code has not landed; the badge links to the issue, and to the pull request when one is open. Examples in planned sections are illustrative.

## How a v1 app fits together

A v1 application is organised around contracts:

1. **Contracts** (`app/contracts/users.ts`) declare each endpoint once: method, path, query, body, headers, response and the errors it can return. Schemas are ordinary [Standard Schema](https://standardschema.dev) values from zod, valibot or arktype. See [Contracts](./contracts).
2. **The API object** (`app/contracts/index.ts`) collects the contracts with `defineApi()`. This file is the only server module the frontend imports.
3. **Route files** (`app/routes/api.ts`) bind a contract to a controller with `r.contract(users, UserController)`. The router registers every endpoint of the contract.
4. **Controllers** are classes. Each handler is a method typed from its endpoint, and the route proves at compile time that its middleware provides what the handler needs.
5. **Services** reach controllers through constructor injection. The container builds concrete classes on its own, and interfaces are bound to typed tokens. See [Dependency injection](./dependency-injection).
6. **Service providers** register bindings and boot the application in two phases. See [Service providers](./service-providers).
7. **The frontend** calls the API through `createClient(appApi)`, with request and response types taken from the same contracts.

The router validates the query, body and headers against the contract before the handler runs, and invalid input becomes a 422 response with a field-by-field error bag. Route files, controllers, the pipeline and the client are planned; their pages arrive with the next part of this guide.

To see the pieces together, follow [Your first endpoint](./first-endpoint).

## Principles

- **Schemas are runtime values.** One contract object drives validation, handler types, the frontend client and OpenAPI. Types are inferred from schemas, never from decorators.
- **Decorators are for DI and the ORM only.** Routes, validation and responses are declared in contracts. Decorators appear only for `@Inject(token)`, for `@Injectable({ scope })` when a class needs a non-default scope, and for ORM entities.
- **Constructor injection without mandatory decorators.** A build transform records each constructor's dependencies, so concrete classes autowire. Interfaces and primitives need a token.
- **The frontend never imports server code.** It imports `app/contracts/index.ts` and nothing else. `@laratype/contract` and `@laratype/client` run in the browser.
- **The controller declares, the route proves.** A handler states what it requires in its type, and `r.contract()` checks that the route's middleware and bindings provide it.
- **One build pipeline.** `sauf dev`, `sauf build` and tests share the same plugin chain.

## Requirements

- **TypeScript 5.4 or later.** `@laratype/contract` uses `NoInfer` in its published types.
- **`verbatimModuleSyntax: true`.** Use `import type` for anything imported only as a type. An interface imported as a value breaks dependency injection, and the error looks different in Node, `vite build` and `sauf dev`. The TypeScript error TS1484 is the only check that catches it the same way everywhere.
- **A Standard Schema library**, such as zod 3.25 or later, valibot or arktype. With zod, write `import * as z from "zod"`. The named import `import { z }` defeats tree-shaking in zod 4 and makes the frontend bundle about three times larger.
- **Zod 4 coercion in contracts** needs the type argument: `z.coerce.number<number>()`. Plain `z.coerce.number()` has the input type `unknown`, which makes the client's query types `unknown` too.
- **Runtimes:** Node, Bun and Vercel. Other edge platforms come later ([#156](https://github.com/Laratypes/Laratype/issues/156), see [Build › Edge runtimes](./build#edge-runtimes)).

## Installation <Status issue="190" />

The v1 packages are not on npm yet. The release is tracked in [#190](https://github.com/Laratypes/Laratype/issues/190). To build an application today, use [Laratype 0.5.4](/v0.5/getting-started/introduction/quick-start).

## Packages

| Package | What it does in v1 |
|---|---|
| `@laratype/contract` | Endpoints, path params, the error catalog, contracts and the API object. Browser-safe, with no runtime dependencies. |
| `@laratype/core` | The DI container, tokens and the dependency registry. It has no dependency on HTTP. |
| `@laratype/support` | `ServiceProvider` and its two-phase boot. |
| `@laratype/http` | The router, the request pipeline, controllers and middleware. |
| `@laratype/validation` | FormRequest on top of Standard Schema. |
| `@laratype/client` | `createClient(appApi)` for the frontend. It depends only on `@laratype/contract`. |
| `@laratype/auth` | Guards, the typed `Register` and policies. |
| `@laratype/database` | The model layer. Its design waits on the ORM decision in [#88](https://github.com/Laratypes/Laratype/issues/88). |
| `sauf` | The CLI, the dev server, the build and the DI transform. |
| `laratype` | The kernel (`Serve`). |
