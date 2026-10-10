# Controller

Controller là một class có một method cho mỗi endpoint của contract. Mỗi method khai báo những gì nó cần từ request, và route đăng ký controller đó chứng minh lúc compile rằng nó cung cấp đủ những thứ ấy.

Controller, `Ctx` và `ControllerOf` sẽ nằm trong `@laratype/http`. Cách gán type đã được chốt trong spike S1 ([#84](https://github.com/Laratypes/Laratype/issues/84)), còn code đang lên kế hoạch ở [#105](https://github.com/Laratypes/Laratype/issues/105). Tên các type phụ trợ vẫn có thể được chỉnh lại ở đó.

::: info Ví dụ minh hoạ
Mọi ví dụ trong trang này theo các dạng tham chiếu của spike S1 trong [spec HTTP](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md). Chưa đoạn code nào ở đây chạy được.
:::

Các ví dụ trong nhóm trang HTTP dùng contract dưới đây, mở rộng từ contract trong [Endpoint đầu tiên](./first-endpoint):

```ts
// app/contracts/users.ts (UserDto and CreateUser are zod object schemas)
export const users = defineContract('users', {
  index: endpoint.get('/users').query(z.object({ page: z.coerce.number<number>().default(1) })).response(z.array(UserDto)),
  show: endpoint.get('/users/:user').response(UserDto).errors(errors.notFound),
  store: endpoint.post('/users').body(CreateUser).response(UserDto, 201).errors(errors.validation),
  destroy: endpoint.delete('/users/:user').errors(errors.notFound, errors.forbidden),
})
```

## Handler và `Ctx` <Status issue="105" />

Handler là một method của class. Tham số đầu tiên là context của request, được khai báo type bằng `Ctx<typeof contract.endpoint, Requires>`:

```ts
// app/http/controllers/UserController.ts
import { type Ctx, type ControllerOf } from '@laratype/http' // package per #105, not final
import { users } from '../../contracts/users'

export class UserController implements ControllerOf<typeof users> {
  constructor(private readonly repo: UserRepository) {}

  async index({ query }: Ctx<typeof users.index>) {
    return this.repo.list(query.page)
  }

  async show({ params }: Ctx<typeof users.show, { params: { user: User } }>) {
    return params.user
  }

  // store() and destroy() are shown further down
}
```

Context có các trường sau:

| Trường | Type |
|---|---|
| `params` | Path param, suy type từ chuỗi path |
| `query` | Query đã validate, có type theo **output** của schema |
| `body` | Body đã validate, có type theo **output** của schema |
| `endpoint` | Định nghĩa endpoint (xem [bên dưới](#truong-endpoint)) |

`query` và `body` dùng type output vì chúng chứa giá trị sau khi validate, đã coerce và đã điền giá trị mặc định.

Tham số type thứ hai, `Requires`, liệt kê những gì handler cần **từ route**: các key mà middleware thêm vào (ví dụ `user` từ `auth()`) và các param được resolve bằng [model binding](./model-binding). `Requires` được gộp vào context, riêng `params` được gộp sâu một cấp, nên `params.user` ở trên là `User` thay vì `string`.

Annotation này là bắt buộc. `implements` không gán type cho tham số của method (TypeScript [#23911](https://github.com/microsoft/TypeScript/issues/23911)), nên thiếu nó thì tham số sẽ là `any`.

Lúc chạy, framework luôn gọi handler theo dạng `instance[key](ctx)`, nên `this` dùng được bên trong handler.

## Giá trị trả về và `fail` <Status issue="105" />

Handler trả về dữ liệu đúng dạng schema response của endpoint. Nó trả về type **input** của schema, vì response được serialize sau khi handler chạy xong. Endpoint không có schema response thì không trả về gì.

```ts
// inside UserController
async store({ body }: Ctx<typeof users.store>) {
  return this.repo.create(body)
}
```

Status lấy từ contract: `store` trả `201` vì response của nó được khai báo bằng `.response(UserDto, 201)`. Mặc định là `200`, hoặc `204` khi endpoint không có schema response ([#107](https://github.com/Laratypes/Laratype/issues/107)).

Để trả lỗi, handler trả về `fail(errorDef, body)`:

```ts
import { type Ctx, fail } from '@laratype/http' // package per #105, not final
import { errors } from '@laratype/contract'

// inside UserController
async destroy({ params, user }: Ctx<typeof users.destroy, { params: { user: User }; user: User }>) {
  if (user.role !== 'admin') return fail(errors.forbidden, { message: 'Only admins can delete users' })
  await this.repo.delete(params.user)
}
```

- `fail` chỉ nhận các lỗi mà endpoint đã khai báo trong `.errors()`. Trả về lỗi chưa khai báo là lỗi type.
- Body có type theo định nghĩa lỗi, nên `errors.forbidden` cần `{ message }`.
- `fail` sẽ nằm cạnh `Ctx`, nhiều khả năng trong `@laratype/http`. Package của nó chưa chốt.

[Danh mục lỗi](./contracts#loi) liệt kê các lỗi có sẵn. Cách exception được ném ra biến thành response đang lên kế hoạch ở [#108](https://github.com/Laratypes/Laratype/issues/108) và được mô tả trong [Exception](./exceptions). Status và body của response thành công được mô tả trong [Response và resource](./responses).

## `ControllerOf` <Status issue="105" />

`implements ControllerOf<typeof users>` là tuỳ chọn. Nó đổi chỗ báo lỗi:

- **Có nó,** thiếu handler hoặc sai kiểu trả về sẽ báo ngay tại method.
- **Không có nó,** cùng các lỗi đó sẽ báo tại chỗ route gọi `r.contract()`.

Trường hợp nào code cũng không compile được. `ControllerOf<C>` ánh xạ mỗi key endpoint của `C` sang một method nhận context và trả về kết quả của endpoint, hoặc một promise của kết quả đó.

## Constructor injection <Status issue="105" />

Router resolve controller từ container (`app.make(UserController)`) thay vì gọi `new`. Tham số constructor được inject bằng [DI transform](./dependency-injection#constructor-injection-hoat-đong-the-nao), nên `UserController` ở trên nhận `UserRepository` mà không cần decorator.

Nếu controller phụ thuộc vào một provider có request scope, controller đó cũng thành request scope ([#112](https://github.com/Laratypes/Laratype/issues/112)).

## Trường `endpoint` <Status issue="105" />

`ctx.endpoint` chứa endpoint mà request khớp, có type đúng là endpoint đó. Một giá trị lúc chạy sẽ có ích cho interceptor và logging. Trường này có tồn tại lúc chạy hay chỉ có trong type là câu hỏi còn mở ở [#105](https://github.com/Laratypes/Laratype/issues/105).

## Kiểm chứng ở route <Status issue="105" />

Controller khai báo những gì nó cần, còn route chứng minh điều đó. Khi route đăng ký controller bằng `r.contract()`, nó tính những gì nó cung cấp cho từng endpoint:

```
Provided = Ctx<endpoint, middleware extensions & { params: bound params }>
```

- Phần mở rộng từ middleware là các key mà mọi middleware trên route thêm vào, theo thứ tự (xem [Middleware](./middleware#middleware-co-type)).
- Param đã bind là các mục [`.bind()`](./model-binding) trùng với path param của endpoint đó. Binder là class thì cho ra instance của class. Binder là resolver thì cho ra giá trị trả về khác null, vì không tìm thấy là 404.

Sau đó route kiểm tra từng handler:

- **Yêu cầu:** những gì route cung cấp phải phủ được tham số `Ctx` của handler. Phép kiểm tra chỉ đi một chiều, nên handler cần `user` trên route không có `auth()` sẽ lỗi.
- **Kiểu trả về:** giá trị handler trả về phải khớp schema response hoặc một lỗi đã khai báo.
- **Đủ handler:** endpoint nào cũng cần handler.
- **Đúng endpoint:** handler khai báo type cho endpoint khác sẽ lỗi.
- **Binding:** mọi key của `.bind()` phải là path param của ít nhất một endpoint trong contract.

Lúc chạy không có bước nào kiểm tra lại những điều này.

### Thông báo lỗi

Lỗi nêu tên route (`<contract>.<endpoint>`) và key có vấn đề. Đây là mẫu thông báo từ spike S1; câu chữ cuối cùng sẽ có cùng [#105](https://github.com/Laratypes/Laratype/issues/105):

| Thông báo | Nguyên nhân |
|---|---|
| `` users.destroy: handler requires `user`, route does not provide it (add middleware / .bind()) `` | `Ctx` của handler đòi một key mà không middleware hay binding nào thêm vào |
| `` users.show: `params.user` provided by the route does not match the handler (missing .bind()?) `` | Route cung cấp key đó với type khác, ví dụ param `string` trong khi handler cần `User` |
| `users.show: handler ctx is typed for a different endpoint` | Method được khai báo bằng `Ctx` của endpoint khác |
| `users.show: return type does not match the response schema / declared errors` | Giá trị trả về không khớp response, cũng không khớp lỗi đã khai báo |
| `users.store: controller has no handler for this endpoint` | Thiếu method |
| `` .bind(): `post` is not a path param of any endpoint in users `` | Key binding không có trong path nào |

Key có thể lồng nhau, như `params.user`. TypeScript in các thông báo này dưới dạng tên thuộc tính của type nó mong đợi, vì nó in tên đầy đủ còn type dài thì bị rút gọn.

Middleware riêng cho từng endpoint trong một contract (ví dụ `auth()` chỉ cho `destroy`) chưa chốt. Việc này được theo dõi ở [#105](https://github.com/Laratypes/Laratype/issues/105) và [#117](https://github.com/Laratypes/Laratype/issues/117).

## Chế độ strict contract <Status issue="157" />

Một chế độ dành cho môi trường dev, `--strict-contract`, đang được lên kế hoạch để giữ contract trung thực lúc chạy. Nó cảnh báo hoặc báo lỗi khi một lỗi được ném ra mà chưa khai báo trong `.errors()` của endpoint, hoặc khi output của handler không khớp schema response. Nó phụ thuộc vào phần xử lý exception ở [#108](https://github.com/Laratypes/Laratype/issues/108).
