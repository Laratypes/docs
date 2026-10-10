# Routing

Route nối contract với controller. Bạn viết route trong file route giống Laravel, và router đăng ký chúng lên [Hono](https://hono.dev). Router v2 thay cho cây object `RouteOptions` của bản 0.5.

Router sẽ nằm trong `@laratype/http`. Toàn bộ phần này đang lên kế hoạch; issue chính là [#104](https://github.com/Laratypes/Laratype/issues/104).

::: info Ví dụ minh hoạ
Các ví dụ theo ghi chú thiết kế và các dạng của spike S1 trong [spec HTTP](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md). Chưa đoạn code nào ở đây chạy được, và tên gọi có thể thay đổi. Ví dụ dùng contract `users` và `UserController` trong [Controller](./controllers).
:::

## File route <Status issue="104" />

Route API nằm trong `app/routes/api.ts`. Một file route bắt đầu từ `Route`, đặt prefix cho một nhóm (và nếu cần thì `.middleware(...)` cho cả nhóm), rồi liệt kê các route bên trong:

```ts
// app/routes/api.ts
import { Route } from '@laratype/http'
import { auth } from '@laratype/auth'
import { users } from '../contracts/users'
import { UserController } from '../http/controllers/UserController'
import { User } from '../models/User'

export const api = Route.prefix('/api').group((r) => [
  r.middleware(auth()).bind({ user: User }).contract(users, UserController),
  r.get('/health', () => 'ok'),
])
```

Manifest lúc build import tĩnh các file route, nên không cần đăng ký gì bằng tay ([#125](https://github.com/Laratypes/Laratype/issues/125), xem [Build › Manifest lúc build](./build#manifest-luc-build)).

## Đăng ký contract <Status issue="104" />

`r.contract(contract, Controller)` đăng ký mọi endpoint của contract, với method và path lấy từ contract. Mỗi endpoint gọi method cùng key trên controller, nên `users.show` gọi `UserController.show`.

Những gì đứng trước `.contract()` áp dụng cho mọi endpoint của contract:

| Lời gọi | Thêm gì |
|---|---|
| `.middleware(...m)` | Middleware, cùng các key context mà chúng thêm vào (xem [Middleware](./middleware#middleware-co-type)) |
| `.bind({ key: Model })` | Model binding cho một path param (xem [Model binding](./model-binding)) |
| `.can({ endpoint: [ability, param] })` | Kiểm tra policy cho từng endpoint, lên kế hoạch ở [#122](https://github.com/Laratypes/Laratype/issues/122) (xem [Phân quyền › Policy trên route](./authorization#policy-tren-route)) |

Sau đó `.contract()` kiểm tra controller với mọi thứ chuỗi lời gọi cung cấp, lúc compile. Handler đòi `user` trên route không có `auth()` sẽ không compile được. Các bước kiểm tra và thông báo lỗi có trong [Controller › Kiểm chứng ở route](./controllers#kiem-chung-o-route).

Chuỗi lời gọi ở đây theo spike S1. Thứ tự chính xác của nó chưa chốt ([#104](https://github.com/Laratypes/Laratype/issues/104), [#105](https://github.com/Laratypes/Laratype/issues/105)). Middleware chỉ cho một số endpoint trong một contract cũng chưa chốt ([#117](https://github.com/Laratypes/Laratype/issues/117)).

## Route registry <Status issue="104" />

Mỗi route đã đăng ký thành một mục trong route registry, gồm tên (`users.show`), method, path, định nghĩa endpoint, controller và middleware.

- `sauf route:list` in registry ra (xem [CLI sauf](./cli)).
- Bước [sinh OpenAPI](./type-generation#openapi) ([#143](https://github.com/Laratypes/Laratype/issues/143)) và [Detective](./type-generation#detective) ([#144](https://github.com/Laratypes/Laratype/issues/144)) cũng đọc nó.
- Registry là một service trong container, `RouteRegistry` ([#114](https://github.com/Laratypes/Laratype/issues/114)), thay cho biến global `__laratype_routes` của bản 0.5.

## Route không có contract <Status issue="139" />

Route không có contract giữ kiểu viết nhanh của Laravel:

```ts
r.get('/health', () => 'ok')
```

Type của nó được suy ra từ handler. Vì không có schema, route này không có trong OpenAPI. Nó cũng không nằm trong `appApi`, nên client có type không biết gì về nó.

## Tên route và URL <Status issue="162" />

Mỗi endpoint của contract có một tên route, `<contract>.<endpoint>`, lấy từ `defineApi` (xem [Contract › Khai báo contract](./contracts#khai-bao-contract)). URL theo tên đang lên kế hoạch:

- `route('users.show', { user })` tạo URL cho một tên route. Param có type theo path.
- `redirect().route('users.show', { user })` trả về redirect tới URL đó.
- Param đã bind nhận một model, và model cho ra route key của nó.
- Route không có contract được đặt tên bằng `.name()`.
- URL tuyệt đối bắt đầu bằng `config('app.url')`.

`route()` sẽ dùng chung hàm tạo URL với client frontend. Hàm đó sẽ nằm trong `@laratype/contract`, và chữ ký của nó chưa cố định (xem [Contract › Tạo URL](./contracts#tao-url)).

## CORS <Status issue="164" />

`cors()` là middleware có sẵn, bọc `hono/cors`. Mặc định nó được đăng ký làm middleware toàn cục và trả lời request preflight cho các route có contract.

Nó đọc một file config có type, `app/config/cors.ts` (xem [Cấu hình](./configuration)). Config gồm path, origin, method và header được phép, header được expose, max age và credentials. Các tuỳ chọn giống `hono/cors`, nhưng tên key chưa chốt.
