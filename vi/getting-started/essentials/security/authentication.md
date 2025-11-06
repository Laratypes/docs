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

```ts {7}
// LocalAuthenticationMiddleware.ts
import { Passport } from "@laratype/auth";
import { Middleware, type MiddlewareHandler } from "@laratype/http";

export default class LocalAuthentication extends Middleware {
  handle: MiddlewareHandler = async (request, res, next) => {
    const handler = await Passport.authenticate("web");

    return handler(res, next);
  };
}
```

`Passport.authenticate('web')` sử dụng guard `web` được định nghĩa trong `config/auth.ts`, bạn có thể tùy chỉnh các tùy chọn xác thực tại đây.

Thêm `LocalAuthenticationMiddleware.ts` vào route hoặc nhóm route bạn muốn xác thực:

```ts {10}
import LocalAuthentication from "../middleware/LocalAuthenticationMiddleware";

export default {
  path: "/auth",
  children: [
    {
      path: "/login",
      controller: LoginController.__invoke("me"),
      middleware: [
        LocalAuthentication
      ],
      method: "get",
    },
  ],
};
```

### Lấy người dùng đã xác thực (Retrieving the Authenticated User)

Trong controller hoặc bất kỳ nơi nào có access tới request/ctx, bạn có thể lấy người dùng hiện tại như sau:

```ts
import { Request } from "@laratype/http";
import { Auth } from "@laratype/auth";

// Controller example
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

### Sinh token (Generating Tokens)

Laratype hỗ trợ sinh token JWT để xác thực người dùng. Bạn có thể sử dụng phương thức `AuthVerification.sign` để tạo token cho người dùng đã xác thực.

```ts
// LoginController.ts
import { Auth, AuthVerification } from "@laratype/auth";
import { Controller, Request } from "@laratype/http";
import { User } from "../../models/User";

export default class LoginController extends Controller {

  async login(request: Request) {
    // Giả sử người dùng đã được xác thực thành công
    const user = Auth.user<User>()
    const jwtToken = await AuthVerification.sign(user, {
      name: "Default Token", // Token name
      abilities: "*", // Token abilities
    });

    return {
      user,
      token: jwtToken,
    }
  }
}
```

### Xác thực token

Laratype hỗ trợ xác thực token JWT thông qua middleware `AuthGuard`. Middleware này sẽ tự động kiểm tra token trong `Authorization` header của request.

Tuy nhiên bạn có thể xác thực thủ công bằng cách không dùng [Protecting Routes middleware](#bảo-vệ-route-protecting-routes), sau đó tùy chỉnh logic xác thực trong controller hoặc service của bạn.

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

```ts {2,7}
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

Middleware `AuthGuard` sẽ trả về lỗi 401 nếu request chưa được xác thực.

### Giới hạn số lần thử đăng nhập (Login Throttling) <Badge type="warning" text="coming soon" />

Tính năng giới hạn số lần thử đăng nhập (login throttle) sẽ được bổ sung sớm. Mục tiêu: chống brute-force bằng cách giới hạn số lần đăng nhập thất bại theo IP hoặc theo account trong khoảng thời gian.

## Xác thực thủ công (Manually Authenticating Users) <Badge type="warning" text="coming soon" />

Bạn có thể xác thực (login) người dùng bằng tay trong controller hoặc service.

### Tùy chọn xác thực (Specifying Additional Conditions) <Badge type="warning" text="coming soon" />

Hỗ trợ thêm tùy chọn điều kiện khi xác thực (ví dụ: chỉ cho phép người dùng có `is_active = true`) sẽ được giới thiệu trong bản cập nhật tới.

### Truy cập các instance Guard cụ thể <Badge type="warning" text="coming soon" />

### Ghi nhớ đăng nhập (Remembering Users) <Badge type="warning" text="coming soon" />

Hệ thống "remember me" (Token TTL) sẽ được thêm cùng với hướng dẫn cấu hình tại `config/auth.ts`.

## Đăng xuất (Logout), Hủy Token (Deactivating Tokens) <Badge type="warning" text="coming soon" />

Hướng dẫn đăng xuất (logout) và hủy token sẽ được bổ sung trong các bản cập nhật tiếp theo.
