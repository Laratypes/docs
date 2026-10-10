# Laratype v1

Laratype v1 là bản thiết kế lại của framework. Mỗi endpoint được khai báo một lần dưới dạng contract, và chính object đó dùng cho validation, type của handler, client có type phía frontend và OpenAPI. Class nhận dependency qua constructor injection, decorator là tuỳ chọn. File route, FormRequest, Resource, Policy, facade và `sauf make:*` vẫn giữ như bản 0.5.

v1 chưa có trên npm. Để xây dựng ứng dụng lúc này, hãy dùng [tài liệu 0.5.4](/vi/v0.5/).

## Các phần

Trang hướng dẫn cho từng phần đang được viết ([Laratypes/Laratype#211](https://github.com/Laratypes/Laratype/issues/211)). Mỗi trang sẽ ghi rõ tính năng đã **có sẵn** trên `master` hay đang **lên kế hoạch**, kèm issue theo dõi.

| Phần | Package | Trạng thái |
|---|---|---|
| [Contract](./contracts) | `@laratype/contract` | Endpoint builder, path param và error catalog đã có trên `master`. `defineContract`, `defineApi` và validation adapter đang lên kế hoạch, code đang review. |
| [Dependency injection](./dependency-injection) và [provider](./service-providers) | `@laratype/core`, `@laratype/support` | Lên kế hoạch, code đang review |
| Routing, controller và middleware | `@laratype/http` | Lên kế hoạch |
| Validation | `@laratype/validation` | Lên kế hoạch (Standard Schema adapter đang review) |
| Response và exception | `@laratype/http` | Lên kế hoạch |
| Xác thực và phân quyền | `@laratype/auth` | Lên kế hoạch |
| Client frontend | `@laratype/client` | Lên kế hoạch |
| Build và CLI | `sauf` | Lên kế hoạch |
| Sinh type | `sauf` | Lên kế hoạch |
| Database | `@laratype/database` | Chưa chốt thiết kế ([#88](https://github.com/Laratypes/Laratype/issues/88)) |

Tiến độ của toàn bộ bản thiết kế lại được theo dõi ở [Laratypes/Laratype#83](https://github.com/Laratypes/Laratype/issues/83).
