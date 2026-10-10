---
outline: deep
---

# Routing

Routing quyết định URL nào được xử lý bởi controller nào. Trang này hướng dẫn cách khai báo route (tuyến đường) trong Laratype.

## Bắt đầu nhanh

### Định nghĩa Routes

Route được đăng ký trong một Service Provider. Dự án tạo bằng `create-laratype` có sẵn `src/providers/RouteServiceProvider.ts`, và file này import route từ `/app/routes/api.ts`. Bạn có thể đổi sang file khác nếu muốn.

Route được tổ chức theo nhóm (group). File `api.ts` mặc định có sẵn một nhóm route cho API:

::: code-group

```ts [api.ts]
import { RouteOptions, controller } from "@laratype/http";
import { BaseController } from "../src/http/controllers/BaseController";
import { Web } from "../src/http/middleware/Middleware";

export const baseRouteApi: RouteOptions = {
  path: "/",
  middleware: [
    Web
  ],
  controller: controller(BaseController, 'home'),
  method: "get",
}
```

:::

Như trong Laravel, nhóm route (grouped routes) cho phép gắn middleware và tiền tố (prefix) cho nhiều route cùng lúc.

::: code-group

```ts [api.ts]
//...

export const baseRouteApi: RouteOptions = {
  path: "/users",
  middleware: [
    Web
  ],
  controller: controller(BaseController, 'home'),
  method: "get",
  children: [
    {
      path: '/register',
      controller: controller(UserController, 'register'),
      method: "post",
    },
    {
      path: '/login',
      controller: controller(UserController, 'login'),
      method: "post",
    }
  ]
}
```

``` [output]
 * GET /users -> BaseController.home | Middleware: Web
 * POST /users/register -> UserController.register | Middleware: Web
 * POST /users/login -> UserController.login | Middleware: Web
```

:::

> [!TIP]
> Khai báo route con (children routes) bên trong route cha (parent route) để cấu trúc route dễ theo dõi hơn. Cách này cũng dùng được với [Middleware Policy](/vi/getting-started/essentials/security/authorization.html#via-middleware).


### Route Model Binding

Laratype tự tìm model theo tham số trên route rồi truyền model đó vào controller, nên bạn không phải tự truy vấn từ giá trị trong URL.

Tham số route trong Laratype viết bằng dấu `:`, còn Laravel dùng `{}`. Các model đã tìm được gom vào một đối tượng `model` truyền cho controller, mỗi thuộc tính mang tên của tham số route tương ứng.

#### Implicit Binding

Với implicit binding, Laratype tự tìm model dựa trên tên tham số route và kiểu tham số trong controller.

Ví dụ, khi có yêu cầu tới `/users/1`, Laratype tìm User có `id` là `1` rồi truyền vào phương thức `show` của `UserController`:

::: code-group

```ts [api.ts] {2}
{
  path: "/users/:id",
  controller: controller(UserController, 'show'),
  method: "get",
}
```

```ts [UserController.ts]
import { Request } from "@laratype/http";
import { User } from "../../models/User";

export default class UserController {
  async show(request: Request, model: { user: User }) {
    const user = model.user; // User với id = 1
    return user; // user đã được binding tự động từ tham số route
  }
}
```

:::

> [!INFO]
>  Laratype đổi tên tham số route từ camelCase sang PascalCase để tìm [Model](../database/model.md) tương ứng, rồi truy vấn bằng `findOneBy` theo khóa chính (primary key) của model.

#### Explicit Binding

Khi implicit binding không đủ, explicit binding cho bạn tự quy định cách tìm model. Ví dụ, để tham số route `:userId` ứng với model `User`:

::: code-group

```ts [api.ts]{2}
{
  path: "/users/:userId",
  controller: UserController.__invoke('show'),
  method: "get",
}

```

```ts [src/providers/RouteBindingsServiceProvider.ts]{8}
import { Route } from "@laratype/http";
import { AppServiceProvider } from "@laratype/support";
import { User } from "../models/User";

export default class RouteBindingsServiceProvider extends AppServiceProvider {

  public boot(): void {
    Route.model("userId", User)
  }
}
```

:::

Khi có yêu cầu tới `/users/1`, Laratype dùng model `User` để tìm bản ghi có khóa chính `1` rồi truyền vào controller, giống implicit binding.

Để tự viết cách tìm, ví dụ chỉ lấy user đang `active`, truyền một hàm callback:

::: code-group

```ts [src/providers/RouteBindingsServiceProvider.ts]{4-7}
export default class RouteBindingsServiceProvider extends AppServiceProvider {

  public boot(): void {
    Route.bind("activeUser", async (value: string) => {
      const user = await User.findOne({ where: { id: Number(value), isActive: true } });
      return user;
    });
  }
}

```

:::

## Commands

Các lệnh `sauf` liên quan đến route:

### Route List

Liệt kê tất cả routes đã đăng ký trong ứng dụng:

::: details Development {open}

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

::: details Production

::: code-group

```sh [npm]
$ npm run saufx route:list
```

```sh [pnpm]
$ pnpm saufx route:list
```

```sh [bun]
$ bun run saufx route:list
```

:::