# Response và resource

Handler trả về dữ liệu, và framework dựng HTTP response từ contract của endpoint: status code, body JSON và type của nó. Resource biến một model thành body mà contract yêu cầu.

Cả hai sẽ nằm trong `@laratype/http`. Chúng thay cho hai cách làm của bản 0.5: đoán status từ tên method của controller (`ControllerMethodHttpStatusCode`) và `JsonResource`, có `toJson()` trả về `any`. Toàn bộ phần này đang lên kế hoạch: response ở [#107](https://github.com/Laratypes/Laratype/issues/107) và resource ở [#123](https://github.com/Laratypes/Laratype/issues/123).

::: info Ví dụ minh hoạ
Các ví dụ theo ghi chú thiết kế trong [spec HTTP](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md). Chưa đoạn code nào ở đây chạy được, và tên gọi có thể thay đổi. Các ví dụ dùng contract `users` và `UserController` từ trang [Controller](./controllers).
:::

## Mã trạng thái <Status issue="107" />

Status của một response thành công lấy từ contract:

- `.response(schema, status)` đặt status một cách tường minh.
- `.response(schema)` không kèm status cho `200`.
- Endpoint không có schema response cho `204`.

Với contract `users`:

| Endpoint | Response khai báo | Status |
|---|---|---|
| `users.index` | `.response(z.array(UserDto))` | 200 |
| `users.show` | `.response(UserDto)` | 200 |
| `users.store` | `.response(UserDto, 201)` | 201 |
| `users.destroy` | không có | 204 |

Tên method của handler không ảnh hưởng gì. Status của lỗi lấy từ định nghĩa lỗi, xem [Exception](./exceptions).

## Body của response <Status issue="107" />

Handler trả về type **input** của schema response, và framework serialize nó thành JSON sau đó (xem [Controller › Giá trị trả về và `fail`](./controllers#gia-tri-tra-ve-va-fail)). Khi dev, output có thể được validate theo schema response, nếu bạn bật.

Serialize là bước 9 của [pipeline](./middleware#thu-tu-pipeline), sau handler và interceptor.

Type mà frontend nhận được vẫn còn mở. Output của schema response có thể chứa giá trị mà JSON biến thành thứ khác, như `Date` đến nơi thành `string`. Wire type cho trường hợp này đang được bàn ở [#107](https://github.com/Laratypes/Laratype/issues/107) và [#110](https://github.com/Laratypes/Laratype/issues/110).

## Resource <Status issue="123" />

`defineResource(Model, fn)` khai báo cách một model trở thành body của response. Type output được suy ra từ `fn`:

```ts
// app/http/resources/UserResource.ts
import { defineResource } from '@laratype/http' // package per #123, not final
import { User } from '../../models/User'

export const UserResource = defineResource(User, (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
}))
```

Handler trả về resource cho một model bằng `.make`:

```ts
// inside UserController
async show({ params }: Ctx<typeof users.show, { params: { user: User } }>) {
  return UserResource.make(params.user)
}
```

- Contract là nguồn chuẩn. Output của resource được kiểm tra theo schema response của endpoint, và nếu không khớp thì là lỗi type.
- `.collection` và `.paginate` dùng cho danh sách và phân trang, còn `when()` chỉ đưa một trường vào khi thoả điều kiện. Signature của chúng chưa chốt ([#123](https://github.com/Laratypes/Laratype/issues/123)).

Ở v0.5.4, `sauf make:resource` tạo một class `JsonResource`. v1 giữ resource và suy ra type của nó.
