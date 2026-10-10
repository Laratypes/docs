# Validation

v1 validates requests against the schemas in the contract. You don't write rules a second time: the query, body and headers schemas of an endpoint are the rules, and a request that fails them gets a 422 before the handler runs.

Three packages share the work. The schema-agnostic `validate()` lives in `@laratype/contract`. Running it for each request belongs to the pipeline in `@laratype/http` ([#106](https://github.com/Laratypes/Laratype/issues/106)). Laravel-style request classes belong to `@laratype/validation` ([#137](https://github.com/Laratypes/Laratype/issues/137)). On `master`, `@laratype/validation` is still the 0.5 package.

## The validation adapter <Status issue="91" pr="205" />

`validate(schema, value)` runs any [Standard Schema](https://standardschema.dev) and returns `{ ok: true, value }` or `{ ok: false, errors, issues }`. Invalid input never makes it reject. The `errors` bag has exactly the shape of the 422 body.

It is described in [Contracts › Validating a value](./contracts#validating-a-value). This layer has no messages, translations, `authorize()` or database rules; those come from FormRequest.

## Validation in the pipeline <Status issue="106" />

For each request, the pipeline:

1. parses the path params, the query and the body by contract, including JSON, form and multipart bodies;
2. coerces query values;
3. runs each slot through `validate()`;
4. builds the handler context from the validated values.

The handler sees the schema's **output** types (`InferOut`), with coercion and defaults applied. With `page: z.coerce.number<number>().default(1)` in the query schema, `query.page` is always a `number` in the handler.

Validation runs after middleware, policies and `FormRequest.authorize()`, and before interceptors and the handler (see [Middleware › Pipeline order](./middleware#pipeline-order)).

## The 422 response <Status issue="106" />

When a slot fails, the response is **422** with the `errors.validation` body:

```json
{
  "message": "...",
  "errors": {
    "email": ["..."],
    "address.zip": ["Required"]
  }
}
```

`errors` maps the dot path of each field to its messages. The frontend client reads the same shape, typed by `errors.validation` in the [error catalog](./contracts#errors). The per-field messages come from the schema library, or from a FormRequest's `messages()`.

## FormRequest <Status issue="137" />

A FormRequest class adds what a schema can't express. It is tied to one endpoint, and its rules are that endpoint's body schema. It never redefines the schema. A FormRequest adds:

- `authorize()`, which decides whether the user may make this request;
- `messages()`, custom messages whose keys are inferred from the schema (the key format is not settled yet);
- async rules that need the database, such as a unique email. They run as async refinements, and their API is not settled yet.

::: info Illustrative example
FormRequest is planned in [#137](https://github.com/Laratypes/Laratype/issues/137), after the pipeline ([#106](https://github.com/Laratypes/Laratype/issues/106)). The class follows the design notes in the [validation spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/validation.md#formrequest-v2). None of this code runs today. How a FormRequest is attached to its endpoint is not settled yet.
:::

```ts
// app/http/requests/StoreUserRequest.ts
export default class StoreUserRequest extends FormRequest<typeof users.store> {
  authorize() {
    return true // see the authorization guide for policy checks
  }

  messages() {
    return { 'email.email': 'Please enter a valid email address' }
  }
}
```

`authorize()` runs after route guards and policies and before validation. Messages will be translatable through `@laratype/i18n` ([#167](https://github.com/Laratypes/Laratype/issues/167)).

In v0.5.4, request classes (`sauf make:request`) return a zod schema from `rules()` and have no `authorize()` or `messages()`. FormRequest v2 takes its rules from the contract instead.
