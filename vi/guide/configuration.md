# Cấu hình

Config có type và môi trường được validate đang lên kế hoạch cho v1, nằm trong `@laratype/core`.

::: info Ví dụ minh hoạ
Các lời gọi trong trang này lấy từ thiết kế ở [#152](https://github.com/Laratypes/Laratype/issues/152). Chữ ký chính xác chưa chốt.
:::

## File config <Status issue="152" />

File config nằm trong `app/config/` và được viết bằng `defineConfig(...)`, mỗi phần một file (ví dụ `app/config/database.ts`). Build manifest tự gom chúng lại, nên bạn không phải giữ danh sách nào.

Các issue đã nêu tên những file sau: `cors.ts` cho [CORS](./routing#cors), `cache.ts` cho [cache](./cache), `filesystems.ts` cho [storage](./storage) và `mail.ts` cho [mail](./mail). Service có driver lấy type cho driver mặc định và tên các driver từ các key config này (xem [Service › Driver manager](./services#driver-manager)).

## Đọc giá trị config <Status issue="152" />

`config()` đọc giá trị theo đường dẫn dạng chấm, và type được suy ra từ đường dẫn:

```ts
config('database.default')
```

Type lấy từ chính các file config. Cách đăng ký type đó chưa được đặc tả.

## Validate môi trường <Status issue="152" />

`defineEnv()` nhận schema cho các biến môi trường, và ứng dụng validate môi trường theo schema đó lúc khởi động:

```ts
defineEnv(z.object({ /* mỗi biến một mục */ }))
```

Môi trường không hợp lệ sẽ dừng quá trình khởi động, thay vì để lỗi xảy ra muộn hơn khi đang xử lý request. File nào chứa `defineEnv` và lỗi được in ra thế nào vẫn chưa chốt.
