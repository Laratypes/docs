---
outline: deep
---

# Routing

Routing is an essential part of any web framework, and Laratype is no different. The routing system in Laratype is flexible and powerful, allowing you to define application routes easily.

## Quick start

### Defining Routes

Routes are registered inside a Service Provider. By default, `create-laratype` generates `src/providers/RouteServiceProvider.ts` for you. `RouteServiceProvider.ts` imports route definitions from `src/routes/api.ts`, but you can change this as needed.

Laratype organizes routes into groups to improve manageability. By default, `api.ts` includes an API route group:

```ts
// api.ts
import { RouteOptions } from "@laratype/http";
import { BaseController } from "../src/http/controllers/BaseController";
import { Web } from "../src/http/middleware/Middleware";

export const baseRouteApi: RouteOptions = {
  path: "/",
  middleware: [
    Web
  ],
  controller: BaseController.__invoke('home'),
  method: "get",
}
```

Like in Laravel, grouped routes let you apply middleware and prefixes to many routes at once.

```ts
// ...

export const baseRouteApi: RouteOptions = {
  path: "/users",
  middleware: [
    Web
  ],
  controller: BaseController.__invoke('home'),
  method: "get",
  children: [
    {
      path: '/register',
      controller: UserController.__invoke('register'),
      method: "post",
    },
    {
      path: '/login',
      controller: UserController.__invoke('login'),
      method: "post",
    }
  ]
}

/** Output routes:
 * GET /users -> BaseController.home | Middleware: Web
 * POST /users/register -> UserController.register | Middleware: Web
 * POST /users/login -> UserController.login | Middleware: Web
 */
```

So you can define child routes inside a parent route to organize the routing structure more clearly. You can apply the same pattern with [Middleware Policy](/en/getting-started/essentials/security/authorization.html#via-middleware).

### Route Model Binding

Laratype supports automatic model binding from route parameters, which saves time when working with URL parameters.

Unlike Laravel, route parameters in Laratype use `:` instead of `{}`. Parameters passed to controllers are grouped into a `model` object whose property names match the route parameter names.

#### Implicit Binding

Laratype supports implicit binding: it will automatically resolve a model based on the route parameter name and the controller method signature. For example, with this route:

```ts {3}
// api.ts
{
  path: "/users/:id",
  controller: UserController.__invoke('show'),
  method: "get",
}
```

When a request arrives at `/users/1`, Laratype will automatically find the User with `id = 1` and pass it into the `show` method of `UserController`:

```ts
// UserController.ts
import { Request } from "@laratype/http";
import { User } from "../models/User";

export default class UserController {
  async show(request: Request, model: { user: User }) {
    const user = model.user; // User with id = 1
    return user; // user was automatically bound from the route parameter
  }
}
```

Laratype converts route parameter names from camelCase to PascalCase to find the corresponding [Model](../database/model.md) and uses the model's primary key to perform a `findOneBy` lookup.

#### Explicit Binding

Implicit binding doesn't cover every case. For more complex scenarios, you can register explicit bindings to control how a route parameter resolves to a model. For example, to associate `:userId` with the `User` model:

```ts {3}
// api.ts
{
  path: "/users/:userId",
  controller: UserController.__invoke('show'),
  method: "get",
}

```

```ts {10}
// src/providers/RouteBindingsServiceProvider.ts

import { Route } from "@laratype/http";
import { AppServiceProvider } from "@laratype/support";
import { User } from "../models/User";

export default class RouteBindingsServiceProvider extends AppServiceProvider {

  public boot(): void {
    Route.model("userId", User)
  }
}
```

Now when a request hits `/users/1`, Laratype will use the `User` model to find the record whose primary key equals `1` and pass it to the controller—just like implicit binding.

Sometimes you want even more control, for example to only resolve users with `isActive = true`. You can pass a callback to define custom lookup logic:

```ts {6-9}
// src/providers/RouteBindingsServiceProvider.ts

export default class RouteBindingsServiceProvider extends AppServiceProvider {

  public boot(): void {
    Route.bind("activeUser", async (value: string) => {
      const user = await User.findOne({ where: { id: Number(value), isActive: true } });
      return user;
    });
  }
}
```

## Commands

Laratype provides some `sauf` CLI commands to help manage routes:

### Route List

List all routes registered in the application:

::: code-group

```sh [npx]
$ npx sauf route:list
```

```sh [pnpx]
$ pnpx sauf route:list
```

```sh [bunx]
$ bunx sauf route:list
```

:::
