---
outline: deep
---

# Middleware

Middleware lọc các yêu cầu HTTP trước khi chúng vào ứng dụng. Middleware xác thực là một ví dụ: nó chỉ cho người dùng đã đăng nhập truy cập một số phần của ứng dụng. Bạn cũng có thể viết middleware riêng cho các việc khác.

> [!INFO]
> Middleware thường nằm trong thư mục `src/http/middleware`.

## Tạo Middleware

### Generate Middleware

Tạo middleware mới bằng lệnh Sauf:

::: code-group

```sh [npx]
$ npx sauf make:middleware OnlySecure 
```

```sh [pnpx]
$ pnpx sauf make:middleware OnlySecure 
```

```sh [bunx]
$ bunx sauf make:middleware OnlySecure
```

:::

Lệnh này tạo file `OnlySecure.ts` trong thư mục `src/http/middleware/`.

> [!TIP]
> Truyền nhiều tên để tạo nhiều middleware cùng lúc.

::: details Xem thêm

::: code-group

```sh [npx]
$ npx sauf make:middleware OnlySecure LogRequests 
```

```sh [pnpx]
$ pnpx sauf make:middleware OnlySecure LogRequests 
```

```sh [bunx]
$ bunx sauf make:middleware OnlySecure LogRequests
```

:::

### Writing Middleware

::: code-group

```ts [OnlySecure.ts]
import { Middleware, MiddlewareHandler, response } from "@laratype/http";

export class OnlySecure extends Middleware {
  handle: MiddlewareHandler = async (request, res, next) => {

    if (request.protocol() !== 'https:') {
      return response({
        message: 'Only secure connections are allowed.'
      }, 403)
    }

    const result = await next(request)

    return result;

  }
}

```

```ts [api.ts]{10}
import { RouteOptions, controller } from "@laratype/http";
import { BaseController } from "../src/http/controllers/BaseController";
import { OnlySecure } from "../src/http/middleware/OnlySecure";
import RegisterController from "../src/http/controllers/RegisterController";
import CreateUserRequest from "../src/http/requests/CreateUserRequest";

export const baseRouteApi: RouteOptions = {
  path: "",
  middleware: [
    OnlySecure
  ],
  controller: controller(BaseController, 'home'),
  method: "get",
  children: [
    {
      path: '/register',
      controller: controller(RegisterController, 'register'),
      method: "post",
      request: CreateUserRequest,
    },
  ]
}

```

:::

Middleware trong mảng `middleware` chạy lần lượt từ trên xuống trước khi yêu cầu tới controller. Middleware nào trả về response thì quá trình dừng lại và response đó được gửi ngay cho client. Middleware nào gọi `next()` thì yêu cầu đi tiếp tới middleware sau, hoặc tới controller.

> [!TIP]
> Để áp dụng middleware cho cả một nhóm route, khai báo các route con trong `children`.

## Commands

Lệnh Sauf sau liệt kê các route đã đăng ký cùng middleware của từng route:

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