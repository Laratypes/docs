# Model binding

Path param đến dưới dạng chuỗi. Model binding biến một param như `:user` thành model mà nó trỏ tới trước khi handler chạy, và trả 404 khi không tìm thấy. Sau đó handler khai báo param đó là model trong `Ctx` của nó.

Binding là một phần của router trong `@laratype/http`. Nó phụ thuộc vào tầng model, mà thiết kế ORM thì chưa quyết định (S5 [#88](https://github.com/Laratypes/Laratype/issues/88)). Cả hai kiểu binding đang lên kế hoạch và chờ quyết định đó.

::: info Ví dụ minh hoạ
Các ví dụ theo ghi chú thiết kế trong [spec HTTP](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md#model-binding). Chưa đoạn code nào ở đây chạy được, và API của model chưa được thiết kế. Ví dụ dùng contract `users` và `UserController` trong [Controller](./controllers).
:::

## Binding tường minh <Status issue="118" />

`.bind()` trên route ánh xạ path param sang model:

```ts
r.middleware(auth()).bind({ user: User }).contract(users, UserController)
```

- Key phải là path param của các endpoint trong contract. `.bind({ post: Post })` trên contract `users` sẽ báo lỗi `` .bind(): `post` is not a path param of any endpoint in users ``.
- Một class model tra param và cho ra instance của class đó.
- Không tìm thấy thì trả 404.
- Binding thêm `{ params: { user: User } }` vào những gì route cung cấp, chỉ cho các endpoint có `:user` trong path.

Để tra theo cách riêng, truyền một resolver thay cho class:

```ts
r.bind({ user: (value) => findActiveUser(value) }).contract(users, UserController)
```

Type được bind là giá trị resolver trả về sau khi await, bỏ `null` và `undefined`, vì không tìm thấy là 404.

Handler đòi type đã bind trong `Ctx` của nó:

```ts
async show({ params }: Ctx<typeof users.show, { params: { user: User } }>) {
  return params.user
}
```

Nếu route không có `.bind()` cho `user`, `r.contract()` báo `` users.show: `params.user` provided by the route does not match the handler (missing .bind()?) ``. Xem [Controller › Kiểm chứng ở route](./controllers#kiem-chung-o-route).

Binding tường minh thay cho `Route.model` và `Route.bind` của bản 0.5. Path param tuỳ chọn đi với `.bind()` (type có thành `User | undefined` hay không) là câu hỏi còn mở ở [#118](https://github.com/Laratypes/Laratype/issues/118).

## Binding ngầm định <Status issue="163" />

Với binding ngầm định, trường hợp thông thường không cần `.bind()`:

- Path param có tên trùng một key trong `Register['models']` được bind vào model đó. Manifest lúc build sinh ra map này, key là tên model dạng camelCase, nên `:user` được bind vào `User`.
- `.bind()` tường minh cho cùng param thì được ưu tiên.
- `.withoutImplicitBinding()` tắt binding ngầm định cho một route.
- `static routeKeyName` trên model đặt cột dùng để tra. Mặc định là khoá chính.
- `.scopeBindings()` xử lý param lồng nhau, như trong `/users/:user/posts/:post`.

Binding ngầm định thay cho biến global `__laratype_param_model_map` của bản 0.5.
