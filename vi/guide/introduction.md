# Giới thiệu

Laratype v1 giữ lại những gì làm cho việc viết API bằng Laravel dễ chịu: file route, FormRequest, Resource, Policy, facade và các lệnh sinh code `sauf make:*`. Bản này thêm một DI container và một request pipeline rõ ràng, đồng thời giữ type đi suốt từ contract tới client phía frontend.

v1 không tương thích ngược với 0.5. Code viết cho 0.5.4 phải sửa mới chạy được trên v1. Hướng dẫn chuyển đổi được theo dõi ở [#154](https://github.com/Laratypes/Laratype/issues/154).

Mỗi mục trong hướng dẫn có một badge. <Status available /> nghĩa là code đã có trên nhánh `master` của Laratype và ví dụ được kiểm tra type trên đó. <Status issue="83" /> nghĩa là thiết kế đã chốt nhưng code chưa merge; badge dẫn tới issue, và tới pull request nếu đang có. Ví dụ trong các mục đang lên kế hoạch chỉ mang tính minh hoạ.

## Các phần của một ứng dụng v1

Một ứng dụng v1 xoay quanh contract:

1. **Contract** (`app/contracts/users.ts`) khai báo mỗi endpoint một lần: method, path, query, body, header, response và các lỗi có thể trả về. Schema là giá trị [Standard Schema](https://standardschema.dev) bình thường của zod, valibot hoặc arktype. Xem [Contract](./contracts).
2. **API object** (`app/contracts/index.ts`) gom các contract lại bằng `defineApi()`. Đây là module phía server duy nhất mà frontend import.
3. **File route** (`app/routes/api.ts`) gắn contract với controller bằng `r.contract(users, UserController)`. Router đăng ký mọi endpoint của contract đó.
4. **Controller** là class. Mỗi handler là một method có type lấy từ endpoint của nó, và route chứng minh ngay lúc compile rằng middleware cung cấp đủ những gì handler cần.
5. **Service** đến tay controller qua constructor injection. Container tự tạo các class cụ thể, còn interface được gắn với token có type. Xem [Dependency injection](./dependency-injection).
6. **Service provider** đăng ký binding và khởi động ứng dụng theo hai bước. Xem [Service provider](./service-providers).
7. **Frontend** gọi API qua `createClient(appApi)`, với type của request và response lấy từ chính các contract đó.

Router validate query, body và header theo contract trước khi handler chạy. Input sai trở thành response 422 kèm danh sách lỗi theo từng field. File route, controller, pipeline và client đang lên kế hoạch; trang của chúng sẽ có trong phần tiếp theo của hướng dẫn.

Để thấy các phần ghép lại với nhau, xem [Endpoint đầu tiên](./first-endpoint).

## Nguyên tắc

- **Schema là giá trị lúc chạy.** Một contract dùng cho validation, type của handler, client frontend và OpenAPI. Type được suy ra từ schema, không bao giờ từ decorator.
- **Decorator chỉ dùng cho DI và ORM.** Route, validation và response được khai báo trong contract. Decorator chỉ xuất hiện ở `@Inject(token)`, ở `@Injectable({ scope })` khi class cần scope khác mặc định, và ở entity của ORM.
- **Constructor injection không bắt buộc decorator.** Một bước build ghi lại dependency của từng constructor, nên class cụ thể được autowire. Interface và kiểu nguyên thuỷ cần token.
- **Frontend không bao giờ import code server.** Frontend chỉ import `app/contracts/index.ts`. `@laratype/contract` và `@laratype/client` chạy được trên trình duyệt.
- **Controller khai báo, route chứng minh.** Handler ghi những gì nó cần vào type, và `r.contract()` kiểm tra rằng middleware và binding của route cung cấp đủ.
- **Một pipeline build duy nhất.** `sauf dev`, `sauf build` và test dùng chung một chuỗi plugin.

## Yêu cầu

- **TypeScript 5.4 trở lên.** Type xuất bản của `@laratype/contract` dùng `NoInfer`.
- **`verbatimModuleSyntax: true`.** Dùng `import type` cho mọi thứ chỉ import làm type. Một interface bị import như giá trị sẽ làm hỏng dependency injection, và lỗi hiện ra mỗi nơi một kiểu: trong Node, trong `vite build` và trong `sauf dev`. Chỉ lỗi TypeScript TS1484 bắt được nó như nhau ở mọi nơi.
- **Một thư viện Standard Schema**, ví dụ zod 3.25 trở lên, valibot hoặc arktype. Với zod, hãy viết `import * as z from "zod"`. Cách import `import { z }` làm mất tree-shaking ở zod 4 và khiến bundle frontend lớn gấp khoảng ba lần.
- **Coerce của zod 4 trong contract** cần tham số type: `z.coerce.number<number>()`. `z.coerce.number()` có input type là `unknown`, kéo theo type query của client cũng thành `unknown`.
- **Môi trường chạy:** Node, Bun và Vercel. Các nền tảng edge khác sẽ có sau ([#156](https://github.com/Laratypes/Laratype/issues/156)).

## Cài đặt <Status issue="190" />

Các package v1 chưa có trên npm. Việc phát hành được theo dõi ở [#190](https://github.com/Laratypes/Laratype/issues/190). Để xây dựng ứng dụng lúc này, hãy dùng [Laratype 0.5.4](/vi/v0.5/getting-started/introduction/quick-start).

## Các package

| Package | Vai trò trong v1 |
|---|---|
| `@laratype/contract` | Endpoint, path param, danh mục lỗi, contract và API object. Chạy được trên trình duyệt, không có dependency lúc chạy. |
| `@laratype/core` | DI container, token và registry dependency. Không phụ thuộc vào HTTP. |
| `@laratype/support` | `ServiceProvider` và quy trình khởi động hai bước. |
| `@laratype/http` | Router, request pipeline, controller và middleware. |
| `@laratype/validation` | FormRequest dựa trên Standard Schema. |
| `@laratype/client` | `createClient(appApi)` cho frontend. Chỉ phụ thuộc vào `@laratype/contract`. |
| `@laratype/auth` | Guard, `Register` có type và policy. |
| `@laratype/database` | Tầng model. Thiết kế chờ quyết định về ORM ở [#88](https://github.com/Laratypes/Laratype/issues/88). |
| `sauf` | CLI, dev server, build và DI transform. |
| `laratype` | Kernel (`Serve`). |
