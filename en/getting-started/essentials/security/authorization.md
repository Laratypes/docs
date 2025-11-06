---
outline: deep
---

# Authorization

Authorization determines whether an authenticated user is allowed to perform an action or access a resource. Laratype provides two main concepts for authorization: Gates and Policies.

## Gates

Gates are small authorization callbacks, typically used for short checks or simple logic not tied to a specific model. A Gate is a callback/closure that receives the user (and optionally additional arguments) and returns a boolean.

### Generating Gates

Gates are declared in the `gates/` directory of your project. You can create Gate files manually.

Below is a simple Gate example that allows a user to update a profile if they are the owner or an admin.


```ts
// gates/UpdateUserGate.ts
import { Gate } from "@laratype/auth";
import { User } from "../models/User";
import { Admin } from "../models/Admin";

export default class UpdateUserGate extends Gate {

  handle(actor: User | Admin, user: User): boolean {
    if(actor instanceof Admin) {
      return true;
    }
    if(user.id === actor.id) {
      return true;
    }
    return false;
  }
}
```

If you prefer a generator, you can use the CLI to scaffold a Gate:

::: code-group

```sh [npx]
$ npx sauf make:gate UpdateUserGate 
```

```sh [pnpx]
$ pnpx sauf make:gate UpdateUserGate 
```

```sh [bunx]
$ bunx sauf make:gate UpdateUserGate
```

:::

### Authorizing Actions

After defining a Gate, you can use it anywhere in your project, such as in controllers or middleware.

```ts {16}
// UserController.ts
import { Controller } from "@laratype/http";
import { Auth, GateGuard } from "@laratype/auth";
import { User } from "../../models/User";
import UpdateUserGate from "../../gates/UpdateUserGate";
import UpdateUserRequest from "../requests/UpdateUserRequest";
import UnauthorizedException from "../../exceptions/UnauthorizedException";

export default class UserController extends Controller {

  async update(request: UpdateUserRequest, model: { user: User }) {
    const actor = Auth.user<User>();
    const updatedData = request.validated();
    const { user } = model;

    if(GateGuard.allows(new UpdateUserGate(), actor, user)) {
      // Update user logic here
      return await User.updateFor(user, updatedData);
    }

    throw new UnauthorizedException();
  }
}
```

#### Authorizing or Throwing Exceptions (coming soon) <Badge type="warning" text="coming soon" />

A helper/facade that attempts authorization and throws an `AuthorizationError` if unauthorized (similar to `authorizeOrFail`) is planned and will be added once the API is stabilized.

## Policies

Policies organize authorization logic related to a specific model. Use policies when you have multiple actions (view, create, update, delete, ...) on a resource/model.

### Creating Policies

A policy is a `class` containing methods corresponding to actions you want to control. Policies are usually tied to a model.

#### Generating Policies

You can create a policy manually or use the CLI generator:

::: code-group

```sh [npx]
$ npx sauf make:policy PostPolicy --model Post
```

```sh [pnpx]
$ pnpx sauf make:policy PostPolicy --model Post
```

```sh [bunx]
$ bunx sauf make:policy PostPolicy --model Post
```

:::

The command above will create `src/policies/PostPolicy.ts` with basic methods (`view`, `viewAny`, `create`, `update`, `delete`, `forceDelete`, `restore`).

- Manually Registering Policies

After creating a policy, you need to register it so the framework can map the Model to its Policy by adding the `UsePolicy()` decorator to the model:

```ts {7,12}
import { UsePolicy } from "@laratype/auth"
import { Model } from "@laratype/database"
import { Entity } from "@laratype/database"
import UserPolicy from "../policies/UserPolicy"

@Entity()
@UsePolicy(UserPolicy)
export class User extends Model {
	// ...
}

export interface User extends UsePolicy<UserPolicy> {}

```

### Writing Policies

A policy typically receives the `User` (actor) and the target model (if any) or additional parameters, and returns boolean or null.

