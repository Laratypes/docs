# Service provider

Service provider dựng ứng dụng. Trong v1, mỗi provider nhận [container](./dependency-injection), đăng ký binding trong `register()`, rồi dùng chúng trong `boot()`.

## Viết một provider <Status issue="99" pr="202" />

```ts
export class ClockServiceProvider extends ServiceProvider {
  register() {
    this.app.singleton(CLOCK, () => ({ now: () => new Date() }))
  }

  boot() {
    this.app.make(CLOCK).now()
  }
}
```

`this.app` là container, không phải Hono app. Quá trình khởi động có hai bước:

1. **`register()`** chạy trên từng provider theo thứ tự. Chỉ thêm binding ở đây, vì các provider phía sau chưa đăng ký.
2. **`boot()`** chạy trên từng provider theo thứ tự, sau khi tất cả đã đăng ký xong. Mọi binding đều dùng được.

Cả hai method đều có thể là async. Lỗi ném ra ở một trong hai sẽ dừng quá trình khởi động.

Provider cũng có thể hiện thực `down()` để dọn dẹp. Các bước dọn dẹp chạy theo thứ tự ngược lại, nên provider khởi động sau cùng sẽ tắt đầu tiên.

## Các loại provider <Status issue="99" pr="202" />

Cả ba class đều đến từ `@laratype/support`:

| Class | Dùng cho |
|---|---|
| `ServiceProvider` | Binding cốt lõi. Nhận container qua `this.app`. |
| `AppServiceProvider` | Cấu hình ứng dụng cần đến HTTP app. `this.apps` là Hono app, resolve từ token `HTTP_APP`. |
| `RouteAppServiceProvider` | Đăng ký route. Hiện thực `routes()`. |

Code cần Hono app ở ngoài các class này thì resolve bằng `app.make(HTTP_APP)`.

## Ứng dụng khởi động thế nào <Status issue="99" pr="202" />

`bootProviders(app, providers)` tạo từng provider với container, chạy tất cả `register()`, rồi tất cả `boot()`, và trả về các hàm dọn dẹp `down()` theo thứ tự ngược. HTTP kernel và các lệnh `sauf` đều khởi động qua hàm này.

Kernel tạo một container cho mỗi process (`Serve.getContainer()`) và gắn `HTTP_APP` vào đó.

Trong lúc phần này còn đang review, có hai giới hạn:

- Container của kernel được tạo mà không có registry dependency, nên chỉ autowire được class có constructor không nhận tham số. Việc chuyển sang `new Container({ deps: depsRegistry })` nằm trong [#102](https://github.com/Laratypes/Laratype/issues/102).
- `RouteAppServiceProvider` vẫn lưu route vào một biến toàn cục. Route sẽ chuyển vào container ở [#114](https://github.com/Laratypes/Laratype/issues/114).

::: info Ví dụ minh hoạ
ServiceProvider v2 đang được review trong PR [#202](https://github.com/Laratypes/Laratype/pull/202).
:::

```ts
import { Container, token } from '@laratype/core'
import { bootProviders, ServiceProvider } from '@laratype/support'

export interface Clock { now(): Date }
export const CLOCK = token<Clock>('clock')

export class ClockServiceProvider extends ServiceProvider {
  // register(): bindings only. Every provider registers before any provider boots.
  register() {
    this.app.singleton(CLOCK, () => ({ now: () => new Date() }))
  }

  // boot(): every binding from every provider is available here.
  boot() {
    this.app.make(CLOCK).now()
  }
}

export async function main() {
  const app = new Container()
  // Instantiates each provider with the container, runs all register(), then all boot(), in order.
  const downs = await bootProviders(app, [ClockServiceProvider])
  // Cleanups come back in reverse boot order.
  for (const down of downs) await down()
}
```

## Module <Status issue="153" />

Ứng dụng lớn chia theo nghiệp vụ sẽ gom được provider và route thành module. Module là tuỳ chọn; ứng dụng chỉ gồm provider vẫn chạy bình thường.

```ts
export const BillingModule = defineModule({
  providers: [MailServiceProvider],
  routes: [billingRoutes],
  imports: [AuthModule],
})
```

- `providers` liệt kê các class service provider.
- `routes` liệt kê các nhóm route, tức giá trị tạo bởi `Route.prefix(...).group(...)`.
- `imports` liệt kê các module khác.

Cách module đến tay kernel chưa chốt: build manifest có thể tự tìm trong `app/modules/`, hoặc bạn đăng ký tường minh.

::: info Ví dụ minh hoạ
`defineModule` lấy từ thiết kế ở [#153](https://github.com/Laratypes/Laratype/issues/153). Chữ ký chưa chốt.
:::
