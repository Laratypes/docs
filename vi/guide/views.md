# View

v1 dự kiến một tầng view theo ba bước: phục vụ frontend Vite ([#174](https://github.com/Laratypes/Laratype/issues/174)), trang có type qua giao thức Inertia ([#181](https://github.com/Laratypes/Laratype/issues/181)) và render phía server ([#182](https://github.com/Laratypes/Laratype/issues/182)). Bản 0.5 không có tầng view.

Thiết kế lấy từ [spec view](https://github.com/Laratypes/Laratype/blob/master/docs/v1/view.md) và ba issue trên, và có thể còn thay đổi.

## Phục vụ SPA Vite <Status issue="174" />

- **Helper `vite()`:** khi dev, nó chèn Vite client và HMR. Ở production, nó đọc `manifest.json` để ghi các thẻ asset.
- **File tĩnh:** `public/` được phục vụ bằng `serveStatic`, và một route fallback phục vụ SPA.
- **Build:** `sauf build` build luôn entry của frontend (xem [Build và triển khai](./build)).
- **App mẫu:** backend phục vụ `examples/fullstack-vue` khi dev và ở production ([#136](https://github.com/Laratypes/Laratype/issues/136)).

Package chứa `vite()` chưa được đặc tả, vị trí của `public/` và entry frontend trong cấu trúc project cũng vậy.

## Trang Inertia <Status issue="181" />

Phía server của giao thức [Inertia](https://inertiajs.com): response `X-Inertia`, kiểm tra phiên bản asset (409), partial reload và shared props. Nhờ vậy các adapter chính thức `@inertiajs/vue3`, `@inertiajs/react` và `@inertiajs/svelte` dùng được mà không cần sửa.

`definePage(name, propsSchema)` khai báo một trang trong contract, và `page()` là response có type của nó. Props của trang có type ở phía frontend.

::: info Ví dụ minh hoạ
Lên kế hoạch ở [#181](https://github.com/Laratypes/Laratype/issues/181). Chưa có đoạn code nào ở đây chạy được. Tham số của `page()` chưa được đặc tả.
:::

```ts
import * as z from 'zod'
import { definePage } from '@laratype/contract' // package per #181, not final

export const showUser = definePage('Users/Show', z.object({ user: z.object({ id: z.number(), name: z.string() }) }))
```

Trang đến được type của frontend bằng cách nào, nằm cạnh `defineApi` và `AppApi` (xem [Contract › API object](./contracts#api-object)) hay tách riêng, chưa được đặc tả.

## SSR <Status issue="182" />

- **Entry:** một entry SSR của Vite, được nạp bằng `ssrLoadModule` khi dev và được bundle ở production.
- **Fallback:** khi SSR lỗi, trang quay về render phía client.
- **Ví dụ** cho Vue, React và Svelte.
