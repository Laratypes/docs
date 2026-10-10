# Phân quyền

Phân quyền (authorization) quyết định user đã đăng nhập có được làm một việc hay không. Giống Laravel, các quy tắc nằm trong policy và gate. Ở v1, ability của chúng có type, nên viết sai tên ability là lỗi compile, và route có thể kiểm tra policy trước khi handler chạy.

Policy và gate sẽ nằm trong `@laratype/auth`, còn phần kiểm tra trên route nằm trong `@laratype/http`. Toàn bộ đang lên kế hoạch: policy và gate ở [#121](https://github.com/Laratypes/Laratype/issues/121), kiểm tra trên route ở [#122](https://github.com/Laratypes/Laratype/issues/122).

::: info Ví dụ minh hoạ
Ví dụ theo ghi chú thiết kế trong [spec auth](https://github.com/Laratypes/Laratype/blob/master/docs/v1/auth.md) và [spec HTTP](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md). Chưa đoạn code nào ở đây chạy được, và tên gọi có thể thay đổi. Ví dụ dùng contract `users` và `UserController` từ trang [Controller](./controllers).
:::

## Policy và gate <Status issue="121" />

- Ability của một policy là `keyof Policy`, tức các key của type policy.
- `Gate.allows` và `user.can()` có type. Một ability không tồn tại là lỗi type.
- Cách này thay cho ability dạng chuỗi của bản 0.5.

Hình dạng của một class policy và cách liên kết policy với model chưa được đặc tả ([#121](https://github.com/Laratypes/Laratype/issues/121)). Ở v0.5.4, `sauf make:policy` tạo một class policy.

## Policy trên route <Status issue="122" />

`.can()` trong chuỗi route kiểm tra một policy cho từng endpoint:

```ts
// app/routes/api.ts
r.middleware(auth('api'))
  .bind({ user: User })
  .can({ show: ['view', 'user'] })
  .contract(users, UserController)
```

- Key là endpoint (`show`).
- Phần tử đầu là ability. Nó lấy từ `keyof Policy`, nên gõ sai sẽ không compile được.
- Phần tử thứ hai là tên một param đã bind (`user`, từ `.bind()`). Policy nhận model đã bind làm tham số.
- Bị từ chối thì trả 403 lúc chạy.

Cách này thay cho tham số dạng chuỗi tự do của bản 0.5, `can('view', 'user')` (`RoutePolicy.make`). `.can()` cần [model binding](./model-binding) ([#118](https://github.com/Laratypes/Laratype/issues/118)) và policy có type ([#121](https://github.com/Laratypes/Laratype/issues/121)).

Kiểm tra policy là bước 3 của [pipeline](./middleware#thu-tu-pipeline). Nó chạy sau các middleware như `auth()` và trước `FormRequest.authorize()`. Một FormRequest có thể tự quyết định trong `authorize()`, xem [Validation › FormRequest](./validation#formrequest).

Thứ tự chuỗi ở đây theo spike S1 và chưa chốt (xem [Routing › Đăng ký contract](./routing#đang-ky-contract)).
