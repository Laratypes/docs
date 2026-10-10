# Upgrading from 0.5

There is nothing to upgrade to yet: v1 is not on npm. This page describes what will change for a 0.5.4 application, area by area, and links to the guide page for each one. The step-by-step migration guide is planned in [#154](https://github.com/Laratypes/Laratype/issues/154).

v1 is a clean break. It keeps Laravel's ergonomics (route files, request classes, resources, policies, `sauf make:*`), but most of the APIs behind them change. Before you upgrade, an application will need:

- TypeScript 5.4 or later;
- zod 3.25 or later (the 0.5.4 example app uses `^3.23.8`), or another [Standard Schema](https://standardschema.dev) library;
- `verbatimModuleSyntax: true`, with `import type` for every type-only import.

The [Introduction › Requirements](./introduction#requirements) section explains why.

## Project layout <Status issue="125" />

A 0.5 application keeps its classes in `app/src/`. v1 drops the `src/` level, so controllers, models, policies and providers sit directly under `app/`. A new folder, `app/contracts/`, holds the contracts. See [Your first endpoint › Project structure](./first-endpoint#project-structure).

In 0.5 the runtime finds config, routes, providers and commands by their file paths. In v1 the [build manifest](./build#the-build-manifest) imports them statically.

## Contracts and routes <Status issue="104" />

Each endpoint is first declared in a [contract](./contracts): method, path, query, body, response and errors. Route files then connect a contract to a controller with `r.contract(users, UserController)`.

| 0.5 | v1 |
|---|---|
| The `RouteOptions` object tree | [Route files](./routing#route-files) with `r.contract()` |
| `Route.model` and `Route.bind` in a service provider | [`.bind()`](./model-binding#explicit-binding) on the route, and implicit binding |
| String abilities, `can('view', 'user')` | [`.can()`](./authorization#policies-on-routes) with typed abilities |

## Controllers and responses <Status issue="105" />

A handler is a class method typed with `Ctx`, and the route checks at compile time that it gets what it needs. See [Controllers](./controllers).

In 0.5 the status code is guessed from the controller method name. In v1 it comes from the contract, see [Responses › Status codes](./responses#status-codes). Errors are declared in the contract too, see [Exceptions](./exceptions).

## Requests <Status issue="137" />

In 0.5.4, a request class (`sauf make:request`) returns a zod schema from `rules()`. In v1 the rules come from the contract, and a [FormRequest](./validation#formrequest) only adds `authorize()` and `messages()`. Validation runs in the request pipeline and answers 422 with a field-by-field error bag, see [Validation](./validation).

## Resources <Status issue="123" />

In 0.5.4, `sauf make:resource` creates a `JsonResource` class whose `toJson()` returns `any`. In v1, `defineResource()` infers the output type and checks it against the contract. See [Responses › Resources](./responses#resources).

## Authentication and policies <Status issue="119" />

In 0.5.4 the user type is passed at each call, as in `Auth.user<User>()`. In v1 you declare it once in the `Register` interface. See [Authentication](./authentication) and [Authorization](./authorization).

## Dependency injection <Status issue="96" pr="196" />

0.5.4 has no DI container. v1 adds one: services reach controllers through constructor injection, without decorators for concrete classes. Interfaces and primitives need a token. Service providers register bindings and then boot the app, in two phases. See [Dependency injection](./dependency-injection) and [Service providers](./service-providers).

## Build scripts <Status issue="128" />

The 0.5.4 example app builds with `tsc -b ./tsconfig.build.json && sauf build`. In v1 the scripts become `"build": "sauf build"` and `"start": "node dist/index.js"`, and `tsc-alias` is no longer used. See [Build and deployment](./build) and [The sauf CLI](./cli).

## Frontend types <Status issue="133" />

In 0.5.4, `@laratype/ts-gen` is an empty package. In v1 the frontend gets its types from the contracts: through `createClient(appApi)` in a monorepo, or through the `api.ts` file that `sauf types:generate` writes for a separate repository. See [Client](./client) and [Type generation](./type-generation).

## Database <Status issue="88" />

0.5 uses TypeORM. The v1 model layer waits on the ORM decision ([#88](https://github.com/Laratypes/Laratype/issues/88)). A planned TypeORM adapter ([#150](https://github.com/Laratypes/Laratype/issues/150)) will let a 0.5 app keep its entities while it moves to v1. See [Database](./database).

## The migration guide <Status issue="154" />

The step-by-step guide will cover routes, requests, resources, DI, build scripts and the ORM path. It waits on the port of the example app to v1 ([#135](https://github.com/Laratypes/Laratype/issues/135)), which removes the 0.5 API from that app.
