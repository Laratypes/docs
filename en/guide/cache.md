# Cache

`@laratype/cache` is a new package planned for v1 ([#166](https://github.com/Laratypes/Laratype/issues/166)). 0.5 has no cache package.

## Stores <Status issue="166" />

The planned stores are memory, file, redis (through `ioredis`) and array, which is meant for tests. The cache is built on the [driver manager](./services#the-driver-manager), and it is configured by a typed `app/config/cache.ts` (see [Configuration](./configuration)).

## Operations <Status issue="166" />

The cache will offer `get`, `put`, `add`, `remember`, `forget`, `flush` and `increment`. `remember` infers its type from the callback. The parameters of these operations are not specified yet.

## Locks <Status issue="166" />

`Cache.lock()` gives atomic locks. The scheduler uses them so that a task doesn't run twice at the same time (see [Scheduling › Preventing overlaps](./scheduling#preventing-overlaps)).

#166 also names unique jobs as a user of locks, but the queue issue ([#169](https://github.com/Laratypes/Laratype/issues/169)) doesn't list them. Unique jobs are not specified yet.

## The cache interceptor <Status issue="166" />

A `cache(ttl)` interceptor will cache a route's response. It is built on the planned interceptors (see [Middleware › Interceptors](./middleware#interceptors)).
