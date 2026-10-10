# Exceptions

When a request fails, the response is one of the errors in the contract's error catalog. A handler returns a declared error with `fail()`. Code can also throw an error, and the exception filter, the last step of the pipeline, turns it into an error response.

The exception filter will live in `@laratype/http` and replaces the 0.5 `Response.resolveException`. The error catalog is available today; the rest is planned in [#108](https://github.com/Laratypes/Laratype/issues/108).

## The error catalog <Status available />

Errors are values from `@laratype/contract`. Each one is a status and a code, with a body type that only exists at compile time. An endpoint lists the errors it can return with `.errors()`.

The built-in set has six errors: `unauthorized` (401), `forbidden` (403), `notFound` (404), `conflict` (409), `validation` (422) and `tooManyRequests` (429). All of them have a `{ message }` body except `validation`, whose body is `{ message, errors }`. App-specific errors are made with `defineError(status, code)`. The full table and an example are in [Contracts › Errors](./contracts#errors).

The server and the client share these definitions. The [client's result union](./client#the-result-union) narrows an error response by its status to the body type declared here.

## Errors from the pipeline <Status issue="108" />

Some pipeline steps answer with an error before the handler runs. All of these are planned:

| Step | Status | Planned in |
|---|---|---|
| `auth()` finds no signed-in user | 401 (`errors.unauthorized`) | [#120](https://github.com/Laratypes/Laratype/issues/120) |
| A policy denies a `.can()` check | 403 | [#122](https://github.com/Laratypes/Laratype/issues/122) |
| Model binding finds no record | 404 | [#118](https://github.com/Laratypes/Laratype/issues/118) |
| Validation fails | 422 (`errors.validation`) | [#106](https://github.com/Laratypes/Laratype/issues/106) |

The 422 body is described in [Validation › The 422 response](./validation#the-422-response). The tests for [#108](https://github.com/Laratypes/Laratype/issues/108) will cover the 404, 403, 422 and 500 bodies.

## `HttpException` <Status issue="108" />

`HttpException` is an exception built from an error definition. The exception filter maps it to the contract's error response, `{ status, body }`.

`fail()` and `HttpException` both produce a contract error. `fail()` is a value the handler returns, so it only works inside the handler, and its error must be declared on the endpoint (see [Controllers › Return values and `fail`](./controllers#return-values-and-fail)). `HttpException` is thrown, so it can come from code the handler calls.

How an `HttpException` is constructed is not specified yet ([#108](https://github.com/Laratypes/Laratype/issues/108)).

The planned development mode `--strict-contract` checks at runtime that a thrown error is declared in the endpoint's `.errors()` ([#157](https://github.com/Laratypes/Laratype/issues/157), see [Controllers › Strict contract mode](./controllers#strict-contract-mode)).

## Unknown errors <Status issue="108" />

Any other thrown error becomes a 500 response that does not leak details. The shape of that body is not specified yet.
