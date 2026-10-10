---
outline: deep 
---

# Request

`Request` is an important part of handling HTTP requests in the application. It provides methods and properties to access data from the request, such as params, headers, and body.

In Laratype, Request classes are typically used to validate and filter input data from users before it is processed by the [controller](./controller.md). This helps ensure that the received data is valid and secure.

> [!INFO]
> Request classes are typically placed in the `src/http/requests` directory. You can create custom Request classes to handle specific requests, for example, `CreateUserRequest` or `UpdateProfileRequest`.

## Creating a Request

### Generate Request

You can use the Sauf command to create a new request:

::: code-group

```sh [npx]
$ npx sauf make:request CreateUserRequest 
```

```sh [pnpx]
$ pnpx sauf make:request CreateUserRequest 
```

```sh [bunx]
$ bunx sauf make:request CreateUserRequest
```

:::

Laratype will create a new request file in the `src/http/requests/` directory named `CreateUserRequest.ts`.

> [!TIP]
> You can create multiple requests at once by passing multiple names.

::: details See more

::: code-group

```sh [npx]
$ npx sauf make:request CreateUserRequest UpdateProfileRequest
```

```sh [pnpx]
$ pnpx sauf make:request CreateUserRequest UpdateProfileRequest
```

```sh [bunx]
$ bunx sauf make:request CreateUserRequest UpdateProfileRequest
```

:::

### Writing Request

Laratype uses [Zod](https://zod.dev/) to define validation rules in the Request class. You can override the `rules` method to return a Zod schema describing the validation rules for the request.

::: code-group

```ts [CreateUserRequest.ts]
import { Request } from "@laratype/http";
import { z } from "zod";

export default class CreateUserRequest extends Request {
  public rules() {
    return z.object({
      email: z.string(),
      password: z.string().min(8),
      name: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      age: z.number().min(18)
    })
  }
}
```

:::

See more about Request API [here](../../../api/api-reference/http/request.md)

## Commands

You can check the list of registered routes and related requests using the Sauf command:

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
