---
outline: deep
---

# Controller

Controller chịu trách nhiệm xử lý các yêu cầu HTTP, tương tác với Model và trả về phản hồi thích hợp. Trong Laratype, các Controller thường được sử dụng để tổ chức logic xử lý yêu cầu và phản hồi, giúp mã nguồn trở nên rõ ràng và dễ bảo trì hơn.

> [!INFO]
> Controller được tổ chức trong thư mục `src/http/controllers`.

## Tạo Controller

### Generate Controller

Bạn có thể sử dụng lệnh Sauf để tạo một controller mới:

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

Laratype sẽ tạo một file controller mới trong thư mục `src/http/controllers/` với tên `RegisterController.ts`.

> [!TIP]
> Bạn có thể tạo nhiều controller cùng lúc bằng cách truyền vào nhiều tên.

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

Controller trong Laratype kế thừa từ lớp `Controller` có sẵn trong gói `@laratype/http`. Bạn có thể định nghĩa các phương thức trong controller để xử lý các hành động cụ thể, như tạo, đọc, cập nhật hoặc xóa tài nguyên.

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

`Controller` luôn đảm bảo tính độc lập giữa các `request context`, nghĩa là mỗi lần một `request` được gửi đến `controller`, một instance mới của `controller` sẽ được tạo ra để xử lý yêu cầu đó. Điều này giúp tránh các vấn đề liên quan đến trạng thái chia sẻ giữa các `request` khác nhau.

### Guessing HTTP Status Code

Laratype có khả năng tự động đoán mã trạng thái HTTP phù hợp dựa trên hành động được thực hiện trong controller. Ví dụ, khi tạo một tài nguyên mới, Laratype sẽ trả về mã trạng thái `201 Created`. Khi xóa một tài nguyên, mã trạng thái `204 No Content` sẽ được sử dụng.


| Controller method name        |      HTTP Status Code      |  Description     |
| ----------------------------- | :------------------------: | ---------------: |
| index                         | 200                        | List resources   |
| create                        | 201                        | Create resource  |
| show                          | 200                        | Show resource    |
| update                        | 200                        | Update resource  |
| destroy                       | 204                        | Delete resource  |

Có 2 cách để tùy chỉnh HTTP Status Code trong controller:

- [response()](#response): Sử dụng response() helper để trả về phản hồi với mã trạng thái tùy chỉnh.

- [UseStatusCode()](#usestatuscode): Sử dụng decorator `UseStatusCode()` để chỉ định mã trạng thái cho một phương thức cụ thể trong controller.

> [!IMPORTANT]
> Thứ tự ưu tiên: `response()` > `UseStatusCode()` > Guessing HTTP Status Code.

#### response()

- Sử dụng response() helper để trả về phản hồi với mã trạng thái tùy chỉnh.

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

- Sử dụng decorator `UseStatusCode()` để chỉ định mã trạng thái cho một phương thức cụ thể trong controller.

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
Bạn có thể sử dụng phương thức `redirect()` trong controller để chuyển hướng người dùng đến một URL khác.

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

Bạn có thể kiểm tra danh sách route đã đăng ký và các controller liên quan bằng cách sử dụng lệnh Sauf:

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
