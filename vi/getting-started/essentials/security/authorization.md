---
outline: deep
---

# Ủy quyền

Ủy quyền (Authorization) xác định xem một người dùng đã xác thực có được phép thực hiện một hành động hoặc truy cập một tài nguyên hay không. Laratype cung cấp hai khái niệm chính để quản lý ủy quyền: Gates và Policies.
## Gates

Gates là các định nghĩa quyền nhỏ, thường dùng cho các hành động ngắn gọn hoặc logic đơn giản không gắn chặt với một model cụ thể. Một Gate là một callback/closure nhận vào người dùng (và tuỳ chọn thêm tham số) và trả về boolean.

### Generating Gates

Gates được khai báo tại thư mục `gates/` trong dự án của bạn. Bạn có thể tạo file Gate một cách thủ công.

Ví dụ ở dưới đây là một Gate đơn giản cho phép người dùng cập nhật thông tin cá nhân nếu họ là chính họ hoặc là admin.


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

Nếu bạn thích generator, có thể dùng lệnh CLI để tạo Gate:

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

Sau khi định nghĩa Gate, bạn có thể sử dụng trong bất kỳ đâu trong dự án, ví dụ trong controller hoặc middleware.

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

#### Authorizing or Throwing Exceptions <Badge type="warning" text="coming soon" />

Tính năng này sẽ cho phép gọi một helper/Facade để cố gắng ủy quyền và ném ra `AuthorizationError` nếu không được phép (tương tự `authorizeOrFail`). Mục này đang trong kế hoạch và sẽ được cập nhật sau khi API ổn định.

## Policies

Policies tập trung logic ủy quyền liên quan tới một model cụ thể. Dùng policies khi bạn có nhiều hành động (view, create, update, delete, ...) trên một resource/model.

### Tạo policies

Policy là một `class` chứa các method tương ứng với các hành động mà bạn muốn kiểm soát. Thông thường một policy đi kèm với một model.

#### Generating Policies

Bạn có thể tạo policy bằng tay hoặc dùng generator CLI:

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

Lệnh trên sẽ tạo file `src/policies/PostPolicy.ts` với các method cơ bản (`view`, `viewAny`, `create`, `update`, `delete`, `forceDelete`, `restore`).

- Manually Registering Policies

Sau khi tạo, bạn cần đăng ký policy để framework biết cách map giữa Model và Policy bằng cách thêm `UsePolicy()` `decorator` vào model:

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

### Writing policies

Một policy thường nhận `User` (hiện tại) và model target (nếu có) hoặc các tham số bổ sung, giá trị trả về boolean hoặc null.

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

Ở ví dụ trên, `viewAny` và `view` luôn trả về `true`, điều này "đại diện" cho việc bất kỳ ai cũng có thể xem thông tin của một user. Tuy nhiên, chỉ được phép `update` khi là chính họ.

#### Policy Methods

Common methods trong policy:

- `viewAny(user: User)` — có xem danh sách không
- `view(user: User, post: Post)` — có xem được không
- `create(user: User)` — có tạo mới không
- `update(user: User, post: Post)` — có cập nhật không
- `delete(user: User, post: Post)` — có xoá không
- `restore(user: User, post: Post)` — có khôi phục không
- `forceDelete(user: User, post: Post)` — có xoá vĩnh viễn không
- `before(user: User, ability: string)` — chạy trước các method khác, trả về boolean/null

#### Policy Filters

Phương thức `before` chạy trước các method khác trong policy. Nếu nó trả về true/false thì các method còn lại bị bỏ qua và giá trị đó là quyết định cuối cùng; nếu trả về null, kiểm tra sẽ tiếp tục bình thường.

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

Trong ví dụ trên, khi actor là `Admin`, `before` trả về true nên Admin được phép thực hiện mọi hành động.

### Authorizing Actions Using Policies

Policies làm cho việc ủy quyền theo model trở nên trực quan hơn.

#### Via the Model

Mỗi model có được khai báo có policy sẽ có phương thức `can` để giúp bạn kiểm tra quyền một cách dễ dàng.

Giả sử bạn đã đăng ký `PostPolicy` cho `Post` model, bạn có thể kiểm tra quyền bằng model như sau:

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

Ở ví dụ trên, chúng ta đã sử dụng phương thức `can` để kiểm tra quyền của người dùng trước khi thực hiện hành động xóa. Nếu người dùng không có quyền, `UnauthorizedException` sẽ được ném ra.

##### Actions That Don't Require Models

Đối với hành động không cần model (ví dụ: `create`), tạo method trong policy tương ứng. Gọi bằng tên action mà không truyền model:

```ts
import { Post } from "../models/Post";

if(actor.can('create', Post)) {
	// Do something
}
```

#### Via Middleware

Bạn cũng có thể bảo vệ route bằng middleware `can` để kiểm tra quyền trước khi vào controller:

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

Laratype hỗ trợ tự động binding model từ tham số route, hay tham khảo chi tiết [tại đây](../http/routing.md#route-model-binding). Bạn có thể sử dụng middleware `can` với tên tham số đã được binding:

- `can("action", "routeParamName")`

Đối với hành động không cần model (ví dụ: `create`):

- `can("action", ModelName)`
