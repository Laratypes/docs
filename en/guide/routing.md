# Routing

Routes connect contracts to controllers. You write them in route files, as in Laravel, and the router registers them on [Hono](https://hono.dev). Router v2 replaces the 0.5 `RouteOptions` object tree.

The router will live in `@laratype/http`. All of it is planned; the main issue is [#104](https://github.com/Laratypes/Laratype/issues/104).

::: info Illustrative example
The examples follow the design notes and the S1 spike shapes in the [HTTP spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md). None of this code runs today, and names may change. They use the `users` contract and `UserController` from [Controllers](./controllers).
:::

## Route files <Status issue="104" />

API routes go in `app/routes/api.ts`. A route file starts from `Route`, sets a prefix for a group (and, if needed, `.middleware(...)` for the whole group), and lists the routes inside it:

```ts
// app/routes/api.ts
import { Route } from '@laratype/http'
import { auth } from '@laratype/auth'
import { users } from '../contracts/users'
import { UserController } from '../http/controllers/UserController'
import { User } from '../models/User'

export const api = Route.prefix('/api').group((r) => [
  r.middleware(auth()).bind({ user: User }).contract(users, UserController),
  r.get('/health', () => 'ok'),
])
```

The build manifest imports route files statically, so there is nothing to register by hand ([#125](https://github.com/Laratypes/Laratype/issues/125)).

## Registering a contract <Status issue="104" />

`r.contract(contract, Controller)` registers every endpoint of the contract, with the method and path from the contract. Each endpoint calls the controller method with the same key, so `users.show` calls `UserController.show`.

What comes before `.contract()` applies to all of the contract's endpoints:

| Call | What it adds |
|---|---|
| `.middleware(...m)` | Middleware, and the context keys they add (see [Middleware](./middleware#typed-middleware)) |
| `.bind({ key: Model })` | Model binding for a path param (see [Model binding](./model-binding)) |
| `.can({ endpoint: [ability, param] })` | A policy check per endpoint, planned in [#122](https://github.com/Laratypes/Laratype/issues/122) (see [Authorization › Policies on routes](./authorization#policies-on-routes)) |

`.contract()` then checks the controller against everything the chain provides, at compile time. A handler that asks for `user` on a route without `auth()` does not compile. The checks and their error messages are listed in [Controllers › Route proof](./controllers#route-proof).

The chain shown here follows the S1 spike. Its exact order is not settled yet ([#104](https://github.com/Laratypes/Laratype/issues/104), [#105](https://github.com/Laratypes/Laratype/issues/105)). Middleware for only some endpoints of one contract is not settled either ([#117](https://github.com/Laratypes/Laratype/issues/117)).

## Route registry <Status issue="104" />

Every registered route becomes an entry in the route registry, with its name (`users.show`), method, path, endpoint definition, controller and middleware.

- `sauf route:list` prints the registry.
- OpenAPI generation ([#143](https://github.com/Laratypes/Laratype/issues/143)) and Detective ([#144](https://github.com/Laratypes/Laratype/issues/144)) read it too.
- The registry is a container service, `RouteRegistry` ([#114](https://github.com/Laratypes/Laratype/issues/114)), instead of the 0.5 global `__laratype_routes`.

## Ad-hoc routes <Status issue="139" />

A route without a contract keeps the quick Laravel style:

```ts
r.get('/health', () => 'ok')
```

Its types are inferred from the handler. Because there is no schema, the route is left out of OpenAPI. It is not part of `appApi` either, so the typed client knows nothing about it.

## Route names and URLs <Status issue="162" />

Every contract endpoint has a route name, `<contract>.<endpoint>`, which comes from `defineApi` (see [Contracts › Defining a contract](./contracts#defining-a-contract)). Named URLs are planned:

- `route('users.show', { user })` builds the URL for a route name. The params are typed from the path.
- `redirect().route('users.show', { user })` answers with a redirect to it.
- A bound param accepts a model, which gives its route key.
- Ad-hoc routes get a name with `.name()`.
- Absolute URLs start with `config('app.url')`.

`route()` would share its URL builder with the frontend client. That builder would live in `@laratype/contract`, and its signature is not final (see [Contracts › Building URLs](./contracts#building-urls)).

## CORS <Status issue="164" />

`cors()` is a built-in middleware that wraps `hono/cors`. It is registered as global middleware by default and answers preflight requests for contract routes.

It reads a typed config file, `app/config/cors.ts` (see [Configuration](./configuration)). The config covers paths, allowed origins, methods and headers, exposed headers, max age and credentials. The options mirror `hono/cors`, but their key names are not settled yet.
