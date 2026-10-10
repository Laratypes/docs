# Model binding

Path params arrive as strings. Model binding turns a param such as `:user` into the model it names before the handler runs, and answers 404 when there is no match. The handler then types the param as the model in its `Ctx`.

Binding is part of the router in `@laratype/http`. It depends on the model layer, and the ORM design is not decided yet (S5 [#88](https://github.com/Laratypes/Laratype/issues/88)). Both kinds of binding are planned and wait for that decision.

::: info Illustrative example
The examples follow the design notes in the [HTTP spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md#model-binding). None of this code runs today, and the model API is not designed yet. They use the `users` contract and `UserController` from [Controllers](./controllers).
:::

## Explicit binding <Status issue="118" />

`.bind()` on the route maps path params to models:

```ts
r.middleware(auth()).bind({ user: User }).contract(users, UserController)
```

- The keys must be path params of the contract's endpoints. `.bind({ post: Post })` on the `users` contract fails with `` .bind(): `post` is not a path param of any endpoint in users ``.
- A model class looks the param up and gives an instance of the class.
- No match is a 404.
- The binding adds `{ params: { user: User } }` to what the route provides, only for endpoints whose path has `:user`.

For a custom lookup, pass a resolver instead of a class:

```ts
r.bind({ user: (value) => findActiveUser(value) }).contract(users, UserController)
```

The bound type is the resolver's return value without `null` or `undefined`, after awaiting it, because a miss is a 404.

The handler asks for the bound type in its `Ctx`:

```ts
async show({ params }: Ctx<typeof users.show, { params: { user: User } }>) {
  return params.user
}
```

If the route has no `.bind()` for `user`, `r.contract()` reports `` users.show: `params.user` provided by the route does not match the handler (missing .bind()?) ``. See [Controllers › Route proof](./controllers#route-proof).

Explicit binding replaces the 0.5 `Route.model` and `Route.bind`. Optional path params with `.bind()` (whether the type becomes `User | undefined`) are an open question in [#118](https://github.com/Laratypes/Laratype/issues/118).

## Implicit binding <Status issue="163" />

With implicit binding you don't need `.bind()` for the usual case:

- A path param whose name matches a key in `Register['models']` is bound to that model. The build manifest generates this map, keyed by the camelCase model name, so `:user` binds to `User`.
- An explicit `.bind()` for the same param wins.
- `.withoutImplicitBinding()` turns implicit binding off for a route.
- `static routeKeyName` on the model sets the column to look up. The default is the primary key.
- `.scopeBindings()` handles nested params, as in `/users/:user/posts/:post`.

Implicit binding replaces the 0.5 global `__laratype_param_model_map`.
