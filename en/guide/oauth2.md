# OAuth2 server

A planned OAuth2 server, in the style of Laravel Passport, lets other applications get access tokens for your API. It comes in two parts: the grants and a token guard in [#179](https://github.com/Laratypes/Laratype/issues/179), then scopes, clients and consent in [#180](https://github.com/Laratypes/Laratype/issues/180). Both are in the last milestone (M4).

The [auth spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/auth.md) lists only the headlines. The details below come from the two issues and are a design that may still change. There is no example code yet.

## Grants and the token guard <Status issue="179" />

- **Grants:** authorization code with PKCE, client credentials and refresh tokens. The issue proposes evaluating `@jmondi/oauth2-server` for them.
- **Token guard:** a guard for the `verification: 'oauth2'` mode. The 0.5 config already accepts `'oauth2'`, but 0.5 throws `UnsupportedVerificationModeException` for it.
- **Tokens:** JWT access tokens, signed with keys that `sauf oauth:keys` generates. Tokens can be introspected and revoked, and the guard rejects revoked and expired tokens.
- **Storage:** migrations for the `oauth_*` tables. This depends on the database layer ([#148](https://github.com/Laratypes/Laratype/issues/148)).
- **Endpoints:** the `/oauth/*` endpoints are a built-in contract, so they appear in OpenAPI.

It builds on the container guards ([#151](https://github.com/Laratypes/Laratype/issues/151), see [Authentication › Guards](./authentication#guards)) and typed config ([#152](https://github.com/Laratypes/Laratype/issues/152)).

## Scopes, clients and consent <Status issue="180" />

- **Typed scopes:** scopes are declared through `Register` (see [Authentication › The `Register` interface](./authentication#the-register-interface)). `auth('api').scopes(...)` and `tokenCan()` check them, and an unknown scope is a type error.
- **Clients:** a `sauf oauth:client` command, and personal access clients.
- **Headless consent:** the authorization step redirects to a consent page in your SPA, which approves or denies through JSON endpoints.
- **Cleanup:** a command purges expired tokens. It can run on the scheduler ([#171](https://github.com/Laratypes/Laratype/issues/171)).
