# Nâng cấp từ 0.5

Hiện chưa có gì để nâng cấp lên: v1 chưa có trên npm. Trang này mô tả những gì sẽ thay đổi với một ứng dụng 0.5.4, theo từng mảng, kèm liên kết tới trang hướng dẫn của mảng đó. Hướng dẫn chuyển đổi từng bước được lên kế hoạch ở [#154](https://github.com/Laratypes/Laratype/issues/154).

v1 không tương thích ngược với 0.5. v1 giữ cách làm quen thuộc của Laravel (file route, request class, resource, policy, `sauf make:*`), nhưng phần lớn API phía sau thay đổi. Trước khi nâng cấp, ứng dụng sẽ cần:

- TypeScript 5.4 trở lên;
- zod 3.25 trở lên (app ví dụ của 0.5.4 dùng `^3.23.8`), hoặc một thư viện [Standard Schema](https://standardschema.dev) khác;
- `verbatimModuleSyntax: true`, với `import type` cho mọi import chỉ dùng làm type.

Mục [Giới thiệu › Yêu cầu](./introduction#yeu-cau) giải thích lý do.

## Cấu trúc project <Status issue="125" />

Ứng dụng 0.5 đặt các class trong `app/src/`. v1 bỏ cấp `src/`, nên controller, model, policy và provider nằm ngay dưới `app/`. Thư mục mới `app/contracts/` chứa các contract. Xem [Endpoint đầu tiên › Cấu trúc project](./first-endpoint#cau-truc-project).

Ở bản 0.5, runtime tìm config, route, provider và command theo đường dẫn file. Ở v1, [manifest lúc build](./build#manifest-luc-build) import chúng một cách tĩnh.

## Contract và route <Status issue="104" />

Mỗi endpoint được khai báo trước trong một [contract](./contracts): method, path, query, body, response và lỗi. Sau đó file route nối contract với controller bằng `r.contract(users, UserController)`.

| 0.5 | v1 |
|---|---|
| Cây object `RouteOptions` | [File route](./routing#file-route) với `r.contract()` |
| `Route.model` và `Route.bind` trong một service provider | [`.bind()`](./model-binding#binding-tuong-minh) trên route, và binding ngầm định |
| Ability dạng chuỗi, `can('view', 'user')` | [`.can()`](./authorization#policy-tren-route) với ability có type |

## Controller và response <Status issue="105" />

Handler là một method của class, có type từ `Ctx`, và route kiểm tra lúc biên dịch rằng handler nhận đủ thứ nó cần. Xem [Controller](./controllers).

Ở bản 0.5, status code được đoán từ tên method của controller. Ở v1, nó lấy từ contract, xem [Response › Mã trạng thái](./responses#ma-trang-thai). Lỗi cũng được khai báo trong contract, xem [Exception](./exceptions).

## Request <Status issue="137" />

Ở v0.5.4, request class (`sauf make:request`) trả về một schema zod từ `rules()`. Ở v1, rule lấy từ contract, và [FormRequest](./validation#formrequest) chỉ thêm `authorize()` và `messages()`. Validation chạy trong pipeline của request và trả về 422 kèm error bag theo từng trường, xem [Validation](./validation).

## Resource <Status issue="123" />

Ở v0.5.4, `sauf make:resource` tạo một class `JsonResource` có `toJson()` trả về `any`. Ở v1, `defineResource()` suy ra type output và kiểm tra nó theo contract. Xem [Response › Resource](./responses#resource).

## Xác thực và policy <Status issue="119" />

Ở v0.5.4, type của user được truyền ở mỗi lần gọi, như `Auth.user<User>()`. Ở v1, bạn khai báo nó một lần trong interface `Register`. Xem [Xác thực](./authentication) và [Phân quyền](./authorization).

## Dependency injection <Status issue="96" pr="196" />

0.5.4 không có DI container. v1 thêm container: service đến controller qua constructor injection, và class cụ thể không cần decorator. Interface và kiểu nguyên thuỷ cần token. Service provider đăng ký binding rồi khởi động app, theo hai giai đoạn. Xem [Dependency Injection](./dependency-injection) và [Service Provider](./service-providers).

## Script build <Status issue="128" />

App ví dụ của 0.5.4 build bằng `tsc -b ./tsconfig.build.json && sauf build`. Ở v1, script đổi thành `"build": "sauf build"` và `"start": "node dist/index.js"`, và không dùng `tsc-alias` nữa. Xem [Build và triển khai](./build) và [CLI sauf](./cli).

## Type cho frontend <Status issue="133" />

Ở v0.5.4, package `@laratype/ts-gen` còn trống. Ở v1, frontend lấy type từ contract: qua `createClient(appApi)` trong monorepo, hoặc qua file `api.ts` mà `sauf types:generate` ghi ra cho repository riêng. Xem [Client](./client) và [Sinh type](./type-generation).

## Database <Status issue="88" />

Bản 0.5 dùng TypeORM. Tầng model của v1 chờ quyết định ORM ([#88](https://github.com/Laratypes/Laratype/issues/88)). Một adapter TypeORM đã lên kế hoạch ([#150](https://github.com/Laratypes/Laratype/issues/150)) sẽ cho phép app 0.5 giữ entity của mình trong lúc chuyển sang v1. Xem [Database](./database).

## Hướng dẫn chuyển đổi <Status issue="154" />

Hướng dẫn từng bước sẽ bao gồm route, request, resource, DI, script build và hướng đi cho ORM. Nó chờ việc port app ví dụ sang v1 ([#135](https://github.com/Laratypes/Laratype/issues/135)), việc này bỏ API 0.5 khỏi app đó.
