---
outline: deep 
---

# Request

`Request` đại diện cho một yêu cầu HTTP. Lớp này có các phương thức và thuộc tính để đọc dữ liệu của yêu cầu: params, headers và body.

Trong Laratype, lớp Request thường dùng để kiểm tra và lọc dữ liệu người dùng gửi lên trước khi [controller](./controller.md) xử lý, để controller chỉ nhận dữ liệu hợp lệ.

> [!INFO]
> Các lớp Request thường nằm trong thư mục `src/http/requests`. Mỗi loại yêu cầu có thể có lớp riêng, ví dụ `CreateUserRequest` hoặc `UpdateProfileRequest`.

## Tạo Request

### Generate Request

Tạo request mới bằng lệnh Sauf:

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

Lệnh này tạo file `CreateUserRequest.ts` trong thư mục `src/http/requests/`.

> [!TIP]
> Truyền nhiều tên để tạo nhiều request cùng lúc.

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

Quy tắc kiểm tra dữ liệu trong lớp Request được viết bằng [Zod](https://zod.dev/). Bạn ghi đè phương thức `rules` và trả về một schema Zod mô tả dữ liệu hợp lệ.

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

Chi tiết về Request API xem [tại đây](../../../api/api-reference/http/request.md).

## Commands

Lệnh Sauf sau liệt kê các route đã đăng ký cùng request của từng route:

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
