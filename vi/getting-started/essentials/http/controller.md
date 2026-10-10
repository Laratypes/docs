---
outline: deep
---

# Controller

Controller nhận yêu cầu HTTP, làm việc với Model và trả về response. Gom phần xử lý request vào controller giúp code dễ đọc và dễ bảo trì hơn.

> [!INFO]
> Controller nằm trong thư mục `src/http/controllers`.

## Tạo Controller

### Generate Controller

Tạo controller mới bằng lệnh Sauf:

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

Lệnh này tạo file `RegisterController.ts` trong thư mục `src/http/controllers/`.

> [!TIP]
> Truyền nhiều tên để tạo nhiều controller cùng lúc.

::: details Xem thêm

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

Controller kế thừa lớp `Controller` của gói `@laratype/http`. Mỗi phương thức trong controller xử lý một hành động, ví dụ tạo, đọc, cập nhật hoặc xóa tài nguyên.

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

Mỗi `request` gửi tới được xử lý bởi một instance `controller` mới. Các `request context` vì thế tách biệt nhau, và không `request` nào thấy trạng thái còn sót lại từ `request` khác.

### Guessing HTTP Status Code

Laratype tự chọn mã trạng thái HTTP theo hành động trong controller. Ví dụ, tạo tài nguyên mới trả về `201 Created`, còn xóa tài nguyên trả về `204 No Content`.


| Controller method name        |      HTTP Status Code      |  Description     |
| ----------------------------- | :------------------------: | ---------------: |
| index                         | 200                        | List resources   |
| create                        | 201                        | Create resource  |
| show                          | 200                        | Show resource    |
| update                        | 200                        | Update resource  |
| destroy                       | 204                        | Delete resource  |

Có hai cách đặt mã trạng thái khác:

- [response()](#response): trả response kèm mã trạng thái bằng helper `response()`.

- [UseStatusCode()](#usestatuscode): gắn decorator `UseStatusCode()` lên một phương thức của controller.

> [!IMPORTANT]
> Thứ tự ưu tiên: `response()` > `UseStatusCode()` > Guessing HTTP Status Code.

#### response()

Helper `response()` nhận dữ liệu và mã trạng thái:

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

Decorator `UseStatusCode()` đặt mã trạng thái cho một phương thức:

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
Gọi `redirect()` trong controller để chuyển người dùng sang URL khác:

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

Lệnh Sauf sau liệt kê các route đã đăng ký cùng controller của từng route:

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
