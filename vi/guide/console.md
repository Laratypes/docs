# Console command

Console command là các class bạn chạy bằng `sauf`, ví dụ `sauf send:mail`. v1 dự kiến tạo chúng qua container và lấy type cho tham số từ signature ([#161](https://github.com/Laratypes/Laratype/issues/161)). Các lệnh có sẵn trong `sauf` được liệt kê ở trang [CLI sauf](./cli).

Ở bản 0.5, `@laratype/console` có class cơ sở `Command` với các thuộc tính static `signature`, `description`, `options`, `arguments` và một method `handle()`. `sauf` nạp command của app từ `app/src/console/commands/*.ts` và từ default export của `app/routes/console.ts`. Xem [tài liệu 0.5.4](/vi/v0.5/getting-started/essentials/console/commands).

## Do container tạo <Status issue="161" />

Command sẽ được tạo bằng `app.make()`, nên nhận constructor injection như mọi class khác (xem [Dependency injection](./dependency-injection)). Ở bản 0.5, command được tạo mà không có DI.

[Scheduler](./scheduling), [queue worker](./queues#job-loi-va-worker) và các lệnh `sauf` khác dựa vào command được tạo theo cách này.

## Signature có type <Status issue="161" />

Một signature như `"send:mail {user} {--queue=}"` sẽ cho type tới `this.argument('user')` và `this.option('queue')`. Bộ parse dùng template literal type, cùng kỹ thuật cho type tới [path param](./contracts#path-param) của contract.

Mảng static `options` và `arguments` của bản 0.5 có còn tồn tại bên cạnh signature có type hay không thì chưa được đặc tả.

## Command dạng closure <Status issue="161" />

`routes/console.ts` cũng sẽ chứa các command viết dưới dạng closure. Hình dạng của chúng chưa được đặc tả.

## Đăng ký <Status issue="161" />

Command sẽ được đăng ký qua [manifest lúc build](./build#manifest-luc-build) thay vì được tìm theo đường dẫn lúc chạy ([#125](https://github.com/Laratypes/Laratype/issues/125)).
