# Middleware and the pipeline

Every request goes through a fixed pipeline before and after its handler. Middleware can stop a request or add typed values to the handler's context, and interceptors wrap the handler itself.

The pipeline will live in `@laratype/http` and replaces the 0.5 `RequestKernel.pipeline`. All of it is planned: the pipeline in [#106](https://github.com/Laratypes/Laratype/issues/106), typed middleware in [#117](https://github.com/Laratypes/Laratype/issues/117) and interceptors in [#138](https://github.com/Laratypes/Laratype/issues/138).

::: info Illustrative example
The examples follow the design notes in the [HTTP spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md). None of this code runs today, and names may change.
:::

## Pipeline order <Status issue="106" />

The steps always run in this order:

1. global middleware
2. route middleware
3. guard and policy checks (`.can()`)
4. `FormRequest.authorize()`
5. validation, which answers 422 on failure
6. interceptors, before the handler
7. the handler
8. interceptors, after the handler
9. serialization, with a Resource or the response schema
10. the exception filter

Steps 1 to 5 can stop a request before the handler runs. For example, `auth()` answers 401, a policy denial answers 403 and failed validation answers 422. The exception filter turns whatever is thrown into the error response the contract declares ([#108](https://github.com/Laratypes/Laratype/issues/108)). [Validation](./validation) covers steps 4 and 5. Policies, Resources and exceptions are covered in their own guides.

## Typed middleware <Status issue="117" />

`defineMiddleware<Ext>()` declares a middleware and the keys it adds to the context. It passes those values on with `next(ext)`:

```ts
// app/http/middleware/requestId.ts
export const requestId = () =>
  defineMiddleware<{ requestId: string }>(async (ctx, next) => {
    return next({ requestId: crypto.randomUUID() })
  })
```

The route builder adds up the extensions of global, group and route middleware, in pipeline order. A handler asks for a key in its `Ctx`, and the route proves it is there:

```ts
async index({ query, requestId }: Ctx<typeof users.index, { requestId: string }>) {
  console.log(requestId) // a string
  return this.repo.list(query.page)
}
```

If the route has no middleware that adds `requestId`, `r.contract()` fails with `` users.index: handler requires `requestId`, route does not provide it (add middleware / .bind()) ``. See [Controllers › Route proof](./controllers#route-proof).

`auth()` from `@laratype/auth` is built the same way. It adds `{ user }`, typed from the selected guard, and answers 401 when nobody is signed in ([#120](https://github.com/Laratypes/Laratype/issues/120)).

`withoutMiddleware` opts a route out of a middleware it would otherwise get.

Middleware for only some endpoints of one contract, for example `auth()` on `destroy` only, is not settled yet ([#105](https://github.com/Laratypes/Laratype/issues/105), [#117](https://github.com/Laratypes/Laratype/issues/117)). The S1 spike already checks types per endpoint; the open part is how the builder lets you write it.

## Global middleware <Status issue="117" />

Global middleware runs first, for every route. `cors()` is registered there by default (see [Routing › CORS](./routing#cors)). Group middleware comes from `Route.prefix(...).middleware(...)` and route middleware from `r.middleware(...)` (see [Routing](./routing#registering-a-contract)).

## Interceptors <Status issue="138" />

Interceptors are hooks before and after the handler, in the NestJS style. Typical uses are transforming results, caching and logging.

An interceptor may change the handler's result. The contract's response is still the final type that the frontend sees. The interceptor API is not specified yet.
