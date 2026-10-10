---
outline: deep 
---

# Request

`Request` là một phần quan trọng trong việc xử lý các yêu cầu HTTP trong ứng dụng. Nó cung cấp các phương thức và thuộc tính để truy cập dữ liệu từ yêu cầu, như params, headers, và body.

Trong Laratype, các lớp Request thường được sử dụng để xác thực và lọc dữ liệu đầu vào từ người dùng trước khi nó được xử lý bởi [controller](./controller.md). Điều này giúp đảm bảo rằng dữ liệu nhận được là hợp lệ và an toàn.

> [!INFO]
> Các lớp Request thường được đặt trong thư mục `src/http/requests`. Bạn có thể tạo các lớp Request tùy chỉnh để xử lý các yêu cầu cụ thể, ví dụ như `CreateUserRequest` hoặc `UpdateProfileRequest`.

## Tạo Request

### Generate Request

Bạn có thể sử dụng lệnh Sauf để tạo một request mới:

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

Laratype sẽ tạo một file request mới trong thư mục `src/http/requests/` với tên `CreateUserRequest.ts`.

> [!TIP]
> Bạn có thể tạo nhiều request cùng lúc bằng cách truyền vào nhiều tên.

::: details Xem thêm

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

Laratype sử dụng [Zod](https://zod.dev/) để định nghĩa các quy tắc xác thực trong lớp Request. Bạn có thể ghi đè phương thức `rules` để trả về một schema Zod mô tả các quy tắc xác thực cho yêu cầu.

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

Tham khảo thêm về Request API [tại đây](../../../api/api-reference/http/request.md)

## Commands

Bạn có thể kiểm tra danh sách route đã đăng ký và các request liên quan bằng cách sử dụng lệnh Sauf:

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
