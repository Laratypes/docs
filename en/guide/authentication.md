# Authentication

Authentication finds out who sent a request. In v1 the signed-in user has a type that you declare once, and the `auth()` middleware hands that typed user to the handler. A handler that needs a user on a route without `auth()` does not compile.

Authentication will live in `@laratype/auth`. The 0.5 package already has guards, Passport support, policies and gates; v1 types them and resolves them from the container. All of it is planned, and the [auth spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/auth.md) only has short design notes so far: signatures will be added when the issues land.

::: info Illustrative example
The examples follow the design notes in the auth spec. None of this code runs today, and names may change. They use the `users` contract and `UserController` from [Controllers](./controllers).
:::

## The `Register` interface <Status issue="119" />

You declare the user type once, by augmenting the `Register` interface of `@laratype/auth`:

```ts
declare module '@laratype/auth' {
  interface Register {
    user: User
    guards: { /* ... */ }
  }
}
```

After that, `Auth.user()` is typed `User | null`. In v0.5.4 the user type is passed at each call, as in `Auth.user<User>()`. v1 removes those casts.

What goes under `guards` is not specified yet ([#119](https://github.com/Laratypes/Laratype/issues/119)).

`Auth` becomes a container facade ([#115](https://github.com/Laratypes/Laratype/issues/115), see [Dependency injection › Registries and facades](./dependency-injection#registries-and-facades)).

## The `auth()` middleware <Status issue="120" />

`auth('api')` authenticates the request with the `api` guard and adds `{ user }` to the handler's context. The type of `user` comes from the selected guard. When nobody is signed in, the request stops with a 401 (`errors.unauthorized`).

```ts
// app/routes/api.ts
r.middleware(auth('api')).bind({ user: User }).contract(users, UserController)
```

A handler asks for the user in its `Ctx`, as `destroy` does in [Controllers](./controllers#return-values-and-fail):

```ts
async destroy({ params, user }: Ctx<typeof users.destroy, { params: { user: User }; user: User }>) {
  // ...
}
```

If the route has no `auth()`, `r.contract()` fails to compile with `` users.destroy: handler requires `user`, route does not provide it (add middleware / .bind()) ``. See [Controllers › Route proof](./controllers#route-proof).

`auth()` is a [typed middleware](./middleware#typed-middleware) ([#117](https://github.com/Laratypes/Laratype/issues/117)).

## Guards <Status issue="151" />

A guard decides how a request is authenticated. The jwt, session and passport guards are resolved from the container and configured through typed config ([#152](https://github.com/Laratypes/Laratype/issues/152), see [Configuration](./configuration)). The config keys are not specified yet.

The work is done when the auth flows in the `examples/basic` app pass ([#151](https://github.com/Laratypes/Laratype/issues/151)).

An OAuth2 server with its own token guard is planned separately, see [OAuth2 server](./oauth2).
