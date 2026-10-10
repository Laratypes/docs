---
outline: deep
---

# Authentication

Authentication is the process of verifying the identity of a user or system before allowing access to protected resources. Laratype provides a flexible and powerful authentication system.

## Quick start

By default, Laratype authenticates users using a Bearer token in the request header. To protect routes and require authentication, you can use the `AuthGuard` middleware.

Laratype offers convenient authentication helpers via middleware and the `Auth` helper.

### Automatic Authentication

By adding middleware, Laratype will automatically authenticate users based on the Bearer token in the request header. You don't need to do anything else to enable this feature.

::: code-group

```ts [LocalAuthMiddleware.ts]{6}
import { Passport } from "@laratype/auth";
import { Middleware, type MiddlewareHandler } from "@laratype/http";

export default class LocalAuthMiddleware extends Middleware {
  handle: MiddlewareHandler = async (request, res, next) => {
    const handler = await Passport.authenticate("web");

    return handler(res, next);
  };
}
```
:::

> [!INFO]
> `Passport.authenticate('web')` uses the `web` guard defined in `config/auth.ts`. You can customize authentication options there.

Add `LocalAuthMiddleware.ts` to the route or route group you want to protect:

::: code-group

```ts [api.ts]{12}
import { controller } from "@laratype/http";
import LoginController from "../src/http/controllers/LoginController";
import LocalAuthMiddleware from "../src/http/middleware/LocalAuthMiddleware";

export default {
  path: "/auth",
  children: [
    {
      path: "/login",
      controller: controller(LoginController, 'me'),
      middleware: [
        LocalAuthMiddleware
      ],
      method: "get",
    },
  ],
};
```
:::

### Retrieving the Authenticated User

In a controller or anywhere with access to the request/context, you can get the current user like this:

::: code-group

```ts [ProfileController.ts]
import { Request } from "@laratype/http";
import { Auth } from "@laratype/auth";

export default class ProfileController {
  async show(request: Request) {
    const user = Auth.user<User>(); // returns User model | null

    if (!user) {
      return new UnauthorizedException();
    }

    return user;
  }
}
```
:::

### Generating Tokens

Laratype supports generating JWT tokens for user authentication. You can use `AuthVerification.sign` to create a token for an authenticated user.

::: code-group

```ts [LoginController.ts]
// See more at: https://github.com/Laratypes/Laratype/tree/master/examples/basic
import { Auth, AuthVerification } from "@laratype/auth";
import { Controller, Request } from "@laratype/http";
import { User } from "../../models/User";

export default class LoginController extends Controller {
  // [!code focus:14]
  async login(request: Request) {
    const authenticated = Auth.user<User>()
    const jwtToken = await authenticated.generateToken({
      name: "Default Token",
      abilities: "*",
    });

    const user = authenticated.getUser();

    return {
      user,
      token: jwtToken,
    }
  }
}
```
:::

### Verifying Tokens

Laratype supports JWT token verification through the `AuthGuard` middleware. This middleware automatically checks the token in the `Authorization` header of the request.

> [!TIP]
> You can verify tokens manually without using the [Protecting Routes middleware](#protecting-routes), then customize the authentication logic in your controller or service.

```ts
import { AuthVerification } from "@laratype/auth";

const authenticationHeader = req.header("Authorization", "");
const token = authenticationHeader.split("Bearer ")[1];
if (!token) {
  throw new Error("No token provided");
}
const user = await AuthVerification.verify(token);

return {
  user,
}

```

### Protecting Routes

Use the `AuthGuard` middleware to protect routes in the router:

::: code-group

```ts [api.ts]{2,7}
import { RouteOptions } from "@laratype/http";
import { AuthGuard } from "@laratype/auth";

const authGuardedRoutes: RouteOptions = {
  path: "/",
  middleware: [
    AuthGuard
  ],
  children: [
    {
      path: "/me",
      controller: UserController.__invoke("me"),
      method: "get",
    },
  ],
};
```
:::

> [!INFO]
> The `AuthGuard` middleware returns a 401 error if the request is not authenticated.

### Login Throttling <Badge type="warning" text="coming soon" />

A login throttling feature will be added soon. The goal is to reduce brute-force attacks by limiting failed login attempts by IP or account within a time window.

## Manually Authenticating Users

In some cases, you may want to manually authenticate users without using middleware.

::: code-group

```ts [LoginController.ts]
// See more at: https://github.com/Laratypes/Laratype/tree/master/examples/basic
import { Auth, AuthVerification } from "@laratype/auth";
import { Controller, Request } from "@laratype/http";
import { User } from "../../models/User";

export default class LoginController extends Controller {
  // [!code focus:23]
  async manualLogin(request: Request) {
    const data = req.validated();

    const attempt = await Auth.guard<User>('web').attempt(data)

    if(!attempt) {
      return new UnauthorizedException({
        message: "Invalid credentials",
      });
    }
    
    const jwtToken = await attempt.generateToken({
      name: "Default Token",
      abilities: "*",
    });

    const user = attempt.getUser();

    return {
      user,
      token: jwtToken,
    }
  }
}
```
:::

### Specifying Additional Conditions <Badge type="warning" text="coming soon" />

> [!NOTE]
> Support for specifying extra conditions when authenticating (for example: allow login only if `is_active = true`) will be introduced in a future update.

### Accessing Specific Guard Instances <Badge type="warning" text="coming soon" />

> [!NOTE]
> Instructions for accessing specific Guard instances will be added in future updates.

### Remembering Users <Badge type="warning" text="coming soon" />

> [!NOTE]
> A "remember me" (token TTL) system will be added with configuration guidance in `config/auth.ts`.

## Logout and Deactivating Tokens <Badge type="warning" text="coming soon" />

> [!NOTE]
> Instructions for logout and token deactivation will be added in future updates.
