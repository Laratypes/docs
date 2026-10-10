# Your first endpoint

This page follows one endpoint from its contract to its controller and route. Contracts are partly available; controllers and routes are planned, so the code below shows the decided design and its names may still change.

::: info Illustrative example
`defineContract` and `defineApi` are in review in PR [#204](https://github.com/Laratypes/Laratype/pull/204). Controllers ([#105](https://github.com/Laratypes/Laratype/issues/105)) and the router ([#104](https://github.com/Laratypes/Laratype/issues/104)) are planned. None of this code runs today.
:::

## Project structure <Status issue="125" />

A 0.5 application keeps its classes in `app/src/`. v1 drops the `src/` level, so controllers, models and providers sit directly under `app/`. The planned layout:

```
app/
  contracts/        shared with the frontend (index.ts holds defineApi)
  http/
    controllers/
    middleware/
    requests/
    resources/
  models/
  policies/
  providers/
  modules/          optional
  routes/
    api.ts
    console.ts
  config/           typed config files
database/
  migrations/
  factories/
  seeders/
```

At build time the manifest step scans `app/` and imports providers, config, routes, commands, models, migrations and seeders statically ([#125](https://github.com/Laratypes/Laratype/issues/125)). Nothing is discovered from the file system at runtime.

## 1. Declare the contract <Status issue="93" pr="204" />

```ts
// app/contracts/users.ts
import * as z from 'zod'
import { defineContract, endpoint, errors } from '@laratype/contract'

const UserDto = z.object({ id: z.number(), name: z.string(), email: z.string().email() })

export const users = defineContract('users', {
  index: endpoint.get('/users').query(z.object({ page: z.coerce.number<number>().default(1) })).response(z.array(UserDto)),
  show: endpoint.get('/users/:user').response(UserDto).errors(errors.notFound),
})
```

Then add it to the API object:

```ts
// app/contracts/index.ts
import { defineApi } from '@laratype/contract'
import { users } from './users'

export const appApi = defineApi({ users })
export type AppApi = typeof appApi
```

See [Contracts](./contracts) for every builder call and rule.

## 2. Write the controller <Status issue="105" />

A controller is a class with one method per endpoint. Each method types its argument with `Ctx<typeof endpoint>`, and dependencies arrive through the constructor:

```ts
// app/http/controllers/UserController.ts
export class UserController implements ControllerOf<typeof users> {
  constructor(private readonly repo: UserRepository) {}

  async index({ query }: Ctx<typeof users.index>) {
    return this.repo.list(query.page)
  }
}
```

- `query` and `body` hold validated values, typed with the schema's output, so `query.page` is a `number`.
- The method returns data shaped like the response schema. To answer with an error, it returns `fail(errors.notFound, { message: 'User not found' })`, and only for errors the endpoint declares.
- `implements ControllerOf<typeof users>` is optional. With it, a missing handler or a wrong return type is reported on the method; without it, on the route.
- The `Ctx` annotation is required, because `implements` doesn't type method parameters.

## 3. Register the route <Status issue="104" />

```ts
// app/routes/api.ts
Route.prefix('/api').group((r) => [
  r.contract(users, UserController),
])
```

`r.contract()` registers every endpoint of the contract. It also checks the controller at compile time: every endpoint needs a handler, and each handler gets what it asks for from the route's middleware and bindings. The checks and their error messages are listed in [Controllers › Route proof](./controllers#route-proof), and the route file in [Routing](./routing).

## 4. Call it from the frontend <Status issue="109" />

The frontend creates a client from `appApi` with `createClient(appApi)` and calls endpoints by name, such as `users.show`. The request and response types come from the same contract. The client API is planned in [#109](https://github.com/Laratypes/Laratype/issues/109).
