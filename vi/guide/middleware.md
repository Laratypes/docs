# Middleware và pipeline

Mọi request đi qua một pipeline cố định trước và sau handler. Middleware có thể dừng request hoặc thêm giá trị có type vào context của handler, còn interceptor bọc quanh chính handler.

Pipeline sẽ nằm trong `@laratype/http` và thay cho `RequestKernel.pipeline` của bản 0.5. Toàn bộ phần này đang lên kế hoạch: pipeline ở [#106](https://github.com/Laratypes/Laratype/issues/106), middleware có type ở [#117](https://github.com/Laratypes/Laratype/issues/117) và interceptor ở [#138](https://github.com/Laratypes/Laratype/issues/138).

::: info Ví dụ minh hoạ
Các ví dụ theo ghi chú thiết kế trong [spec HTTP](https://github.com/Laratypes/Laratype/blob/master/docs/v1/http.md). Chưa đoạn code nào ở đây chạy được, và tên gọi có thể thay đổi.
:::

## Thứ tự pipeline <Status issue="106" />

Các bước luôn chạy theo thứ tự này:

1. middleware toàn cục
2. middleware của route
3. kiểm tra guard và policy (`.can()`)
4. `FormRequest.authorize()`
5. validation, trả 422 khi không hợp lệ
6. interceptor, trước handler
7. handler
8. interceptor, sau handler
9. serialize, bằng Resource hoặc schema response
10. exception filter

Các bước 1 đến 5 có thể dừng request trước khi handler chạy. Ví dụ `auth()` trả 401, policy từ chối trả 403 và validation thất bại trả 422. Exception filter biến mọi thứ được ném ra thành response lỗi mà contract khai báo ([#108](https://github.com/Laratypes/Laratype/issues/108)). [Validation](./validation) nói về bước 4 và 5. Policy, Resource và exception có hướng dẫn riêng.

## Middleware có type <Status issue="117" />

`defineMiddleware<Ext>()` khai báo một middleware và các key nó thêm vào context. Nó chuyển các giá trị đó đi tiếp bằng `next(ext)`:

```ts
// app/http/middleware/requestId.ts
export const requestId = () =>
  defineMiddleware<{ requestId: string }>(async (ctx, next) => {
    return next({ requestId: crypto.randomUUID() })
  })
```

Route builder cộng dồn phần mở rộng của middleware toàn cục, của nhóm và của route, theo thứ tự pipeline. Handler đòi một key trong `Ctx`, và route chứng minh key đó có mặt:

```ts
async index({ query, requestId }: Ctx<typeof users.index, { requestId: string }>) {
  console.log(requestId) // a string
  return this.repo.list(query.page)
}
```

Nếu route không có middleware nào thêm `requestId`, `r.contract()` báo lỗi `` users.index: handler requires `requestId`, route does not provide it (add middleware / .bind()) ``. Xem [Controller › Kiểm chứng ở route](./controllers#kiem-chung-o-route).

`auth()` từ `@laratype/auth` được viết theo cùng cách. Nó thêm `{ user }`, có type theo guard được chọn, và trả 401 khi chưa có ai đăng nhập ([#120](https://github.com/Laratypes/Laratype/issues/120)).

`withoutMiddleware` cho một route bỏ qua một middleware mà lẽ ra nó sẽ nhận.

Middleware chỉ cho một số endpoint trong một contract, ví dụ `auth()` chỉ cho `destroy`, chưa chốt ([#105](https://github.com/Laratypes/Laratype/issues/105), [#117](https://github.com/Laratypes/Laratype/issues/117)). Spike S1 đã kiểm tra type theo từng endpoint; phần còn mở là builder cho phép viết điều đó thế nào.

## Middleware toàn cục <Status issue="117" />

Middleware toàn cục chạy đầu tiên, cho mọi route. Mặc định `cors()` được đăng ký ở đây (xem [Routing › CORS](./routing#cors)). Middleware của nhóm đến từ `Route.prefix(...).middleware(...)`, còn middleware của route đến từ `r.middleware(...)` (xem [Routing](./routing#đang-ky-contract)).

## Interceptor <Status issue="138" />

Interceptor là hook trước và sau handler, theo kiểu NestJS. Các cách dùng thường gặp là biến đổi kết quả, cache và logging.

Interceptor có thể thay đổi kết quả của handler. Response của contract vẫn là type cuối cùng mà frontend thấy. API của interceptor chưa được đặc tả.
