# Xác thực

Xác thực (authentication) xác định ai đã gửi request. Ở v1, user đã đăng nhập có một type mà bạn khai báo một lần, và middleware `auth()` đưa user có type đó vào handler. Handler cần user trên một route không có `auth()` sẽ không compile được.

Phần xác thực sẽ nằm trong `@laratype/auth`. Package bản 0.5 đã có guard, hỗ trợ Passport, policy và gate; v1 gán type cho chúng và resolve chúng từ container. Toàn bộ đang lên kế hoạch, và [spec auth](https://github.com/Laratypes/Laratype/blob/master/docs/v1/auth.md) hiện chỉ có ghi chú thiết kế ngắn: signature sẽ được bổ sung khi các issue hoàn thành.

::: info Ví dụ minh hoạ
Các ví dụ theo ghi chú thiết kế trong spec auth. Chưa đoạn code nào ở đây chạy được, và tên gọi có thể thay đổi. Các ví dụ dùng contract `users` và `UserController` từ trang [Controller](./controllers).
:::

## Interface `Register` <Status issue="119" />

Bạn khai báo type của user một lần, bằng cách mở rộng interface `Register` của `@laratype/auth`:

```ts
declare module '@laratype/auth' {
  interface Register {
    user: User
    guards: { /* ... */ }
  }
}
```

Sau đó `Auth.user()` có type `User | null`. Ở v0.5.4, type của user được truyền ở từng lần gọi, như `Auth.user<User>()`. v1 bỏ các ép kiểu đó.

Nội dung dưới `guards` chưa được đặc tả ([#119](https://github.com/Laratypes/Laratype/issues/119)).

`Auth` trở thành một facade của container ([#115](https://github.com/Laratypes/Laratype/issues/115), xem [Dependency Injection › Registry và facade](./dependency-injection#registry-va-facade)).

## Middleware `auth()` <Status issue="120" />

`auth('api')` xác thực request bằng guard `api` và thêm `{ user }` vào context của handler. Type của `user` lấy theo guard được chọn. Khi chưa có ai đăng nhập, request dừng lại với 401 (`errors.unauthorized`).

```ts
// app/routes/api.ts
r.middleware(auth('api')).bind({ user: User }).contract(users, UserController)
```

Handler đòi user trong `Ctx` của nó, như `destroy` ở trang [Controller](./controllers#gia-tri-tra-ve-va-fail):

```ts
async destroy({ params, user }: Ctx<typeof users.destroy, { params: { user: User }; user: User }>) {
  // ...
}
```

Nếu route không có `auth()`, `r.contract()` không compile được và báo `` users.destroy: handler requires `user`, route does not provide it (add middleware / .bind()) ``. Xem [Controller › Kiểm chứng ở route](./controllers#kiem-chung-o-route).

`auth()` là một [middleware có type](./middleware#middleware-co-type) ([#117](https://github.com/Laratypes/Laratype/issues/117)).

## Guard <Status issue="151" />

Guard quyết định cách xác thực một request. Các guard jwt, session và passport được resolve từ container và cấu hình qua config có type ([#152](https://github.com/Laratypes/Laratype/issues/152), xem [Cấu hình](./configuration)). Các key của config chưa được đặc tả.

Phần việc này xong khi các luồng xác thực trong ứng dụng `examples/basic` chạy qua ([#151](https://github.com/Laratypes/Laratype/issues/151)).

Một OAuth2 server với token guard riêng được lên kế hoạch tách biệt, xem [OAuth2 server](./oauth2).
