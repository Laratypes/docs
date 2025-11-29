---
outline: deep
---

# Controller

Controllers are responsible for handling HTTP requests, interacting with Models, and returning appropriate responses. In Laratype, controllers are typically used to organize request handling logic and responses, making the codebase clearer and easier to maintain.

> [!INFO]
> Controllers are organized in the `src/http/controllers` directory.

## Creating a Controller

### Generate Controller

You can use the Sauf command to create a new controller:

::: code-group

```sh [npx]
$ npx sauf make:controller RegisterController 
```

```sh [pnpx]
$ pnpx sauf make:controller RegisterController 
```

```sh [bunx]
$ bunx sauf make:controller RegisterController
```

:::

Laratype will create a new controller file in the `src/http/controllers/` directory named `RegisterController.ts`.

> [!TIP]
> You can create multiple controllers at once by passing multiple names.

::: details See more

::: code-group

```sh [npx]
$ npx sauf make:controller RegisterController UserController
```

```sh [pnpx]
$ pnpx sauf make:controller RegisterController UserController
```

```sh [bunx]
$ bunx sauf make:controller RegisterController UserController
```

:::

### Writing Controller

Controllers in Laratype extend the `Controller` class available in the `@laratype/http` package. You can define methods in the controller to handle specific actions, such as creating, reading, updating, or deleting resources.

::: code-group

```ts [RegisterController.ts]
import { Controller } from "@laratype/http";
import CreateUserRequest from "../requests/CreateUserRequest";
import { User } from "../../models/User";
export default class RegisterController extends Controller {
  async register(request: CreateUserRequest) {
    const user = await User.save(request.validated());

    return user;
  }
}

```

:::

`Controller` always ensures independence between `request contexts`, meaning that each time a `request` is sent to a `controller`, a new instance of the `controller` is created to handle that request. This helps avoid issues related to shared state between different `requests`.

### Guessing HTTP Status Code

Laratype has the ability to automatically guess the appropriate HTTP status code based on the action performed in the controller. For example, when creating a new resource, Laratype will return a `201 Created` status code. When deleting a resource, the `204 No Content` status code will be used.


| Controller method name        |      HTTP Status Code      |  Description     |
| ----------------------------- | :------------------------: | ---------------: |
| index                         | 200                        | List resources   |
| create                        | 201                        | Create resource  |
| show                          | 200                        | Show resource    |
| update                        | 200                        | Update resource  |
| destroy                       | 204                        | Delete resource  |

There are 2 ways to customize the HTTP Status Code in the controller:

- [response()](#response): Use the response() helper to return a response with a custom status code.

- [UseStatusCode()](#usestatuscode): Use the `UseStatusCode()` decorator to specify the status code for a specific method in the controller.

> [!IMPORTANT]
> Priority order: `response()` > `UseStatusCode()` > Guessing HTTP Status Code.

#### response()

- Use the response() helper to return a response with a custom status code.

::: code-group

```ts [RegisterController.ts]
import { Controller, response } from "@laratype/http";
import CreateUserRequest from "../requests/CreateUserRequest";
import { User } from "../../models/User";
export default class RegisterController extends Controller {
  async register(request: CreateUserRequest) {
    const user = await User.save(request.validated());

    return response(user, 201); // [!code focus]
  }
}

```

:::

#### UseStatusCode()

- Use the `UseStatusCode()` decorator to specify the status code for a specific method in the controller.

::: code-group

```ts [RegisterController.ts]
import { Controller, UseStatusCode } from "@laratype/http";
import CreateUserRequest from "../requests/CreateUserRequest";
import { User } from "../../models/User";
export default class RegisterController extends Controller {
  @UseStatusCode(201) // [!code focus]
  async register(request: CreateUserRequest) {
    const user = await User.save(request.validated());

    return user;
  }
}

```

:::

#### redirect()
You can use the `redirect()` method in the controller to redirect users to another URL.

::: code-group

```ts [RegisterController.ts]
import { Controller, UseStatusCode } from "@laratype/http";
import CreateUserRequest from "../requests/CreateUserRequest";
import { User } from "../../models/User";
export default class RegisterController extends Controller {
  async register(request: CreateUserRequest) {
    const user = await User.save(request.validated());

    return redirect('/welcome'); // [!code focus]
  }
}

```

:::

## Commands

You can check the list of registered routes and related controllers using the Sauf command:

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
