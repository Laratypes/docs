# Cache

`@laratype/cache` là một package mới được lên kế hoạch cho v1 ([#166](https://github.com/Laratypes/Laratype/issues/166)). Bản 0.5 không có package cache.

## Store <Status issue="166" />

Các store dự kiến là memory, file, redis (qua `ioredis`) và array, dùng cho test. Cache được xây trên [driver manager](./services#driver-manager), và được cấu hình bằng một file `app/config/cache.ts` có type (xem [Cấu hình](./configuration)).

## Thao tác <Status issue="166" />

Cache sẽ có `get`, `put`, `add`, `remember`, `forget`, `flush` và `increment`. `remember` suy ra type từ callback. Tham số của các thao tác này chưa được đặc tả.

## Lock <Status issue="166" />

`Cache.lock()` cung cấp lock nguyên tử. Scheduler dùng nó để một tác vụ không chạy hai lần cùng lúc (xem [Lập lịch tác vụ › Tránh chạy chồng](./scheduling#tranh-chay-chong)).

#166 cũng nêu unique job là một nơi dùng lock, nhưng issue queue ([#169](https://github.com/Laratypes/Laratype/issues/169)) không liệt kê nó. Unique job chưa được đặc tả.

## Interceptor cache <Status issue="166" />

Một interceptor `cache(ttl)` sẽ cache response của route. Nó được xây trên các interceptor đã lên kế hoạch (xem [Middleware › Interceptor](./middleware#interceptor)).
