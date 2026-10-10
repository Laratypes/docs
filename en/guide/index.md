# Laratype v1

Laratype v1 is a redesign of the framework. You declare each endpoint once, as a contract, and that object drives validation, the handler's types, the typed frontend client and OpenAPI. Classes get their dependencies through constructor injection, and decorators are optional. v1 keeps Laravel's ergonomics: route files, FormRequest, Resources, Policies, facades and `sauf make:*`.

v1 is not on npm yet. To build an application today, use the [0.5.4 docs](/v0.5/).

## Areas

The guide pages for each area are being written ([Laratypes/Laratype#211](https://github.com/Laratypes/Laratype/issues/211)). Each page will say whether a feature is **Available** on `master` or **Planned**, with the issue that tracks it.

| Area | Package | Status |
|---|---|---|
| [Contract](./contracts) | `@laratype/contract` | Endpoint builder, path params and error catalog are on `master`. `defineContract`, `defineApi` and the validation adapter are planned, with code in review. |
| [Dependency injection](./dependency-injection) and [providers](./service-providers) | `@laratype/core`, `@laratype/support` | Planned, code in review |
| Routing, controllers and middleware | `@laratype/http` | Planned |
| Validation | `@laratype/validation` | Planned (the Standard Schema adapter is in review) |
| Responses and exceptions | `@laratype/http` | Planned |
| Authentication and authorization | `@laratype/auth` | Planned |
| Frontend client | `@laratype/client` | Planned |
| Build and CLI | `sauf` | Planned |
| Type generation | `sauf` | Planned |
| Database | `@laratype/database` | Design not decided yet ([#88](https://github.com/Laratypes/Laratype/issues/88)) |

Progress on the whole redesign is tracked in [Laratypes/Laratype#83](https://github.com/Laratypes/Laratype/issues/83).
