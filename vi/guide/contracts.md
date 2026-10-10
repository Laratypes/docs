# Contract

Contract mô tả một nhóm endpoint: method và path, schema cho dữ liệu vào và ra, và các lỗi có thể trả về. Contract là một giá trị lúc chạy, nên router, client frontend, bước sinh type và OpenAPI đều đọc cùng một object.

Contract nằm trong `@laratype/contract`. Package này không có dependency lúc chạy và không bao giờ import `node:*` hay code server, nên frontend import trực tiếp được. Schema có thể đến từ bất kỳ thư viện nào hiện thực [Standard Schema](https://standardschema.dev), ví dụ zod 3.25 trở lên, valibot hoặc arktype.

## Endpoint <Status available />

Một endpoint bắt đầu bằng HTTP method và path, rồi bạn thêm các phần khác bằng lời gọi builder:

| Lời gọi | Đặt phần nào |
|---|---|
| `endpoint.get(path)`, `.post`, `.put`, `.patch`, `.delete` | Method và path. Không có `head` hay `options`. |
| `.query(schema)` | Schema của query string |
| `.body(schema)` | Schema của request body |
| `.headers(schema)` | Schema của request header |
| `.response(schema, status?)` | Schema của response và status thành công (mặc định `200`) |
| `.errors(...defs)` | Các lỗi endpoint này có thể trả về |

Builder là bất biến: mỗi lời gọi trả về một endpoint mới và giữ nguyên endpoint cũ. Bạn gọi các phần theo thứ tự nào cũng được. Gọi lại cùng một phần thì giá trị mới thay giá trị cũ, trừ `.errors()` là nối thêm.

Status thành công khác `200` giữ nguyên literal type, nên `.response(UserDto, 201)` có type `201`. Middleware và auth không nằm trong endpoint mà thuộc về route.

```ts
import * as z from 'zod'
import { endpoint, errors } from '@laratype/contract'

const UserDto = z.object({ id: z.number(), name: z.string() })

// One endpoint: method + Hono-style path, then optional slots in any order.
export const showPost = endpoint
  .get('/users/:user/posts/:post?')
  .query(z.object({ page: z.coerce.number().default(1) }))
  .response(UserDto)
  .errors(errors.notFound, errors.forbidden)
// params: { user: string; post?: string }
// query: { page?: number } in, { page: number } out
// response: { id: number; name: string }, status: 200
// error statuses: 404 | 403

// A non-default success status is a literal type.
export const storeUser = endpoint
  .post('/users')
  .body(z.object({ name: z.string().min(1) }))
  .response(UserDto, 201)
  .errors(errors.validation)
// status: 201

// The runtime def is plain data for the router, the client and OpenAPI.
export const def = storeUser.def // { method: 'post', path: '/users', status: 201, body, response, errors: [...] }
```

Thuộc tính `def` chứa mô tả lúc chạy (method, path, schema, status và lỗi) dưới dạng dữ liệu thuần đã bị freeze. Ghi vào nó sẽ ném `TypeError` ở strict mode.

## Path param <Status available />

Path dùng cú pháp route của Hono, và param được suy type từ chuỗi path:

- `:name` là param bắt buộc;
- `:name?` là param tuỳ chọn;
- `:name{[0-9]+}` thêm pattern, tên param vẫn là `name`;
- wildcard (`*`), đoạn tĩnh và dấu `/` cuối không thêm param nào.

Vì vậy `/users/:user/posts/:post?` cho ra `{ user: string; post?: string }`. Giá trị param luôn là chuỗi. Việc đổi sang số hay model diễn ra sau đó, trong schema hoặc qua route model binding.

## Lỗi <Status available />

`.errors()` liệt kê các response lỗi mà endpoint có thể trả về. Mỗi lỗi gồm status và code, kèm type của body chỉ tồn tại lúc compile. Các lỗi có sẵn:

| Lỗi | Status | Code | Body |
|---|---|---|---|
| `errors.unauthorized` | 401 | `UNAUTHORIZED` | `{ message }` |
| `errors.forbidden` | 403 | `FORBIDDEN` | `{ message }` |
| `errors.notFound` | 404 | `NOT_FOUND` | `{ message }` |
| `errors.conflict` | 409 | `CONFLICT` | `{ message }` |
| `errors.validation` | 422 | `VALIDATION_ERROR` | `{ message, errors }` |
| `errors.tooManyRequests` | 429 | `TOO_MANY_REQUESTS` | `{ message }` |

Với các lỗi khác, tự định nghĩa bằng `defineError(status, code)`. Type của body mặc định là `{ message: string }`:

```ts
const paymentRequired = defineError<402, { message: string; checkoutUrl: string }>(402, 'PAYMENT_REQUIRED')
```

Body của lỗi 422 có dạng `{ message, errors: { "address.zip": ["Required"] } }`, với key là đường dẫn dạng chấm của từng field. Server và client dùng chung dạng này.

## Type của schema <Status available />

`InferIn<S>` và `InferOut<S>` đọc input type và output type của schema. Các phần của request (query, body và header) dùng **input** type của schema, vì đó là thứ client gửi lên. Response dùng **output** type, vì đó là thứ server serialize.

Ví dụ với `z.coerce.number<number>().default(1)`, client được gửi `{ page?: number }` còn handler nhận `{ page: number }`.

## Validate một giá trị <Status issue="91" pr="205" />

`validate(schema, value)` chạy bất kỳ Standard Schema nào và trả về kết quả mà bạn thu hẹp type theo `ok`:

- khi hợp lệ: `{ ok: true, value }`, có type theo output của schema;
- khi không hợp lệ: `{ ok: false, errors, issues }`, trong đó `errors` là danh sách lỗi dạng 422.

Input sai không bao giờ làm `validate()` reject; nó resolve thành `{ ok: false }`. Đường dẫn được nối bằng dấu chấm (`["items", 0, "name"]` thành `"items.0.name"`), và lỗi không có đường dẫn nằm dưới key `""`. Object lỗi có prototype null, nên hãy kiểm tra key bằng `Object.hasOwn(bag, key)` hoặc `key in bag`.

`validateSync()` làm điều tương tự cho schema đồng bộ. Nếu nhận schema async, nó ném `TypeError: validateSync: the zod schema is async, use validate() instead`.

Router sẽ tự gọi `validate()` cho query, body và header ([#106](https://github.com/Laratypes/Laratype/issues/106)). Bạn chỉ tự gọi khi cần validate bên ngoài một request.

::: info Ví dụ minh hoạ
API này đang được review trong PR [#205](https://github.com/Laratypes/Laratype/pull/205).
:::

```ts
import * as z from 'zod'
import { validate, validateSync } from '@laratype/contract'
import type { ValidationErrorBody } from '@laratype/contract'

const StoreBody = z.object({ name: z.string().min(1), address: z.object({ zip: z.string() }) })

export async function check(input: unknown): Promise<ValidationErrorBody | { name: string }> {
  // Works with any Standard Schema (zod 3.25+, valibot, arktype). The value type comes from the schema output.
  const result = await validate(StoreBody, input)
  if (result.ok) {
    return result.value // { name: string; address: { zip: string } }
  }
  // errors: dot path -> messages, e.g. { "address.zip": ["Required"] }: the 422 body shape.
  return { message: 'The given data was invalid.', errors: result.errors }
}

// Sync variant: throws a TypeError when the schema is async.
const Page = z.object({ page: z.coerce.number().default(1) })
export const page = validateSync(Page, { page: '2' })
// page.value.page: number, once page.ok is true
```

## Khai báo contract <Status issue="93" pr="204" />

`defineContract(name, endpoints)` gom các endpoint dưới một tên:

```ts
export const users = defineContract('users', {
  index: endpoint.get('/users').response(z.array(UserDto)),
  show: endpoint.get('/users/:user').response(UserDto).errors(errors.notFound),
})
```

Mỗi endpoint có một **tên route** dạng `<contract>.<endpoint>`, ở đây là `users.index` và `users.show`. Router, client, bước sinh type và URL theo tên đều dùng các tên này.

Các quy tắc:

- Tên contract không được rỗng và không có đoạn rỗng giữa các dấu chấm. Tên có dấu chấm như `admin.users` vẫn hợp lệ.
- Key của endpoint không được chứa `.`.
- Mọi giá trị phải là endpoint.

Vi phạm quy tắc sẽ ném `TypeError` bắt đầu bằng `[@laratype/contract]`, ví dụ `defineContract("users"): endpoint key "a.b" must not contain "."`. Bản thân contract bị freeze và giữ các endpoint theo đúng thứ tự bạn viết.

## API object <Status issue="93" pr="204" />

`app/contracts/index.ts` gom mọi contract bằng `defineApi()` và export type của nó:

```ts
export const appApi = defineApi({ users, posts })
export type AppApi = typeof appApi
```

Đây là module server duy nhất mà frontend import. Đừng đưa cho frontend `typeof routes` hay bất cứ thứ gì khác từ server, vì nó sẽ kéo file server vào bước kiểm tra type của frontend.

Mỗi key phải trùng tên contract của nó, nên `appApi.users.show` và tên route `users.show` luôn khớp nhau. Key sai tên là lỗi type, và lúc chạy cũng ném `TypeError` (`defineApi: key "people" must match the contract name "users"`).

Hai hàm đọc API object:

- `apiRoutes(appApi)` liệt kê mọi cặp `[routeName, endpoint]` theo thứ tự khai báo.
- `apiEndpoint(appApi, 'users.show')` trả về endpoint ứng với một tên route. Tên không tồn tại là lỗi type.

::: info Ví dụ minh hoạ
`defineContract`, `defineApi` và các type của API đang được review trong PR [#204](https://github.com/Laratypes/Laratype/pull/204).
:::

```ts
import * as z from 'zod'
import { apiEndpoint, apiRoutes, defineApi, defineContract, endpoint, errors } from '@laratype/contract'

const UserDto = z.object({ id: z.number(), name: z.string(), email: z.string().email() })

// app/contracts/users.ts: imports only @laratype/contract and the schema library.
export const users = defineContract('users', {
  index: endpoint.get('/users').query(z.object({ page: z.coerce.number().default(1) })).response(z.array(UserDto)),
  show: endpoint.get('/users/:user').response(UserDto).errors(errors.notFound),
  store: endpoint
    .post('/users')
    .body(z.object({ name: z.string().min(1), email: z.string().email() }))
    .response(UserDto, 201)
    .errors(errors.validation),
})

// app/contracts/index.ts: the only module a FE imports. Keys must equal the contract names.
export const appApi = defineApi({ users })
export type AppApi = typeof appApi

// Route names are `<contract>.<endpoint>`.
export const names = apiRoutes(appApi).map(([name]) => name) // ['users.index', 'users.show', 'users.store']
export const show = apiEndpoint(appApi, 'users.show') // typeof users.show
```

## Type của API <Status issue="93" pr="204" />

`ApiTypes<AppApi>` biến API object thành type thuần, không còn type của schema nào bên trong. Với mỗi endpoint, nó cho `method`, `path`, `params`, `query`, `body`, `headers`, `response`, `status` và `errors`. `EndpointTypes<E>` làm điều tương tự cho một endpoint.

`@laratype/client` đọc các type này. Khi frontend nằm ở repo riêng, `sauf types:generate` in cùng dạng đó ra một file để frontend import.

`Date` trong schema response vẫn có type `Date`, dù JSON gửi về là chuỗi. Type trên đường truyền là câu hỏi còn mở ở [#110](https://github.com/Laratypes/Laratype/issues/110).

## Tạo URL <Status issue="162" />

Một hàm tạo URL đang được lên kế hoạch. Nó sẽ tạo URL từ một endpoint, hoặc từ tên route như `users.show`, với param và query có type. Client và hàm `route()` phía server sẽ dùng chung hàm này. Chữ ký hàm chưa chốt. Xem [Routing › Tên route và URL](./routing#ten-route-va-url) để biết về `route()`.

## Test type <Status issue="94" />

`@laratype/contract` kiểm tra type của chính nó bằng test mức type (assertion về type và `@ts-expect-error`), hiện chạy cùng bộ test thường. Một job CI riêng, fail khi có type bị hỏng, đang lên kế hoạch ở [#94](https://github.com/Laratypes/Laratype/issues/94). Code ứng dụng không cần thay đổi gì.
