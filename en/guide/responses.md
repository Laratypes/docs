# Responses and resources

A handler returns data, and the framework builds the HTTP response from the endpoint's contract: the status code, the JSON body and its type. A resource turns a model into the body the contract expects.

Both will live in `@laratype/http`. They replace two 0.5 behaviours: the status guessed from the controller method name (`ControllerMethodHttpStatusCode`) and `JsonResource`, whose `toJson()` returns `any`. All of it is planned: responses in [#107](https://github.com/Laratypes/Laratype/issues/107) and resources in [#123](https://github.com/Laratypes/Laratype/issues/123).

::: info Illustrative example
The examples follow the design notes in the [HTTP spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md). None of this code runs today, and names may change. They use the `users` contract and `UserController` from [Controllers](./controllers).
:::

## Status codes <Status issue="107" />

The status of a successful response comes from the contract:

- `.response(schema, status)` sets it explicitly.
- `.response(schema)` without a status gives `200`.
- An endpoint without a response schema gives `204`.

For the `users` contract:

| Endpoint | Declared response | Status |
|---|---|---|
| `users.index` | `.response(z.array(UserDto))` | 200 |
| `users.show` | `.response(UserDto)` | 200 |
| `users.store` | `.response(UserDto, 201)` | 201 |
| `users.destroy` | none | 204 |

The method name of the handler plays no part. Error statuses come from the error definitions, see [Exceptions](./exceptions).

## The response body <Status issue="107" />

A handler returns the response schema's **input** type, and the framework serializes it to JSON afterwards (see [Controllers › Return values and `fail`](./controllers#return-values-and-fail)). In development, the output can optionally be validated against the response schema.

Serialization is step 9 of the [pipeline](./middleware#pipeline-order), after the handler and the interceptors.

The type the frontend receives is still open. The response schema's output can hold values that JSON turns into something else, such as a `Date` that arrives as a `string`. A wire type for this is discussed in [#107](https://github.com/Laratypes/Laratype/issues/107) and [#110](https://github.com/Laratypes/Laratype/issues/110).

## Resources <Status issue="123" />

`defineResource(Model, fn)` declares how a model becomes a response body. The output type is inferred from `fn`:

```ts
// app/http/resources/UserResource.ts
import { defineResource } from '@laratype/http' // package per #123, not final
import { User } from '../../models/User'

export const UserResource = defineResource(User, (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
}))
```

A handler returns the resource for one model with `.make`:

```ts
// inside UserController
async show({ params }: Ctx<typeof users.show, { params: { user: User } }>) {
  return UserResource.make(params.user)
}
```

- The contract is the source of truth. The resource's output is checked against the endpoint's response schema, and a mismatch is a type error.
- `.collection` and `.paginate` cover lists and pages, and `when()` includes a field only under a condition. Their signatures are not settled yet ([#123](https://github.com/Laratypes/Laratype/issues/123)).

In v0.5.4, `sauf make:resource` creates a `JsonResource` class. v1 keeps resources and infers their type.
