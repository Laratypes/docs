# Kiểm thử

v1 dự kiến có một preset test cho [Vitest](https://vitest.dev) trong package mới `@laratype/testing`. Phần này được lên kế hoạch ở [#131](https://github.com/Laratypes/Laratype/issues/131), và [spec build](https://github.com/Laratypes/Laratype/blob/master/docs/v1/build.md#testing-preset) hiện chỉ có ghi chú thiết kế ngắn. Tên các hàm dưới đây lấy từ đó; signature của chúng chưa được đặc tả.

## Preset Vitest <Status issue="131" />

Mặc định Vitest biên dịch TypeScript bằng esbuild. esbuild không chạy DI transform và không sinh decorator metadata, nên constructor injection và entity ORM trong test sẽ chạy khác so với trong app.

`defineLaratypeConfig()` dựng config Vitest dùng cùng [chuỗi plugin](./build#mot-chuoi-plugin) với `sauf dev` và `sauf build`:

::: info Ví dụ minh hoạ
Được lên kế hoạch ở [#131](https://github.com/Laratypes/Laratype/issues/131). Chưa đoạn code nào ở đây chạy được, và option của `defineLaratypeConfig()` chưa được đặc tả.
:::

```ts
// vitest.config.ts
import { defineLaratypeConfig } from '@laratype/testing' // package per #131, not final

export default defineLaratypeConfig()
```

## App cho test <Status issue="131" />

`createTestApp()` khởi động ứng dụng từ [manifest lúc build](./build#manifest-luc-build), giống cách server khởi động. App test cung cấp:

- `app.swap()`. Spec có nêu tên nhưng chưa mô tả;
- một hàm `request()` có type để gọi các endpoint của app. Type của nó lấy từ `AppApi`, type của [API object](./contracts#api-object). Type `AppRouter` cũ không còn dùng.

Cách gọi `createTestApp()`, `app.swap()` và `request()` chưa được đặc tả. Preset được coi là xong khi các test của app ví dụ chạy qua nó.
