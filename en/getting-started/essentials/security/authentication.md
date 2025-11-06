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

```ts {7}
// LocalAuthenticationMiddleware.ts
import { Passport } from "@laratype/auth";
import { Middleware, type MiddlewareHandler } from "@laratype/http";

export default class LocalAuthentication extends Middleware {
  handle: MiddlewareHandler = async (request, res, next) => {
    const handler = await Passport.authenticate("web");

    return handler(res, next);
  };
}
```

`Passport.authenticate('web')` uses the `web` guard defined in `config/auth.ts`. You can customize authentication options there.

Add `LocalAuthenticationMiddleware.ts` to the route or route group you want to protect:

```ts {10}
import LocalAuthentication from "../middleware/LocalAuthenticationMiddleware";

export default {
  path: "/auth",
  children: [
    {
      path: "/login",
      controller: LoginController.__invoke("me"),
      middleware: [
        LocalAuthentication
      ],
      method: "get",
    },
  ],
};
```

### Retrieving the Authenticated User

In a controller or anywhere with access to the request/context, you can get the current user like this:

```ts
import { Request } from "@laratype/http";
import { Auth } from "@laratype/auth";

// Controller example
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

### Generating Tokens

Laratype supports generating JWT tokens for user authentication. You can use `AuthVerification.sign` to create a token for an authenticated user.

```ts
// LoginController.ts
import { Auth, AuthVerification } from "@laratype/auth";
import { Controller, Request } from "@laratype/http";
import { User } from "../../models/User";

export default class LoginController extends Controller {

  async login(request: Request) {
    // Assume the user has already been authenticated successfully
    const user = Auth.user<User>()
    const jwtToken = await AuthVerification.sign(user, {
      name: "Default Token", // Token name
      abilities: "*", // Token abilities
    });

    return {
      user,
      token: jwtToken,
    }
  }
}
```

### Verifying Tokens

Laratype supports JWT token verification through the `AuthGuard` middleware. This middleware automatically checks the token in the `Authorization` header of the request.

You can also verify tokens manually without using the protecting middleware, then customize the authentication logic in your controller or service.

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

```ts {2,7}
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
      controller: UserController.__invoke('me'),
      method: "get",
    },
  ],
};
```

The `AuthGuard` middleware returns a 401 error if the request is not authenticated.

### Login Throttling (coming soon) <Badge type="warning" text="coming soon" />

A login throttling feature will be added soon. The goal is to reduce brute-force attacks by limiting failed login attempts by IP or account within a time window.

## Manually Authenticating Users (coming soon) <Badge type="warning" text="coming soon" />

You will be able to manually authenticate (log in) users in a controller or service.

### Specifying Additional Conditions (coming soon) <Badge type="warning" text="coming soon" />

Support for specifying extra conditions when authenticating (for example: allow login only if `is_active = true`) will be introduced in a future update.

### Accessing Specific Guard Instances (coming soon) <Badge type="warning" text="coming soon" />

### Remembering Users (coming soon) <Badge type="warning" text="coming soon" />

A "remember me" (token TTL) system will be added with configuration guidance in `config/auth.ts`.

## Logout and Deactivating Tokens (coming soon) <Badge type="warning" text="coming soon" />

Instructions for logout and token deactivation will be added in future updates.
