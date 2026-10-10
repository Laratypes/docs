# Client frontend

`@laratype/client` biến API object thành một fetch client có type. Frontend gọi endpoint theo tên, và type của request và response lấy từ contract, chính là contract mà server dùng.

Frontend chỉ import `app/contracts/index.ts` (`appApi` và `AppApi`), không bao giờ import thứ gì từ route của server (xem [Contract › API object](./contracts#api-object)). Package client chỉ phụ thuộc `@laratype/contract`, không có dependency Node và để bạn tự chọn thư viện schema. Frontend cần TypeScript 5.4 trở lên.

Thiết kế đã được chốt trong spike S2 ([#85](https://github.com/Laratypes/Laratype/issues/85)). Trên `master`, package này vẫn chỉ là khung rỗng, nên mọi thứ ở trang này đang lên kế hoạch.

::: info Ví dụ minh hoạ
Các ví dụ theo ghi chú thiết kế và các hình dạng tham chiếu của spike S2 trong [spec client](https://github.com/Laratypes/Laratype/blob/master/docs/v1/client.md). Chưa đoạn code nào ở đây chạy được, và tên gọi có thể thay đổi. Các ví dụ dùng contract `users` từ trang [Controller](./controllers).
:::

## Tạo client <Status issue="109" />

`createClient(appApi, options)` nhận chính API object, nên không cần bước build:

```ts
// frontend/api.ts
import { createClient } from '@laratype/client' // package per #109, not final
import { appApi } from '../app/contracts'

export const api = createClient(appApi, { baseUrl: '/api' })
```

Mỗi endpoint trở thành một method dưới tên route của nó:

```ts
const user = await api.users.show({ params: { user: '1' } })
const page = await api.users.index({ query: { page: 2 } })
```

- Object input có `params`, `query` và `body` tuỳ endpoint cần, cùng `headers` và `signal` không bắt buộc.
- Input không bắt buộc khi bên trong không có gì bắt buộc.
- Client điền path với param đã encode, serialize query và gửi body dạng JSON.
- Schema của contract cũng có mặt trên trình duyệt, nên form có thể validate bằng đúng schema mà server dùng.

Client và helper `route()` phía server dự kiến dùng chung một URL builder trong `@laratype/contract` ([#162](https://github.com/Laratypes/Laratype/issues/162), xem [Contract › Tạo URL](./contracts#tao-url)).

Giữ `tsconfig` của frontend tách khỏi `tsconfig` của ứng dụng. Config của ứng dụng nạp type JSX của Hono, khiến type của server lọt vào chương trình frontend. Config của frontend dùng `types: []` và thư viện DOM ([#109](https://github.com/Laratypes/Laratype/issues/109)).

Frontend nằm ở repository riêng thì không import được `appApi`. Nó dùng một file do `sauf types:generate` tạo ra ([#133](https://github.com/Laratypes/Laratype/issues/133)), sẽ được mô tả trong hướng dẫn sinh type. Runtime của client và contract dự kiến dưới 5 kB gzip, không tính thư viện schema ([#132](https://github.com/Laratypes/Laratype/issues/132)).

## Result union <Status issue="110" />

Một lần gọi trả về một kết quả mà bạn thu hẹp theo `ok`, rồi theo `status`:

- `{ ok: true, status, data }`, trong đó `data` có type của response;
- `{ ok: false, status, error }` cho mỗi lỗi endpoint khai báo, trong đó `error` có type body của lỗi đó;
- một biến thể cho lỗi mạng và các status mà contract không khai báo.

`users.store` khai báo `errors.validation`, nên một lần gọi thất bại có thể là 422 với body validation. Giả sử `CreateUser` có `name` và `email`:

```ts
const res = await api.users.store({ body: { name: 'Ada', email: 'ada@example.com' } })

if (res.ok) {
  res.data // UserDto, status 201
} else if ('unexpected' in res) {
  // a status the contract does not declare
} else if (res.status === 422) {
  res.error.errors // { [field]: string[] }
}
```

Bước kiểm tra `'unexpected' in res` phải đứng trước, vì biến thể status không khai báo có `status: number`, cũng khớp với `422`. Chừng nào chưa loại nó ra, `res.status === 422` không thu hẹp được `error` về body validation. Spike S2 đánh dấu biến thể đó bằng `unexpected: true`; hình dạng cuối cùng, cùng hình dạng của biến thể lỗi mạng, sẽ có ở [#110](https://github.com/Laratypes/Laratype/issues/110).

Type của `data` vẫn còn mở. Đó là output của schema response, nhưng JSON biến một số giá trị thành thứ khác, như `Date` thành `string` ([#110](https://github.com/Laratypes/Laratype/issues/110), [#107](https://github.com/Laratypes/Laratype/issues/107)).

## Option và hook <Status issue="124" />

Các option dự kiến của `createClient`:

- `baseUrl`;
- header, có thể là một hàm, ví dụ để thêm auth token vào mọi request;
- hook `onRequest` và `onResponse`;
- `credentials`;
- một `AbortSignal`;
- một `fetch` tuỳ chỉnh.

Tên và signature chính xác của chúng chưa chốt ([#124](https://github.com/Laratypes/Laratype/issues/124)).

## Gọi theo path <Status issue="140" />

Kiểu gọi thứ hai dùng method và path:

```ts
const user = await api.get('/users/:user', { params: { user: '1' } })
```

- Kiểu này chỉ có ở type. Nó không cần runtime của contract, và type của API lấy từ `import type` (`ApiTypes<AppApi>`) hoặc từ type được sinh ra.
- Spike S2 đo được 0,63 KiB gzip.
- Nó bổ sung cho kiểu gọi theo tên, kiểu gọi chính vẫn là theo tên.

Ở đây `api` đại diện cho một client gọi theo path. Cách tạo client đó chưa được đặc tả ([#140](https://github.com/Laratypes/Laratype/issues/140)).

## TanStack Query <Status issue="141" />

`@laratype/client-query` nối client với TanStack Query, có adapter cho Vue và React, query key được sinh ra và mutation với lỗi có type. Ứng dụng `examples/fullstack-vue` sẽ dùng nó ([#136](https://github.com/Laratypes/Laratype/issues/136)).

## Validate response khi dev <Status issue="159" />

Khi dev, client có thể validate response theo contract nếu bạn bật, để phát hiện chỗ server lệch khỏi contract. Việc này cần schema có trên trình duyệt, nên nó chỉ hoạt động với `createClient(appApi)`, không hoạt động với file được sinh ra.