```ts
// UserPolicy.ts
import { Policy } from "@laratype/auth";
import { User } from "../models/User";
import { Admin } from "../models/Admin";

export default class UserPolicy extends Policy {
	viewAny(actor: User | Admin, user: User): boolean {
    return true;
  }

  view(actor: User | Admin, user: User): boolean | null {
    return true;
  }

	update(actor: User | Admin, user: User): boolean | null {
    return actor.id === user.id;
  }

	public before(actor: User | Admin, ability: string): boolean | null {
    return actor instanceof Admin ? true : null;
  }
}
```

In the example above, `viewAny` and `view` return `true`, meaning anyone can view a user's information, but `update` only returns true when acting on their own record.

#### Policy Methods

Common policy methods:

- `viewAny(user: User)` — can view the list
- `view(user: User, post: Post)` — can view a specific resource
- `create(user: User)` — can create
- `update(user: User, post: Post)` — can update
- `delete(user: User, post: Post)` — can delete
- `restore(user: User, post: Post)` — can restore
- `forceDelete(user: User, post: Post)` — can permanently delete
- `before(user: User, ability: string)` — runs before other methods and can short-circuit by returning boolean/null

#### Policy Filters

The `before` method runs prior to other policy methods. If it returns true/false, the other methods are skipped and that value is the final decision; if it returns null, normal checks continue.

```ts
// UserPolicy.ts
import { Policy } from "@laratype/auth";
import { User } from "../models/User";
import { Admin } from "../models/Admin";

export default class UserPolicy extends Policy {
	// ... other methods

	public before(actor: User | Admin, ability: string): boolean | null {
    return actor instanceof Admin ? true : null;
  }
}
```

In this example, when the actor is an `Admin`, `before` returns true so the Admin is allowed to perform any action.

### Authorizing Actions Using Policies

Policies make model-based authorization straightforward.

#### Via the Model

A model with a registered policy receives a `can` method to check abilities easily.

Assuming you registered `PostPolicy` for the `Post` model, you can check permissions like this:

```ts {19}
// UserController.ts
import { Controller, Request } from "@laratype/http";
import { Auth } from "@laratype/auth";
import { User } from "../../models/User";
import UnauthorizedException from "../../exceptions/UnauthorizedException";

export default class UserController extends Controller {

  async delete(request: Request) {
    const actor = Auth.user<User>();
    const userId = request.param('id');

    const user = await User.findOneOrFail({
      where: {
        id: userId,
      }
    });    

    if(actor.cannot('delete', user)) {
      throw new UnauthorizedException();
    }

    return await user.remove();

  }
}
```

In the example above, we use `can`/`cannot` to check permissions before performing the delete action. If unauthorized, `UnauthorizedException` is thrown.

##### Actions That Don't Require Models

For actions that don't require a model (for example: `create`), define the corresponding policy method and call it by action name without passing a model:

```ts
import { Post } from "../models/Post";

if(actor.can('create', Post)) {
	// Do something
}
```

#### Via Middleware

You can protect routes using the `can` middleware to check permissions before hitting the controller:

```ts {16,22}
const authGuardedRoutes: RouteOptions = {
  path: "/",
  middleware: [
    AuthGuard,
  ],
  children: [
    {
      path: "/users",
      controller: UserController.__invoke('store'),
      request: CreateUserRequest,
      method: "post",
      children: [
        {
          path: '',
          method: 'get',
          can: can("viewAny", User),
          controller: UserController.__invoke('index'),
        },
        {
          path: '/:user',
          method: 'get',
          can: can("view", "user"),
          controller: UserController.__invoke('view'),
        },
        {
          path: '/:activeUser',
          method: 'patch',
          request: UpdateUserRequest,
          controller: UserController.__invoke('update'),
        },
        {
          path: '/:id',
          method: 'delete',
          controller: UserController.__invoke('delete'),
        }
      ]
    },
    {
      path: "/me",
      controller: UserController.__invoke('me'),
      method: "get"
    },
  ]
}
```

##### With Route Model Binding

Laratype supports automatic model binding from route parameters (see details in the routing docs). You can use the `can` middleware with the name of the bound parameter:

- `can("action", "routeParamName")`

For actions that don't require a model (for example: `create`):

- `can("action", ModelName)`
