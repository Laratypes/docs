# Laratype v1

Laratype v1 is a redesign of the framework. You declare each endpoint once, as a contract, and that object drives validation, the handler's types, the typed frontend client and OpenAPI. Classes get their dependencies through constructor injection, and decorators are optional. v1 keeps Laravel's ergonomics: route files, FormRequest, Resources, Policies, facades and `sauf make:*`.

v1 is not on npm yet. To build an application today, use the [0.5.4 docs](/v0.5/).

## Areas

The guide pages for each area are being written ([Laratypes/Laratype#211](https://github.com/Laratypes/Laratype/issues/211)). Each page will say whether a feature is **Available** on `master` or **Planned**, with the issue that tracks it.

| Area | Package | Status |
|---|---|---|
| [Contract](./contracts) | `@laratype/contract` | Endpoint builder, path params and error catalog are on `master`. `defineContract`, `defineApi` and the validation adapter are planned, with code in review. |
| [Dependency injection](./dependency-injection) and [providers](./service-providers) | `@laratype/core`, `@laratype/support` | Planned, code in review |
| [Routing](./routing), [controllers](./controllers), [model binding](./model-binding) and [middleware](./middleware) | `@laratype/http` | Planned |
| [Validation](./validation) | `@laratype/validation` | Planned (the Standard Schema adapter is in review) |
| [Responses](./responses) and [exceptions](./exceptions) | `@laratype/http` | Planned |
| [Authentication](./authentication), [authorization](./authorization) and the [OAuth2 server](./oauth2) | `@laratype/auth` | Planned |
| [Frontend client](./client) | `@laratype/client` | Planned |
| [CLI](./cli), [build and deployment](./build) and [testing](./testing) | `sauf`, `@laratype/testing` | Planned |
| [Type generation](./type-generation) | `sauf` | Planned |
| [Database](./database) | `@laratype/database` | Design not decided yet ([#88](https://github.com/Laratypes/Laratype/issues/88)) |

Progress on the whole redesign is tracked in [Laratypes/Laratype#83](https://github.com/Laratypes/Laratype/issues/83).
