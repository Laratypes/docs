# Authorization

Authorization decides whether the signed-in user may do something. As in Laravel, the rules live in policies and gates. In v1 their abilities are typed, so a misspelled ability is a compile error, and a route can check a policy before the handler runs.

Policies and gates will live in `@laratype/auth`, and the route check in `@laratype/http`. All of it is planned: policies and gates in [#121](https://github.com/Laratypes/Laratype/issues/121), the route check in [#122](https://github.com/Laratypes/Laratype/issues/122).

::: info Illustrative example
The example follows the design notes in the [auth spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/auth.md) and the [HTTP spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md). None of this code runs today, and names may change. It uses the `users` contract and `UserController` from [Controllers](./controllers).
:::

## Policies and gates <Status issue="121" />

- The abilities of a policy are `keyof Policy`, the keys of the policy type.
- `Gate.allows` and `user.can()` are typed. An unknown ability is a type error.
- This replaces the string abilities of 0.5.

The shape of a policy class and how a policy is linked to a model are not specified yet ([#121](https://github.com/Laratypes/Laratype/issues/121)). In v0.5.4, `sauf make:policy` creates a policy class.

## Policies on routes <Status issue="122" />

`.can()` in the route chain checks a policy for each endpoint:

```ts
// app/routes/api.ts
r.middleware(auth('api'))
  .bind({ user: User })
  .can({ show: ['view', 'user'] })
  .contract(users, UserController)
```

- The key is the endpoint (`show`).
- The first item is the ability. It comes from `keyof Policy`, so a typo does not compile.
- The second item names a bound param (`user`, from `.bind()`). The policy gets the bound model as its argument.
- A denial is a 403 at runtime.

This replaces the free-form string arguments of 0.5, `can('view', 'user')` (`RoutePolicy.make`). `.can()` needs [model binding](./model-binding) ([#118](https://github.com/Laratypes/Laratype/issues/118)) and typed policies ([#121](https://github.com/Laratypes/Laratype/issues/121)).

The policy check is step 3 of the [pipeline](./middleware#pipeline-order). It runs after middleware such as `auth()` and before `FormRequest.authorize()`. A FormRequest can make its own decision in `authorize()`, see [Validation › FormRequest](./validation#formrequest).

The chain order shown here follows the S1 spike and is not settled yet (see [Routing › Registering a contract](./routing#registering-a-contract)).
