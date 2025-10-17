# Middleware

Middleware provides a convenient way to filter HTTP requests entering your application. This includes authentication middleware, which can be used to restrict access to certain parts of the application only to logged-in users. Additionally, you can create custom middleware to perform various tasks.

Middleware is typically placed in the `src/http/middleware` directory.

Below is an example of how to create and use middleware in Laratype:

```typescript
import { Middleware, MiddlewareHandler } from "@laratype/http";

export class OnlySecure extends Middleware {
  handle: MiddlewareHandler = async (request, res, next) => {

    if (request.protocol() !== 'https://') {
      return response({
        message: 'Only secure connections are allowed.'
      }, 403)
    }

    const result = await next(request)

    return result;

  }
}

```

```typescript{10}
// routes/api.ts
import { RouteOptions } from "@laratype/http";
import { BaseController } from "../src/http/controllers/BaseController";
import { OnlySecure } from "../src/http/middleware/Middleware";
import RegisterController from "../src/http/controllers/RegisterController";

export const baseRouteApi: RouteOptions = {
  path: "",
  middleware: [
    OnlySecure
  ],
  controller: BaseController.__invoke('home'),
  method: "get",
  children: [
    {
      path: '/register',
      controller: RegisterController.__invoke('register'),
      method: "post",
      request: CreateUserRequest,
    },
  ]
}

```

Middleware declared in the `middleware` array will be executed in order from top to bottom before the request is passed to the controller. If middleware returns a response, the processing will stop and the response will be sent back to the client immediately. If the middleware calls the `next()` function, the request will continue to be processed by subsequent middleware or the controller.

You can also apply middleware to groups by using `children` in the route definition.

You can check the list of registered routes and related middleware using the Sauf command:

::: code-group

```sh [npm]
$ npx sauf route:list
```

```sh [pnpm]
$ pnpx sauf route:list
```

```sh [yarn]
$ yarn sauf route:list
```

```sh [bun]
$ bun sauf route:list
```

:::
