# Laratype v1

Laratype v1 là bản thiết kế lại của framework. Mỗi endpoint được khai báo một lần dưới dạng contract, và chính object đó dùng cho validation, type của handler, client có type phía frontend và OpenAPI. Class nhận dependency qua constructor injection, decorator là tuỳ chọn. v1 giữ cách viết quen thuộc của Laravel: file route, FormRequest, Resource, Policy, facade và `sauf make:*`.

v1 chưa có trên npm. Để xây dựng ứng dụng lúc này, hãy dùng [tài liệu 0.5.4](/vi/v0.5/).

## Các phần

Trang hướng dẫn cho từng phần đang được viết ([Laratypes/Laratype#211](https://github.com/Laratypes/Laratype/issues/211)). Mỗi trang sẽ ghi rõ tính năng đã **có sẵn** trên `master` hay đang **lên kế hoạch**, kèm issue theo dõi.

| Phần | Package | Trạng thái |
|---|---|---|
| [Contract](./contracts) | `@laratype/contract` | Endpoint builder, path param và error catalog đã có trên `master`. `defineContract`, `defineApi` và validation adapter đang lên kế hoạch, code đang review. |
| [Dependency injection](./dependency-injection) và [provider](./service-providers) | `@laratype/core`, `@laratype/support` | Lên kế hoạch, code đang review |
| [Routing](./routing), [controller](./controllers), [model binding](./model-binding) và [middleware](./middleware) | `@laratype/http` | Lên kế hoạch |
| [Validation](./validation) | `@laratype/validation` | Lên kế hoạch (Standard Schema adapter đang review) |
| [Response](./responses) và [exception](./exceptions) | `@laratype/http` | Lên kế hoạch |
| [Xác thực](./authentication), [phân quyền](./authorization) và [OAuth2 server](./oauth2) | `@laratype/auth` | Lên kế hoạch |
| [Client frontend](./client) | `@laratype/client` | Lên kế hoạch |
| [View](./views) | `sauf`, `@laratype/contract` | Lên kế hoạch |
| [Service](./services): [console command](./console), [event](./events), [queue](./queues), [lập lịch tác vụ](./scheduling), [mail](./mail), [cache](./cache), [storage](./storage), [đa ngôn ngữ](./localization), [process](./processes) và [broadcasting](./broadcasting) | `@laratype/core`, `console`, `log`, `cache`, `storage`, `queue`, `mail`, `i18n`, `schedule`, `broadcast` | Lên kế hoạch |
| [CLI](./cli), [build và triển khai](./build) và [kiểm thử](./testing) | `sauf`, `@laratype/testing` | Lên kế hoạch |
| [Sinh type](./type-generation) | `sauf` | Lên kế hoạch |
| [Database](./database) | `@laratype/database` | Chưa chốt thiết kế ([#88](https://github.com/Laratypes/Laratype/issues/88)) |

Tiến độ của toàn bộ bản thiết kế lại được theo dõi ở [Laratypes/Laratype#83](https://github.com/Laratypes/Laratype/issues/83).
