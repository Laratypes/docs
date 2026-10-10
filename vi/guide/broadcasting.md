# Broadcasting

Broadcasting gửi event từ server tới trình duyệt theo thời gian thực. Phía server được lên kế hoạch trong `@laratype/broadcast` ([#177](https://github.com/Laratypes/Laratype/issues/177)), còn channel có type trong contract đến sau ở [#178](https://github.com/Laratypes/Laratype/issues/178). Cả hai nằm ở milestone cuối (M4). Ở bản 0.5, package `broadcast` chỉ chứa một file `package.json`.

## Event broadcast <Status issue="177" />

Event được đánh dấu `ShouldBroadcast` sẽ được broadcast (xem [Event](./events)). Nó có method `broadcastOn()` và một payload có type, và được gửi qua [queue](./queues).

## Channel <Status issue="177" />

Channel có ba loại: public, private và presence. Channel được khai báo trong `routes/channels.ts`, và param được suy ra từ tên channel (`orders.:id`), giống [path param](./contracts#path-param) của contract.

Việc phân quyền channel đi qua một endpoint `/broadcasting/auth` dùng `auth()` (xem [Xác thực › Middleware `auth()`](./authentication#middleware-auth)).

Vị trí của `routes/channels.ts` trong cấu trúc project chưa được đặc tả.

## Driver <Status issue="177" />

Các driver dự kiến:

- giao thức Pusher, cho Pusher và Soketi;
- redis pub/sub;
- một WebSocket server có sẵn, trên `@hono/node-ws` hoặc Bun;
- log và null.

Broadcasting được xây trên [driver manager](./services#driver-manager).

## Channel có type <Status issue="178" />

`defineChannel()` trong `@laratype/contract` khai báo một channel và payload của từng event trên channel đó. Nhờ vậy event realtime vẫn đi theo contract, và frontend nhận payload có type. Package contract vẫn import được an toàn trong trình duyệt.

::: info Ví dụ minh hoạ
Lên kế hoạch ở [#178](https://github.com/Laratypes/Laratype/issues/178). Chưa có đoạn code nào ở đây chạy được. `OrderShipped` là schema dùng cho ví dụ này.
:::

```ts
import * as z from 'zod'
import { defineChannel } from '@laratype/contract'

const OrderShipped = z.object({ trackingNumber: z.string() })

export const orders = defineChannel('orders.:id', { events: { shipped: OrderShipped } })
```

`@laratype/client` sẽ có API có type để subscribe channel. Client dùng transport tương thích Pusher hay WebSocket gốc thì chưa được đặc tả.
