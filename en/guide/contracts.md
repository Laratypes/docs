# Contracts

A contract describes a group of endpoints: their methods and paths, the schemas for what comes in and goes out, and the errors they can return. It is a runtime value, so the router, the frontend client, type generation and OpenAPI all read the same object.

Contracts live in `@laratype/contract`. The package has no runtime dependencies and never imports `node:*` or server code, so the frontend can import it directly. Schemas can come from any library that implements [Standard Schema](https://standardschema.dev), such as zod, valibot or arktype; the examples use zod 4.

## Endpoints <Status available />

An endpoint starts with an HTTP method and a path, and you add the other parts with builder calls:

| Call | What it sets |
|---|---|
| `endpoint.get(path)`, `.post`, `.put`, `.patch`, `.delete` | The method and the path. There is no `head` or `options`. |
| `.query(schema)` | The query string schema |
| `.body(schema)` | The request body schema |
| `.headers(schema)` | The request headers schema |
| `.response(schema, status?)` | The response schema and the success status (default `200`) |
| `.throws(...errors)` | The domain errors this endpoint can throw |

The builder is immutable: every call returns a new endpoint and leaves the old one as it was. You can call the slots in any order, and calling the same slot again replaces it, except `.throws()`, which appends.

A success status other than `200` keeps its literal type, so `.response(UserDto, 201)` is typed `201`. Middleware is not part of an endpoint; it belongs to the route. Auth, authorize and throttle are endpoint capabilities, and an unset one is inherited from the contract or a folder scope.

<<< @/snippets/v1/contract/endpoint.ts#endpoints

The `def` property holds the runtime description (method, path, schemas, status, throws and capabilities) as frozen plain data. Writing to it throws a `TypeError` in strict mode.

## Path params <Status available />

Paths use Hono's route syntax, and their params are typed from the path string:

- `:name` is a required param;
- `:name?` is optional;
- `:name{[0-9]+}` adds a pattern, and the param is still called `name`;
- wildcards (`*`), static segments and trailing slashes add no params.

So `/users/:user/posts/:post?` gives `{ user: string; post?: string }`. Param values are always strings. Turning them into numbers or models happens later, in the schema or with route model binding.

<<< @/snippets/v1/contract/endpoint.ts#path-params

## Errors <Status available />

The endpoint's error set is derived from what it declares: a body, query or headers schema gives 422, a path param gives 404, `auth` gives 401, `authorize` gives 403 and `.throttle()` gives 429; `.throws(...)` adds a domain error. Each error is a status and a code, with a body type that only exists at compile time. The built-in set:

| Error | Status | Code | Body |
|---|---|---|---|
| `errors.unauthorized` | 401 | `UNAUTHORIZED` | `{ message }` |
| `errors.forbidden` | 403 | `FORBIDDEN` | `{ message }` |
| `errors.notFound` | 404 | `NOT_FOUND` | `{ message }` |
| `errors.validation` | 422 | `VALIDATION_ERROR` | `{ message, errors }` |
| `errors.tooManyRequests` | 429 | `TOO_MANY_REQUESTS` | `{ message }` |

For anything else, define your own with `defineError(status, code)` and declare it with `.throws()`. The body type defaults to `{ message: string }`:

```ts
const paymentRequired = defineError<402, { message: string; checkoutUrl: string }>(402, 'PAYMENT_REQUIRED')
```

The 422 body has the shape `{ message, errors: { "address.zip": ["Required"] } }`, keyed by the dot path of each field. The server and the client both use this shape.

<<< @/snippets/v1/contract/endpoint.ts#errors

## Schema types <Status available />

`InferIn<S>` and `InferOut<S>` read a schema's input and output types. Request parts (query, body and headers) are typed with the schema's **input**, because that is what the client sends. The response is typed with the schema's **output**, because that is what the server serializes.

With `z.coerce.number<number>().default(1)`, for example, the client may send `{ page?: number }` and the handler receives `{ page: number }`.

<<< @/snippets/v1/contract/endpoint.ts#schema-types

## Validating a value <Status issue="91" pr="205" />

`validate(schema, value)` runs any Standard Schema and returns a result you can narrow on `ok`:

- on success, `{ ok: true, value }`, typed with the schema's output;
- on failure, `{ ok: false, errors, issues }`, where `errors` is the 422 error bag.

Invalid input never makes `validate()` reject; it resolves to `{ ok: false }`. Paths are joined with dots (`["items", 0, "name"]` becomes `"items.0.name"`), and an issue without a path goes under `""`. The error bag has a null prototype, so check keys with `Object.hasOwn(bag, key)` or `key in bag`.

`validateSync()` does the same for synchronous schemas. Given an async schema, it throws `TypeError: validateSync: the zod schema is async, use validate() instead`.

The router will call `validate()` on the query, body and headers for you ([#106](https://github.com/Laratypes/Laratype/issues/106)). You only call it yourself outside a request.

::: info Illustrative example
This API is in review in PR [#205](https://github.com/Laratypes/Laratype/pull/205).
:::

<<< @/snippets/v1/contract/validate.ts#validating-a-value

## Defining a contract <Status issue="93" pr="204" />

`defineContract<Prefix>()(endpoints, options?)` groups endpoints under the folder they live in (`defineContract()` at the root), and `defineScope<ScopePrefix>()(options)` sets capabilities for a whole folder:

<<< @/snippets/v1/contract/proposed/contracts.ts#defining-a-contract

Each endpoint gets a **route name**: the contract's tree name plus the endpoint key, here `users.index` and `users.show`. The router, the client, type generation and named URLs all use these names.

The rules:

- A contract has no name of its own: its tree name is the folder names plus the file name, joined with `.`; it can't be empty, and a dotted name like `users.posts` is fine.
- Endpoint keys can't contain `.`.
- Every value must be an endpoint.

Breaking a rule throws a `TypeError` that starts with `[@laratype/contract]`, for example `defineContract: endpoint key "a.b" must be non-empty and must not contain "."`. The contract itself is frozen and keeps its endpoints in the order you wrote them.

## The API object <Status issue="93" pr="204" />

`.laratype/api/index.gen.ts` is generated by `sauf types:generate`; it mounts every contract with `defineApi()` and exports the API type:

<<< @/snippets/v1/contract/proposed/contracts.ts#the-api-object

This is the only server module the frontend imports. Don't hand the frontend `typeof routes` or anything else from the server; that pulls server files into the frontend's type-check.

Each key is the contract's tree name, so `appApi.users.posts` and the route names `users.posts.*` always agree. An entry whose `path` doesn't start with the contract's folder prefix is a type error, and a malformed tree name is a runtime `TypeError` (`defineApi: invalid tree name "..."`).

Two helpers read the API object:

- `apiRoutes(appApi)` lists every route with its `name`, `method`, `path`, `endpoint` and resolved capabilities, in definition order.
- `apiEndpoint(appApi, 'users.show')` returns the endpoint behind a route name. An unknown name is a type error.

::: info Illustrative example
`defineContract`, `defineApi` and the API types are in review in PR [#204](https://github.com/Laratypes/Laratype/pull/204).
:::

## API types <Status issue="93" pr="204" />

`ApiTypes<AppApi>` turns the API object into plain types with no schema types left in them. For every endpoint it gives `method`, `path`, `params`, `query`, `body`, `headers`, `response`, `status` and `errors`. `EndpointTypes<E>` does the same for one endpoint.

`@laratype/client` reads these types. When the frontend lives in a separate repository, `sauf types:generate` prints the same shape into a file the frontend can import.

A `Date` in a response schema is still typed `Date`, even though JSON delivers a string. The wire type is an open question in [#110](https://github.com/Laratypes/Laratype/issues/110).

<<< @/snippets/v1/contract/proposed/contracts.ts#api-types

## Building URLs <Status issue="162" />

A URL builder is planned. It would build a URL from an endpoint, or from a route name like `users.show`, with typed params and query. The client and a server-side `route()` helper would share it. The signature isn't settled yet.

## Type tests <Status issue="94" />

`@laratype/contract` checks its types with type-level tests (type assertions and `@ts-expect-error`), which run with its normal test suite today. A dedicated CI job that fails on a broken type is planned in [#94](https://github.com/Laratypes/Laratype/issues/94). Nothing changes for application code.
