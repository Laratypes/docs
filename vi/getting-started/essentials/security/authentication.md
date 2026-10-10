---
outline: deep
---

# Xác thực

Xác thực (authentication) là bước kiểm tra danh tính của người dùng hoặc hệ thống trước khi cho truy cập tài nguyên được bảo vệ.

## Bắt đầu nhanh

Mặc định, Laratype xác thực người dùng bằng `Bearer Token` trong `Request Header`. Route nào cần đăng nhập thì gắn middleware `AuthGuard`.

Các công cụ xác thực chính là `middleware` và helper `Auth`.

### Xác thực tự động (Automatic Authentication)

Chỉ cần gắn `middleware`, Laratype sẽ tự xác thực người dùng bằng `Bearer Token` trong `Request Header`, không cần cấu hình gì thêm.

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
> `Passport.authenticate('web')` dùng guard `web` khai báo trong `config/auth.ts`. Các tùy chọn xác thực cũng được chỉnh trong file đó.

Gắn `LocalAuthMiddleware.ts` vào route hoặc nhóm route cần xác thực:

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

Ở controller, hoặc ở bất kỳ đâu truy cập được request/ctx, lấy người dùng hiện tại như sau:

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

Laratype sinh được token JWT cho người dùng đã xác thực: gọi `generateToken()` trên đối tượng mà `Auth.user()` hoặc `Auth.guard(...).attempt(...)` trả về.

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

Middleware `AuthGuard` kiểm tra token JWT trong header `Authorization` của request.

> [!TIP]
> Muốn tự xác thực thì bỏ [Protecting Routes middleware](#bảo-vệ-route-protecting-routes) và tự viết logic xác thực trong controller hoặc service.

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

Gắn middleware `AuthGuard` vào route cần bảo vệ:

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
> Request chưa xác thực sẽ nhận lỗi 401 từ `AuthGuard`.

### Giới hạn số lần thử đăng nhập (Login Throttling) <Badge type="warning" text="coming soon" />

Giới hạn số lần thử đăng nhập (login throttle) sẽ có trong bản sau. Tính năng này chống brute-force bằng cách giới hạn số lần đăng nhập sai theo IP hoặc theo tài khoản trong một khoảng thời gian.

## Xác thực thủ công (Manually Authenticating Users)

Bạn cũng có thể tự xác thực người dùng mà không qua middleware:

::: code-group

```ts [LoginController.ts]
// See more at: https://github.com/Laratypes/Laratype/tree/master/examples/basic
import { Auth, AuthVerification } from "@laratype/auth";
import { Controller, Request } from "@laratype/http";
import { User } from "../../models/User";

export default class LoginController extends Controller {
  // [!code focus:23]
  async manualLogin(request: Request) {
    const data = request.validated();

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
> Bản cập nhật tới sẽ cho thêm điều kiện khi xác thực, ví dụ chỉ chấp nhận người dùng có `is_active = true`.

### Truy cập các instance Guard cụ thể <Badge type="warning" text="coming soon" />

> [!NOTE]
> Hướng dẫn truy cập từng instance Guard sẽ có trong bản cập nhật sau.

### Ghi nhớ đăng nhập (Remembering Users) <Badge type="warning" text="coming soon" />

> [!NOTE]
> Tính năng "remember me" (Token TTL) sẽ có sau, kèm hướng dẫn cấu hình trong `config/auth.ts`.

## Đăng xuất (Logout), Hủy Token (Deactivating Tokens) <Badge type="warning" text="coming soon" />

> [!NOTE]
> Hướng dẫn đăng xuất (logout) và hủy token sẽ có trong bản cập nhật sau.
