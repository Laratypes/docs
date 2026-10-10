# Validation

v1 validate request theo các schema trong contract. Bạn không phải viết rule lần thứ hai: schema của query, body và header của endpoint chính là rule, và request không qua được chúng sẽ nhận 422 trước khi handler chạy.

Ba package chia nhau công việc này. Hàm `validate()` không phụ thuộc thư viện schema nằm trong `@laratype/contract`. Việc chạy nó cho từng request thuộc về pipeline trong `@laratype/http` ([#106](https://github.com/Laratypes/Laratype/issues/106)). Các class request kiểu Laravel thuộc về `@laratype/validation` ([#137](https://github.com/Laratypes/Laratype/issues/137)). Trên `master`, `@laratype/validation` vẫn là package của bản 0.5.

## Validation adapter <Status issue="91" pr="205" />

`validate(schema, value)` chạy bất kỳ [Standard Schema](https://standardschema.dev) nào và trả về `{ ok: true, value }` hoặc `{ ok: false, errors, issues }`. Input sai không bao giờ làm nó reject. Object `errors` có đúng dạng body của 422.

Chi tiết có trong [Contract › Validate một giá trị](./contracts#validate-mot-gia-tri). Tầng này không có message, bản dịch, `authorize()` hay rule cần database; những thứ đó đến từ FormRequest.

## Validation trong pipeline <Status issue="106" />

Với mỗi request, pipeline:

1. parse path param, query và body theo contract, gồm cả body JSON, form và multipart;
2. coerce giá trị của query;
3. cho từng phần chạy qua `validate()`;
4. dựng context của handler từ các giá trị đã validate.

Handler thấy type **output** của schema (`InferOut`), đã coerce và đã điền giá trị mặc định. Với `page: z.coerce.number<number>().default(1)` trong schema query, `query.page` trong handler luôn là `number`.

Validation chạy sau middleware, policy và `FormRequest.authorize()`, và trước interceptor và handler (xem [Middleware › Thứ tự pipeline](./middleware#thu-tu-pipeline)).

## Response 422 <Status issue="106" />

Khi một phần không hợp lệ, response là **422** với body của `errors.validation`:

```json
{
  "message": "...",
  "errors": {
    "email": ["..."],
    "address.zip": ["Required"]
  }
}
```

`errors` ánh xạ đường dẫn dạng dấu chấm của từng field sang các message của nó. Client frontend đọc cùng dạng này, có type theo `errors.validation` trong [danh mục lỗi](./contracts#loi). Message của từng field đến từ thư viện schema, hoặc từ `messages()` của FormRequest.

## FormRequest <Status issue="137" />

Class FormRequest bổ sung những gì schema không diễn đạt được. Nó gắn với một endpoint, và rule của nó là schema body của endpoint đó. Nó không bao giờ định nghĩa lại schema. FormRequest thêm:

- `authorize()`, quyết định người dùng có được gửi request này không;
- `messages()`, message tuỳ chỉnh có key được suy ra từ schema (dạng key chưa chốt);
- rule async cần database, ví dụ email không trùng. Chúng chạy dưới dạng async refinement, và API của chúng chưa chốt.

::: info Ví dụ minh hoạ
FormRequest đang lên kế hoạch ở [#137](https://github.com/Laratypes/Laratype/issues/137), sau pipeline ([#106](https://github.com/Laratypes/Laratype/issues/106)). Class này theo ghi chú thiết kế trong [spec validation](https://github.com/Laratypes/Laratype/blob/master/docs/v1/validation.md#formrequest-v2). Chưa đoạn code nào ở đây chạy được. Cách gắn FormRequest với endpoint của nó chưa chốt.
:::

```ts
// app/http/requests/StoreUserRequest.ts
export default class StoreUserRequest extends FormRequest<typeof users.store> {
  authorize() {
    return true // see the authorization guide for policy checks
  }

  messages() {
    return { 'email.email': 'Please enter a valid email address' }
  }
}
```

`authorize()` chạy sau guard và policy của route, và trước validation. Việc kiểm tra policy được mô tả trong [Phân quyền](./authorization). Message sẽ dịch được qua `@laratype/i18n` ([#167](https://github.com/Laratypes/Laratype/issues/167)).

Ở v0.5.4, class request (`sauf make:request`) trả về schema zod từ `rules()` và không có `authorize()` hay `messages()`. FormRequest v2 lấy rule từ contract.
