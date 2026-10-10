# Build và triển khai

v1 build ứng dụng bằng một lệnh, `sauf build`, và kết quả chạy bằng `node dist/index.js` thông thường. Dev server, bản build và test dùng chung một chuỗi plugin, nên dependency injection và decorator hoạt động giống nhau ở cả ba nơi.

Trên `master`, quy trình build vẫn là của bản 0.5: `tsc -b tsconfig.build.json` biên dịch app, sau đó `sauf build` copy các file entry và chạy `tsc-alias`. Lúc chạy, runtime tìm config, route, provider và command theo đường dẫn file, nên không bundle được. Mọi thứ trên trang này đều đang lên kế hoạch, và chi tiết là ghi chú thiết kế từ [spec build](https://github.com/Laratypes/Laratype/blob/master/docs/v1/build.md) và các issue của nó. Chúng vẫn có thể thay đổi.

Khi v1 phát hành, script của app sẽ là:

```json
{
  "scripts": {
    "build": "sauf build",
    "start": "node dist/index.js"
  }
}
```

## Manifest lúc build <Status issue="125" />

Manifest là một virtual module, `virtual:laratype/app`. Nó import provider, file config, route, command, model, migration và seeder của app bằng import tĩnh, để bundler lần theo được.

Nó thay cho việc dò đường dẫn lúc chạy của bản 0.5. Bạn không phải đăng ký file route hay provider vào danh sách nào: manifest tìm chúng theo [cấu trúc project](./first-endpoint#cau-truc-project). Dev server cũng khởi động từ manifest.

## Một chuỗi plugin <Status issue="126" />

`sauf dev`, `sauf build` và [preset test](./testing) dùng cùng các plugin, theo thứ tự này:

```
laratype:manifest  →  laratype:di  →  swc  →  alias
```

| Plugin | Tác dụng |
|---|---|
| `laratype:manifest` | Dựng manifest ở trên ([#125](https://github.com/Laratypes/Laratype/issues/125)). |
| `laratype:di` | Chạy [DI transform](./dependency-injection#constructor-injection-hoat-đong-the-nao) trước SWC và giữ source map. Nó hoạt động được với cơ chế khởi động lại của dev server ([#102](https://github.com/Laratypes/Laratype/issues/102)). |
| `swc` | Biên dịch decorator. Nó giữ `decoratorMetadata: true` chừng nào ORM còn là TypeORM ([#88](https://github.com/Laratypes/Laratype/issues/88)). |
| `alias` | Resolve các path trong `tsconfig` ngay trong bundler, nên không cần `tsc-alias` nữa. |

Cả chuỗi là một hàm, `laratypePlugins()`. Mục tiêu là DI metadata giống nhau khi dev và khi build.

## Kiểm tra type <Status issue="127" />

Bundler không kiểm tra type, nên bước đầu tiên của `sauf build` chạy `tsc --noEmit`. Lỗi type làm build thất bại. `--no-typecheck` bỏ qua bước này.

## Bundle <Status issue="128" />

Bước thứ hai bundle app bằng Vite ở chế độ SSR, qua chuỗi plugin:

- Output là `dist/server.js` và `dist/cli.js`.
- Dependency vẫn để external, nên lúc chạy cần có `node_modules`. [Build standalone](#build-standalone) thay đổi điều này.
- Source map được ghi ra.

## Kiểm tra app <Status issue="129" />

Bước thứ ba khởi động app mà không listen và không kết nối database. Bước này kiểm tra:

- đồ thị DI, bằng các [kiểm tra lúc khởi động](./dependency-injection#kiem-tra-luc-khoi-đong) của container ([#113](https://github.com/Laratypes/Laratype/issues/113));
- [route registry](./routing#route-registry);
- model binding;
- policy.

Thiếu một binding thì build thất bại với thông báo rõ ràng, nên lỗi lộ ra trước khi triển khai.

## Sinh type <Status issue="133" />

Bước thứ tư chạy `sauf types:generate`, ghi ra `api.ts` cho frontend và `openapi.json`. Lỗi ở bước này làm build thất bại. Xem [Sinh type](./type-generation).

## Node và Bun <Status issue="130" />

Bước cuối ghi entry cho nền tảng chọn bằng `--platform`:

- `node`: dùng lại adapter Node của bản 0.5;
- `bun`: một adapter Bun mới.

Entry là `dist/index.js`. Ở v0.5.4, `--platform` đã có nhưng chỉ hỗ trợ `node`.

## Heroku <Status issue="172" />

Heroku chạy một process Node thông thường, nên app được build với `--platform node`. Adapter Node sẽ listen ở `0.0.0.0:$PORT` khi có `PORT`, và ở `HOST` khi có `HOST`. Một `Procfile` khởi động process web:

```
web: node dist/index.js
```

Issue này cũng dự kiến một process worker cho queue ([#169](https://github.com/Laratypes/Laratype/issues/169)) và chạy migration ở release phase của Heroku ([#148](https://github.com/Laratypes/Laratype/issues/148)). Cả hai chưa có spec.

## Vercel <Status issue="173" />

`--platform vercel` ghi ra cấu trúc Build Output API của Vercel (`.vercel/output`). App chạy như một Node function qua adapter `hono/vercel` của Hono, kèm các static asset.

- Tác vụ định kỳ chạy qua Vercel Cron, gọi một route `schedule:run` được bảo vệ bằng secret. Scheduler sẽ được đặc tả sau ([#171](https://github.com/Laratypes/Laratype/issues/171)).
- Function không chạy được queue worker dài hạn.
- Kết nối database cần pooling.

## Build standalone <Status issue="155" />

`sauf build --standalone` bundle luôn các dependency vào output, trừ native module. App khi đó chạy được mà không cần `node_modules`, giúp image Docker nhỏ gọn. Phần này thuộc milestone cuối (M4).

## Runtime edge <Status issue="156" />

Hono đã chạy được trên Cloudflare và Deno. Adapter cho các nền tảng này, cùng các provider an toàn khi chạy trên edge, được lên kế hoạch ở milestone cuối (M4). Trước đó, v1 chỉ nhắm tới Node, Bun và Vercel. Tên option cho các nền tảng này chưa được đặc tả.

## Plugin DI cho Bun <Status issue="116" />

Phần này và phần sau nói về cách build các package của chính framework. Ứng dụng không cần cấu hình gì ở hai phần này.

Các package của framework được build bằng Bun (`bun.build.js`). DI transform sẽ chạy ở đó dưới dạng plugin Bun, để các class của framework mà container resolve cũng hoạt động từ các file `dist/` đã publish.

## Target trình duyệt và ngân sách bundle <Status issue="132" />

`@laratype/contract` và `@laratype/client` chạy trong trình duyệt. Chúng được build với `target: 'browser'` và `sideEffects: false`, và CI sẽ kiểm tra:

- không có import `node:*`;
- runtime của hai package client và contract **dưới 5 kB gzip**, không tính thư viện schema bạn chọn (xem [Client › Tạo client](./client#tao-client));
- một fixture frontend pass type-check với `dist/` đã build.

Trên `master`, source của `@laratype/contract` đã được kiểm tra an toàn cho trình duyệt: một test biên dịch nó chỉ với thư viện `ES2022` và `DOM`, không có type của Node.
