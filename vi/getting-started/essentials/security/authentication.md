---
outline: deep
---

# Xác thực

Xác thực (Authentication) là quá trình xác minh danh tính của người dùng hoặc hệ thống trước khi cho phép truy cập vào các tài nguyên được bảo vệ. Laratype cung cấp một hệ thống xác thực linh hoạt và mạnh mẽ.

## Bắt đầu nhanh

Mặc định laratype sẽ tự xác thực người dùng dựa trên `Bearer Token` của `Request Header`. Để bảo vệ route và yêu cầu xác thực, bạn có thể sử dụng middleware `AuthGuard`.

Laratype cung cấp các phương thức xác thực tiện lợi thông qua các `middleware` và helper `Auth`.

### Xác thực tự động (Automatic Authentication)

Bằng cách thêm `middleware`, laratype sẽ tự động xác thực người dùng dựa trên `Bearer Token` trong `Request Header`. Bạn sẽ không cần phải làm gì thêm để kích hoạt tính năng này.

::: code-group

```ts [LocalAuthMiddleware.ts]{6}
import { Passport } from "@laratype/auth";
import { Middleware, type MiddlewareHandler } from "@laratype/http";

export default class LocalAuthMiddleware extends Middleware {
  handle: MiddlewareHandler = async (request, res, next) => {
    const handler = await Passport.authenticate("web");

    return handler(res, next);
  };
}
```
:::

> [!INFO]
> `Passport.authenticate('web')` sử dụng guard `web` được định nghĩa trong `config/auth.ts`, bạn có thể tùy chỉnh các tùy chọn xác thực tại đây.

Thêm `LocalAuthMiddleware.ts` vào route hoặc nhóm route bạn muốn xác thực:

::: code-group

```ts [api.ts]{12}
import { controller } from "@laratype/http";
import LoginController from "../src/http/controllers/LoginController";
import LocalAuthMiddleware from "../src/http/middleware/LocalAuthMiddleware";

export default {
  path: "/auth",
  children: [
    {
      path: "/login",
      controller: controller(LoginController, 'me'),
      middleware: [
        LocalAuthMiddleware
      ],
      method: "get",
    },
  ],
};
```
:::

### Lấy người dùng đã xác thực (Retrieving the Authenticated User)

Trong controller hoặc bất kỳ nơi nào có access tới request/ctx, bạn có thể lấy người dùng hiện tại như sau:

::: code-group

```ts [ProfileController.ts]
import { Request } from "@laratype/http";
import { Auth } from "@laratype/auth";

export default class ProfileController {
  async show(request: Request) {
    const user = Auth.user<User>(); // trả về model User | null

    if (!user) {
      return new UnauthorizedException();
    }

    return user;
  }
}
```
:::

### Sinh token (Generating Tokens)

Laratype hỗ trợ sinh token JWT để xác thực người dùng. Bạn có thể sử dụng phương thức `AuthVerification.sign` để tạo token cho người dùng đã xác thực.

::: code-group

```ts [LoginController.ts]
// See more at: https://github.com/Laratypes/Laratype/tree/master/examples/basic
import { Auth, AuthVerification } from "@laratype/auth";
import { Controller, Request } from "@laratype/http";
import { User } from "../../models/User";

export default class LoginController extends Controller {
  // [!code focus:14]
  async login(request: Request) {
    const authenticated = Auth.user<User>()
    const jwtToken = await authenticated.generateToken({
      name: "Default Token",
      abilities: "*",
    });

    const user = authenticated.getUser();

    return {
      user,
      token: jwtToken,
    }
  }
}
```
:::

### Xác thực token

Laratype hỗ trợ xác thực token JWT thông qua middleware `AuthGuard`. Middleware này sẽ tự động kiểm tra token trong `Authorization` header của request.

> [!TIP]
> Bạn có thể xác thực thủ công bằng cách không dùng [Protecting Routes middleware](#bảo-vệ-route-protecting-routes), sau đó tùy chỉnh logic xác thực trong controller hoặc service của bạn.

```ts
import { AuthVerification } from "@laratype/auth";

const authenticationHeader = req.header("Authorization", "");
const token = authenticationHeader.split("Bearer ")[1];
if (!token) {
  throw new Error("No token provided");
}
const user = await AuthVerification.verify(token);

return {
  user,
}

```

### Bảo vệ route (Protecting Routes)

Sử dụng middleware `AuthGuard` để bảo vệ route trong router:

::: code-group

```ts [api.ts]{2,7}
import { RouteOptions } from "@laratype/http";
import { AuthGuard } from "@laratype/auth";

const authGuardedRoutes: RouteOptions = {
  path: "/",
  middleware: [
    AuthGuard
  ],
  children: [
    {
      path: "/me",
      controller: UserController.__invoke("me"),
      method: "get",
    },
  ],
};
```
:::

> [!INFO]
> Middleware `AuthGuard` sẽ trả về lỗi 401 nếu request chưa được xác thực.

### Giới hạn số lần thử đăng nhập (Login Throttling) <Badge type="warning" text="coming soon" />

Tính năng giới hạn số lần thử đăng nhập (login throttle) sẽ được bổ sung sớm. Mục tiêu: chống brute-force bằng cách giới hạn số lần đăng nhập thất bại theo IP hoặc theo account trong khoảng thời gian.

## Xác thực thủ công (Manually Authenticating Users)

Trong một số trường hợp, bạn có thể muốn xác thực người dùng một cách thủ công mà không sử dụng middleware.

::: code-group

```ts [LoginController.ts]
// See more at: https://github.com/Laratypes/Laratype/tree/master/examples/basic
import { Auth, AuthVerification } from "@laratype/auth";
import { Controller, Request } from "@laratype/http";
import { User } from "../../models/User";

export default class LoginController extends Controller {
  // [!code focus:23]
  async manualLogin(request: Request) {
    const data = req.validated();

    const attempt = await Auth.guard<User>('web').attempt(data)

    if(!attempt) {
      return new UnauthorizedException({
        message: "Invalid credentials",
      });
    }
    
    const jwtToken = await attempt.generateToken({
      name: "Default Token",
      abilities: "*",
    });

    const user = attempt.getUser();

    return {
      user,
      token: jwtToken,
    }
  }
}
```
:::

### Tùy chọn xác thực (Specifying Additional Conditions) <Badge type="warning" text="coming soon" />

> [!NOTE]
> Hỗ trợ thêm tùy chọn điều kiện khi xác thực (ví dụ: chỉ cho phép người dùng có `is_active = true`) sẽ được giới thiệu trong bản cập nhật tới.

### Truy cập các instance Guard cụ thể <Badge type="warning" text="coming soon" />

> [!NOTE]
> Hướng dẫn truy cập các instance Guard cụ thể sẽ được bổ sung trong các bản cập nhật tiếp theo.

### Ghi nhớ đăng nhập (Remembering Users) <Badge type="warning" text="coming soon" />

> [!NOTE]
> Hệ thống "remember me" (Token TTL) sẽ được thêm cùng với hướng dẫn cấu hình tại `config/auth.ts`.

## Đăng xuất (Logout), Hủy Token (Deactivating Tokens) <Badge type="warning" text="coming soon" />

> [!NOTE]
> Hướng dẫn đăng xuất (logout) và hủy token sẽ được bổ sung trong các bản cập nhật tiếp theo.
