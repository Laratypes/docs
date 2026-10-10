---
outline: deep
---

# Middleware

Middleware cung cấp một cách thuận tiện để lọc các yêu cầu HTTP vào ứng dụng của bạn. Bao gồm middleware xác thực, có thể được sử dụng để giới hạn truy cập vào các phần nhất định của ứng dụng chỉ dành cho người dùng đã đăng nhập. Ngoài ra, bạn có thể tạo middleware tùy chỉnh để thực hiện các tác vụ khác nhau.

> [!INFO]
> Middleware thường được đặt trong thư mục `src/http/middleware`.

## Tạo Middleware

### Generate Middleware

Bạn có thể sử dụng lệnh Sauf để tạo một middleware mới:

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

Laratype sẽ tạo một file middleware mới trong thư mục `src/http/middleware/` với tên `OnlySecure.ts`.

> [!TIP]
> Bạn có thể tạo nhiều middleware cùng lúc bằng cách truyền vào nhiều tên.

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

```ts [api.ts]{9}
import { RouteOptions, controller } from "@laratype/http";
import { BaseController } from "../src/http/controllers/BaseController";
import { OnlySecure } from "../src/http/middleware/Middleware";
import RegisterController from "../src/http/controllers/RegisterController";

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

Các middleware được khai báo trong mảng `middleware` sẽ được thực thi theo thứ tự từ trên xuống dưới trước khi yêu cầu được chuyển đến controller. Nếu middleware trả về phản hồi, quá trình xử lý sẽ dừng lại và phản hồi sẽ được gửi về cho client ngay lập tức. Nếu middleware gọi hàm `next()`, yêu cầu sẽ tiếp tục được xử lý bởi các middleware tiếp theo hoặc controller.

> [!TIP]
> Bạn có thể áp dụng middleware cho nhóm bằng cách sử dụng `children` trong định nghĩa route.

## Commands

Bạn có thể kiểm tra danh sách route đã đăng ký và các middleware liên quan bằng cách sử dụng lệnh Sauf:

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