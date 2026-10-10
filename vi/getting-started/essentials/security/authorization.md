---
outline: deep
---

# Ủy quyền

Ủy quyền (authorization) quyết định một người dùng đã xác thực có được làm một hành động hay truy cập một tài nguyên hay không. Laratype có hai công cụ cho việc này: Gates và Policies.

## Gates

Gate là một quy tắc quyền nhỏ, dùng cho hành động có logic đơn giản và không gắn với một model cụ thể. Gate nhận người dùng (có thể kèm tham số khác) và trả về boolean.

### Generating Gates

> [!INFO]
> Gate nằm trong thư mục `src/gates/`. Bạn có thể tự tạo file Gate bằng tay.

Gate sau cho phép cập nhật thông tin của một user nếu người thực hiện chính là user đó hoặc là admin:

::: code-group

```ts [UpdateUserGate.ts]
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
:::

Hoặc tạo Gate bằng lệnh CLI:

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

> [!TIP]
> Truyền nhiều tên để tạo nhiều Gate cùng lúc.

::: details Xem thêm

::: code-group

```sh [npx]
$ npx sauf make:gate UpdateUserGate CreateUserGate
```

```sh [pnpx]
$ pnpx sauf make:gate UpdateUserGate CreateUserGate
```

```sh [bunx]
$ bunx sauf make:gate UpdateUserGate CreateUserGate
```

:::

### Authorizing Actions

Gate dùng được ở bất kỳ đâu trong dự án, ví dụ trong controller hoặc middleware:

::: code-group

```ts [UserController.ts]{16}
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
:::

#### Authorizing or Throwing Exceptions <Badge type="warning" text="coming soon" />

> [!NOTE]
> Tính năng này sẽ thêm một helper/Facade kiểm tra quyền và ném `AuthorizationError` khi không được phép (tương tự `authorizeOrFail`). Mục này sẽ được viết khi API ổn định.

## Policies

Policy gom logic ủy quyền của một model vào một chỗ. Dùng policy khi một resource/model có nhiều hành động cần kiểm tra quyền (view, create, update, delete...).

> [!INFO]
> Policy nằm trong thư mục `src/policies/`. Bạn có thể tự tạo file Policy bằng tay.

### Tạo policies

Policy là một `class`, mỗi method ứng với một hành động cần kiểm soát. Thường mỗi model có một policy.

#### Generating Policies

Ngoài cách tạo bằng tay, bạn có thể dùng lệnh CLI:

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

Lệnh này tạo file `src/policies/PostPolicy.ts` với các method cơ bản (`view`, `viewAny`, `create`, `update`, `delete`, `forceDelete`, `restore`).

Sau đó, gắn `decorator` `UsePolicy()` vào model để framework biết model nào dùng policy nào:

::: code-group

```ts [User.ts]{7,12}
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
:::

### Writing policies

Method của policy thường nhận `User` hiện tại, model cần kiểm tra (nếu có) hoặc tham số khác, và trả về boolean hoặc null.

::: code-group
```ts [UserPolicy.ts]
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
:::

Trong policy trên, `viewAny` và `view` luôn trả về `true`, nên ai cũng xem được thông tin user. Còn `update` chỉ được phép khi người thực hiện chính là user đó.

#### Policy Methods

Các method thường gặp trong policy:

- `viewAny(user: User)`: có được xem danh sách không
- `view(user: User, post: Post)`: có được xem không
- `create(user: User)`: có được tạo mới không
- `update(user: User, post: Post)`: có được cập nhật không
- `delete(user: User, post: Post)`: có được xoá không
- `restore(user: User, post: Post)`: có được khôi phục không
- `forceDelete(user: User, post: Post)`: có được xoá vĩnh viễn không
- `before(user: User, ability: string)`: chạy trước các method khác, trả về boolean/null

#### Policy Filters

Phương thức `before` chạy trước các method khác trong policy. Nếu `before` trả về true hoặc false, các method còn lại bị bỏ qua và giá trị đó là kết quả cuối cùng. Nếu trả về null, việc kiểm tra tiếp tục như bình thường.

::: code-group

```ts [UserPolicy.ts]
import { Policy } from "@laratype/auth";
import { User } from "../models/User";
import { Admin } from "../models/Admin";

export default class UserPolicy extends Policy {
	// ... other methods

  // [!code focus:3]
	public before(actor: User | Admin, ability: string): boolean | null {
      return actor instanceof Admin ? true : null;
    }
}
```
:::

Ở đây, khi actor là `Admin`, `before` trả về true, nên Admin làm được mọi hành động.

### Authorizing Actions Using Policies

#### Via the Model

Model đã gắn policy có phương thức `can` để kiểm tra quyền.

Ví dụ, khi `PostPolicy` đã được đăng ký cho model `Post`:

::: code-group

```ts [UserController.ts]{18}
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
:::

Controller kiểm tra quyền của người dùng bằng phương thức `can` trước khi xóa. Người dùng không có quyền sẽ nhận `UnauthorizedException`.

##### Actions That Don't Require Models

Với hành động không cần model cụ thể (ví dụ `create`), viết method tương ứng trong policy rồi gọi bằng tên action, không truyền model:

```ts
import { Post } from "../models/Post";

if(actor.can('create', Post)) {
	// Do something
}
```

#### Via Middleware

Middleware `can` kiểm tra quyền ngay trên route, trước khi request vào controller:

::: code-group

```ts [api.ts]{16,22}
const authGuardedRoutes: RouteOptions = {
  path: "/",
  middleware: [
    AuthGuard,
  ],
  children: [
    {
      path: "/users",
      controller: controller(UserController, 'store'),
      request: CreateUserRequest,
      method: "post",
      children: [
        {
          path: '',
          method: 'get',
          can: can("viewAny", User),
          controller: controller(UserController, 'index'),
        },
        {
          path: '/:user',
          method: 'get',
          can: can("view", "user"),
          controller: controller(UserController, 'view'),
        },
        {
          path: '/:activeUser',
          method: 'patch',
          request: UpdateUserRequest,
          controller: controller(UserController, 'update'),
        },
        {
          path: '/:id',
          method: 'delete',
          controller: controller(UserController, 'delete'),
        }
      ]
    },
    {
      path: "/me",
      controller: controller(UserController, 'me'),
      method: "get"
    },
  ]
}
```
:::

##### With Route Model Binding

Laratype tự binding model từ tham số route (chi tiết [tại đây](../http/routing.md#route-model-binding)). Middleware `can` nhận tên tham số đã được binding:

- `can("action", "routeParamName")`

Với hành động không cần model cụ thể (ví dụ `create`):

- `can("action", ModelName)`
