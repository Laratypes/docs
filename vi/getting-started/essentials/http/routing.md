---
outline: deep
---

# Routing

Routing là một phần quan trọng trong bất kỳ framework web nào, và Laratype cũng không ngoại lệ. Hệ thống routing của Laratype rất linh hoạt và mạnh mẽ, cho phép bạn dễ dàng định nghĩa các tuyến đường (routes) cho ứng dụng của mình.

## Bắt đầu nhanh

### Định nghĩa Routes

Routes được đăng ký trong Service Provider, mặc định `create-laratype` đã tạo sẵn `src/providers/RouteServiceProvider.ts` cho bạn. `RouteServiceProvider.ts` sẽ import file định nghĩa routes từ `src/routes/api.ts`, tuy nhiên bạn có thể thay đổi theo ý muốn.

Laratype tổ chức routers theo nhóm (groups) để dễ quản lý. Mặc định, `api.ts` đã có sẵn một nhóm route cho API:

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

Giống Laravel, các route có tính nhóm (grouped routes) giúp bạn dễ dàng áp dụng middleware, tiền tố (prefix) cho nhiều route cùng lúc.

```ts
//...

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

Vậy nên bạn có thể định nghĩa các route con (children routes) bên trong một route cha (parent route) để tổ chức cấu trúc route rõ ràng hơn. Bạn cũng có thể áp dụng tương tự với [Middleware Policy](/vi/getting-started/essentials/security/authorization.html#via-middleware).

### Route Model Binding

Laratype hỗ trợ tự động binding model từ tham số route, giúp bạn tiết kiệm thời gian và công sức khi làm việc với các tham số trong URL.

Khác với Laravel, các tham số route trong Laratype được định nghĩa với dấu `:` thay vì `{}`, các tham số truyền vào controller sẽ được gom vào một đối tượng `model` với tên thuộc tính tương ứng với tên tham số route.

#### Implicit Binding

Laratype hỗ trợ implicit binding, nghĩa là nó sẽ tự động tìm kiếm model dựa trên tên tham số route và kiểu của tham số trong controller. Ví dụ, nếu bạn có một route như sau:

```ts {3}
// api.ts
{
  path: "/users/:id",
  controller: UserController.__invoke('show'),
  method: "get",
}
```

Khi một yêu cầu (request) đến `/users/1`, Laratype sẽ tự động tìm kiếm User có `id` là `1` và truyền nó vào phương thức `show` của `UserController`:

```ts
// UserController.ts
import { Request } from "@laratype/http";
import { User } from "../models/User";

export default class UserController {
  async show(request: Request, model: { user: User }) {
    const user = model.user; // User với id = 1
    return user; // user đã được binding tự động từ tham số route
  }
}
```

Laratype tự động chuyển hóa tham số route từ camelCase sang PascalCase, từ đó tìm đến [Model](../database/model.md) tương ứng để thực hiện truy vấn. Laratype cũng sử dụng khóa chính (primary key) của model để tìm kiếm dữ liệu theo `findOneBy`.

#### Explicit Binding

Không phải lúc nào implicit binding cũng đáp ứng được yêu cầu của bạn. Trong những trường hợp phức tạp hơn, bạn có thể sử dụng explicit binding để tùy chỉnh cách thức tìm kiếm model. Ví dụ bạn muốn quy định rõ ràng tham số route `:userId` sẽ tương ứng với model `User`, bạn có thể làm như sau:

```ts {3}
//api.ts
{
  path: "/users/:userId",
  controller: UserController.__invoke('show'),
  method: "get",
}

```

```ts {10}
//src/providers/RouteBindingsServiceProvider.ts

import { Route } from "@laratype/http";
import { AppServiceProvider } from "@laratype/support";
import { User } from "../models/User";

export default class RouteBindingsServiceProvider extends AppServiceProvider {

  public boot(): void {
    Route.model("userId", User)
  }
}
```

Lúc này, khi một yêu cầu đến `/users/1`, Laratype sẽ sử dụng model `User` để tìm kiếm bản ghi có khóa chính là `1` và truyền nó vào controller, tương tự như implicit binding.

Tuy nhiên, đôi khi bạn muốn tùy chỉnh cách tìm kiếm hơn nữa, ví dụ chỉ tim kiếm những user có trạng thái `active`. Bạn có thể truyền vào một hàm callback để định nghĩa cách tìm kiếm:

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

Laratype cung cấp một số lệnh `sauf` để giúp bạn quản lý routes dễ dàng hơn:

### Route List

Liệt kê tất cả routes đã đăng ký trong ứng dụng:

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