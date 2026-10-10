# Broadcasting

Broadcasting sends server events to the browser in real time. The server side is planned in `@laratype/broadcast` ([#177](https://github.com/Laratypes/Laratype/issues/177)), and typed channels in the contract follow in [#178](https://github.com/Laratypes/Laratype/issues/178). Both are in the last milestone (M4). In 0.5 the `broadcast` package contains only a `package.json`.

## Broadcast events <Status issue="177" />

An event marked with `ShouldBroadcast` is broadcast (see [Events](./events)). It has a `broadcastOn()` method and a typed payload, and it is sent through the [queue](./queues).

## Channels <Status issue="177" />

Channels are public, private or presence channels. They are declared in `routes/channels.ts`, and their params are inferred from the channel name (`orders.:id`), the same way as a contract's [path params](./contracts#path-params).

Channel authorization goes through a `/broadcasting/auth` endpoint that uses `auth()` (see [Authentication › The `auth()` middleware](./authentication#the-auth-middleware)).

Where `routes/channels.ts` sits in the project layout is not specified yet.

## Drivers <Status issue="177" />

The planned drivers are:

- the Pusher protocol, for Pusher and Soketi;
- redis pub/sub;
- a built-in WebSocket server, on `@hono/node-ws` or Bun;
- log and null.

Broadcasting is built on the [driver manager](./services#the-driver-manager).

## Typed channels <Status issue="178" />

`defineChannel()` in `@laratype/contract` declares a channel and the payload of each event on it. Realtime events then stay contract-first, and the frontend gets typed payloads. The contract package stays safe to import in the browser.

::: info Illustrative example
Planned in [#178](https://github.com/Laratypes/Laratype/issues/178). None of this code runs today. `OrderShipped` is a schema for this example.
:::

```ts
import * as z from 'zod'
import { defineChannel } from '@laratype/contract'

const OrderShipped = z.object({ trackingNumber: z.string() })

export const orders = defineChannel('orders.:id', { events: { shipped: OrderShipped } })
```

`@laratype/client` will get a typed API for subscribing to channels. Whether the client uses a Pusher-compatible transport or a native WebSocket is not specified yet.
