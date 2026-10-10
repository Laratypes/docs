# Controllers

A controller is a class with one method per endpoint of a contract. Each method declares what it needs from the request, and the route that registers the controller proves at compile time that it provides those things.

Controllers, `Ctx` and `ControllerOf` will live in `@laratype/http`. The typing was decided in the S1 spike ([#84](https://github.com/Laratypes/Laratype/issues/84)) and the code is planned in [#105](https://github.com/Laratypes/Laratype/issues/105). The helper type names may still be refined there.

::: info Illustrative example
Every example on this page follows the S1 spike reference shapes in the [HTTP spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md). None of this code runs today.
:::

The examples on the HTTP pages use this contract, which extends the one from [Your first endpoint](./first-endpoint):

```ts
// app/contracts/users.ts (UserDto and CreateUser are zod object schemas)
export const users = defineContract('users', {
  index: endpoint.get('/users').query(z.object({ page: z.coerce.number<number>().default(1) })).response(z.array(UserDto)),
  show: endpoint.get('/users/:user').response(UserDto).errors(errors.notFound),
  store: endpoint.post('/users').body(CreateUser).response(UserDto, 201).errors(errors.validation),
  destroy: endpoint.delete('/users/:user').errors(errors.notFound, errors.forbidden),
})
```

## Handlers and `Ctx` <Status issue="105" />

A handler is a class method. Its first parameter is the request context, annotated with `Ctx<typeof contract.endpoint, Requires>`:

```ts
// app/http/controllers/UserController.ts
import { type Ctx, type ControllerOf } from '@laratype/http' // package per #105, not final
import { users } from '../../contracts/users'

export class UserController implements ControllerOf<typeof users> {
  constructor(private readonly repo: UserRepository) {}

  async index({ query }: Ctx<typeof users.index>) {
    return this.repo.list(query.page)
  }

  async show({ params }: Ctx<typeof users.show, { params: { user: User } }>) {
    return params.user
  }

  // store() and destroy() are shown further down
}
```

The context has these fields:

| Field | Type |
|---|---|
| `params` | The path params, typed from the path string |
| `query` | The validated query, typed with the schema's **output** |
| `body` | The validated body, typed with the schema's **output** |
| `endpoint` | The endpoint definition (see [below](#the-endpoint-field)) |

`query` and `body` use the output type because they hold values after validation, with coercion and defaults applied.

The second type argument, `Requires`, lists what the handler needs **from the route**: the keys that middleware adds (for example `user` from `auth()`) and params resolved by [model binding](./model-binding). `Requires` is merged into the context, and its `params` are merged one level deep, so `params.user` above is a `User` instead of a `string`.

The annotation is required. `implements` does not give types to method parameters (TypeScript [#23911](https://github.com/microsoft/TypeScript/issues/23911)), so without it the parameter would be `any`.

At runtime the framework always calls the handler as `instance[key](ctx)`, so `this` works inside it.

## Return values and `fail` <Status issue="105" />

A handler returns data in the shape of the endpoint's response schema. It returns the schema's **input** type, because the response is serialized after the handler runs. An endpoint without a response schema returns nothing.

```ts
// inside UserController
async store({ body }: Ctx<typeof users.store>) {
  return this.repo.create(body)
}
```

The status comes from the contract: `store` answers `201` because its response is declared with `.response(UserDto, 201)`. The default is `200`, or `204` when the endpoint has no response schema ([#107](https://github.com/Laratypes/Laratype/issues/107)).

To answer with an error, the handler returns `fail(errorDef, body)`:

```ts
import { type Ctx, fail } from '@laratype/http' // package per #105, not final
import { errors } from '@laratype/contract'

// inside UserController
async destroy({ params, user }: Ctx<typeof users.destroy, { params: { user: User }; user: User }>) {
  if (user.role !== 'admin') return fail(errors.forbidden, { message: 'Only admins can delete users' })
  await this.repo.delete(params.user)
}
```

- `fail` only accepts errors the endpoint declares in `.errors()`. Returning an undeclared error is a type error.
- The body is typed from the error definition, so `errors.forbidden` needs `{ message }`.
- `fail` will sit next to `Ctx`, probably in `@laratype/http`. Its package is not settled yet.

The [error catalog](./contracts#errors) lists the built-in errors. How thrown exceptions turn into responses is planned in [#108](https://github.com/Laratypes/Laratype/issues/108) and is covered in [Exceptions](./exceptions). The status and body of a successful response are covered in [Responses and resources](./responses).

## `ControllerOf` <Status issue="105" />

`implements ControllerOf<typeof users>` is optional. It changes where mistakes are reported:

- **With it,** a missing handler or a wrong return type is reported on the method.
- **Without it,** the same mistakes are reported where the route calls `r.contract()`.

Either way the code does not compile. `ControllerOf<C>` maps each endpoint key of `C` to a method that takes a context and returns the endpoint's result, or a promise of it.

## Constructor injection <Status issue="105" />

The router resolves controllers from the container (`app.make(UserController)`) instead of calling `new`. Constructor parameters are injected with the [DI transform](./dependency-injection#how-constructor-injection-works), so `UserController` above gets its `UserRepository` without a decorator.

If a controller depends on a request-scoped provider, the controller becomes request-scoped too ([#112](https://github.com/Laratypes/Laratype/issues/112)).

## The `endpoint` field <Status issue="105" />

`ctx.endpoint` holds the endpoint the request matched, typed as that endpoint. A runtime value would be useful to interceptors and logging. Whether the field exists at runtime or only in the types is an open question in [#105](https://github.com/Laratypes/Laratype/issues/105).

## Route proof <Status issue="105" />

The controller declares what it needs, and the route proves it. When the route registers a controller with `r.contract()`, it computes what it provides to each endpoint:

```
Provided = Ctx<endpoint, middleware extensions & { params: bound params }>
```

- The middleware extensions are the keys added by every middleware on the route, in order (see [Middleware](./middleware#typed-middleware)).
- The bound params are the [`.bind()`](./model-binding) entries that are path params of that endpoint. A class binder gives an instance of the class. A resolver gives its non-null return value, because a miss is a 404.

Then it checks each handler:

- **Requirements:** what the route provides must cover the handler's `Ctx` parameter. The check only goes one way, so a handler that needs `user` on a route without `auth()` fails.
- **Return type:** the handler's return value must match the response schema or a declared error.
- **Exhaustiveness:** every endpoint needs a handler.
- **Endpoint match:** a handler typed for a different endpoint fails.
- **Bindings:** every `.bind()` key must be a path param of some endpoint in the contract.

Nothing here is checked again at runtime.

### Error messages

The errors name the route (`<contract>.<endpoint>`) and the key at fault. These are the message templates from the S1 spike; the final wording comes with [#105](https://github.com/Laratypes/Laratype/issues/105):

| Message | Cause |
|---|---|
| `` users.destroy: handler requires `user`, route does not provide it (add middleware / .bind()) `` | The handler's `Ctx` asks for a key that no middleware or binding adds |
| `` users.show: `params.user` provided by the route does not match the handler (missing .bind()?) `` | The route provides the key with another type, for example a `string` param where the handler wants a `User` |
| `users.show: handler ctx is typed for a different endpoint` | The method is annotated with another endpoint's `Ctx` |
| `users.show: return type does not match the response schema / declared errors` | The return value fits neither the response nor a declared error |
| `users.store: controller has no handler for this endpoint` | A method is missing |
| `` .bind(): `post` is not a path param of any endpoint in users `` | A binding key that no path uses |

The key may be nested, like `params.user`. TypeScript prints these messages as property names of the type it expected, because it prints names in full and shortens long types.

Per-endpoint middleware inside one contract (for example `auth()` on `destroy` only) is not settled yet. It is tracked in [#105](https://github.com/Laratypes/Laratype/issues/105) and [#117](https://github.com/Laratypes/Laratype/issues/117).

## Strict contract mode <Status issue="157" />

A planned development mode, `--strict-contract`, keeps contracts honest at runtime. It warns or fails when a thrown error is not declared in the endpoint's `.errors()`, or when a handler's output does not match the response schema. It depends on the exception handling in [#108](https://github.com/Laratypes/Laratype/issues/108).

It is a flag of the dev server, `sauf dev --strict-contract` (see [The sauf CLI › sauf dev](./cli#sauf-dev)). When it warns and when it fails is not specified yet.
