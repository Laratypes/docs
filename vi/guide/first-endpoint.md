# Endpoint đầu tiên

Trang này đi theo một endpoint từ contract tới controller và route. Contract đã có một phần; controller và route đang lên kế hoạch, nên code dưới đây thể hiện thiết kế đã chốt và tên gọi vẫn có thể thay đổi.

::: info Ví dụ minh hoạ
`defineContract` và `defineApi` đang được review trong PR [#204](https://github.com/Laratypes/Laratype/pull/204). Controller ([#105](https://github.com/Laratypes/Laratype/issues/105)) và router ([#104](https://github.com/Laratypes/Laratype/issues/104)) đang lên kế hoạch. Chưa đoạn code nào ở đây chạy được.
:::

## Cấu trúc project <Status issue="125" />

Ứng dụng 0.5 đặt các class trong `app/src/`. v1 bỏ cấp `src/`, nên controller, model và provider nằm thẳng trong `app/`. Cấu trúc dự kiến:

```
app/
  contracts/        dùng chung với frontend (index.ts chứa defineApi)
  http/
    controllers/
    middleware/
    requests/
    resources/
  models/
  policies/
  providers/
  modules/          tuỳ chọn
  routes/
    api.ts
    console.ts
  config/           file config có type
database/
  migrations/
  factories/
  seeders/
```

Lúc build, bước manifest quét `app/` và import tĩnh provider, config, route, command, model, migration và seeder ([#125](https://github.com/Laratypes/Laratype/issues/125)). Lúc chạy không có bước dò file nào. Xem [Build › Manifest lúc build](./build#manifest-luc-build).

Ba đường dẫn do các tính năng đã lên kế hoạch nêu ra chưa được xếp vào cây này: `lang/` cho [đa ngôn ngữ](./localization), `routes/channels.ts` cho [broadcasting](./broadcasting) và `public/` cho [view](./views).

## 1. Khai báo contract <Status issue="93" pr="204" />

```ts
// app/contracts/users.ts
import * as z from 'zod'
import { defineContract, endpoint, errors } from '@laratype/contract'

const UserDto = z.object({ id: z.number(), name: z.string(), email: z.string().email() })

export const users = defineContract('users', {
  index: endpoint.get('/users').query(z.object({ page: z.coerce.number<number>().default(1) })).response(z.array(UserDto)),
  show: endpoint.get('/users/:user').response(UserDto).errors(errors.notFound),
})
```

Rồi thêm nó vào API object:

```ts
// app/contracts/index.ts
import { defineApi } from '@laratype/contract'
import { users } from './users'

export const appApi = defineApi({ users })
export type AppApi = typeof appApi
```

Xem [Contract](./contracts) để biết mọi lời gọi builder và quy tắc.

## 2. Viết controller <Status issue="105" />

Controller là một class có một method cho mỗi endpoint. Mỗi method khai báo type cho tham số bằng `Ctx<typeof endpoint>`, còn dependency đi vào qua constructor:

```ts
// app/http/controllers/UserController.ts
export class UserController implements ControllerOf<typeof users> {
  constructor(private readonly repo: UserRepository) {}

  async index({ query }: Ctx<typeof users.index>) {
    return this.repo.list(query.page)
  }
}
```

- `query` và `body` chứa giá trị đã validate, có type theo output của schema, nên `query.page` là `number`.
- Method trả về dữ liệu đúng dạng schema của response. Để trả lỗi, method trả về `fail(errors.notFound, { message: 'User not found' })`, và chỉ với các lỗi endpoint đã khai báo.
- `implements ControllerOf<typeof users>` là tuỳ chọn. Có nó, thiếu handler hoặc sai kiểu trả về sẽ báo ngay tại method; không có nó, lỗi báo ở route.
- Annotation `Ctx` là bắt buộc, vì `implements` không gán type cho tham số của method.

## 3. Đăng ký route <Status issue="104" />

```ts
// app/routes/api.ts
Route.prefix('/api').group((r) => [
  r.contract(users, UserController),
])
```

`r.contract()` đăng ký mọi endpoint của contract. Nó cũng kiểm tra controller lúc compile: endpoint nào cũng phải có handler, và mỗi handler nhận được đúng những gì nó yêu cầu từ middleware và binding của route. Các bước kiểm tra và thông báo lỗi có trong [Controller › Kiểm chứng ở route](./controllers#kiem-chung-o-route), còn file route có trong [Routing](./routing).

## 4. Gọi từ frontend <Status issue="109" />

Frontend tạo client từ `appApi` bằng `createClient(appApi)` và gọi endpoint theo tên, như `users.show`. Type của request và response lấy từ chính contract đó. API của client đang lên kế hoạch ở [#109](https://github.com/Laratypes/Laratype/issues/109) và được mô tả trong [Client frontend](./client).
