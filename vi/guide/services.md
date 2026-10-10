# Service

v1 lên kế hoạch một bộ service cho ứng dụng theo kiểu Laravel: [console command](./console), [event](./events), [queue](./queues), [scheduler](./scheduling), [mail](./mail), [cache](./cache), [storage](./storage), [đa ngôn ngữ](./localization), [process](./processes) và [broadcasting](./broadcasting). Mỗi service có trang riêng. Trang này nói về phần chung của chúng: driver manager, facade và các class do container tạo.

Chưa có code service nào của v1. Thiết kế trên các trang này lấy từ [spec services](https://github.com/Laratypes/Laratype/blob/master/docs/v1/services.md) và các issue mà spec liên kết, và có thể còn thay đổi. Một tên trong dấu backtick là tên mà issue của nó dùng. Tham số và kiểu trả về của nó chưa được đặc tả.

Ở bản 0.5, `@laratype/console` có class cơ sở `Command`, và `@laratype/log` ghi log qua winston. Các package `mail`, `i18n`, `storage`, `schedule` và `broadcast` chỉ chứa một file `package.json`, và chưa có package nào cho event, cache, queue hay process.

## Quy tắc chung <Status issue="160" />

Mọi service đều theo các quy tắc sau:

- **Driver:** service nào có driver thì được xây trên [driver manager](#driver-manager).
- **Facade:** mỗi service có một facade với `fake()` để dùng trong test ([#115](https://github.com/Laratypes/Laratype/issues/115), xem [Dependency injection › Registry và facade](./dependency-injection#registry-va-facade)).
- **Do container tạo:** listener, job, mailable và command được tạo bằng `app.make()`, nên constructor injection hoạt động mà không cần decorator.
- **Job:** constructor của job giữ payload, còn `handle()` nhận dependency qua [inject vào method](./dependency-injection#inject-vao-method) ([#158](https://github.com/Laratypes/Laratype/issues/158)).
- **Tự tìm listener:** DI transform đọc `handle(event: X)` của listener để đăng ký nó cho event `X` ([#165](https://github.com/Laratypes/Laratype/issues/165), xem [Event](./events)).

Chi tiết của từng service lấy từ issue riêng của nó. Điều gì issue không nói thì chưa được chốt.

## Driver manager <Status issue="160" />

`Manager<Drivers>` trong `@laratype/core` là class cơ sở của mọi service có driver. Nó cung cấp:

- `driver(name?)`, trả về driver theo tên, hoặc driver mặc định;
- `extend(name, factory)`, thêm một driver;
- một instance được cache cho mỗi tên driver.

Driver mặc định và tên các driver có type lấy từ key của config (xem [Cấu hình](./configuration), [#152](https://github.com/Laratypes/Laratype/issues/152)). Cách type của config đến được manager chưa được đặc tả. Manager cũng hoạt động với `fake()` của facade.

Cache, queue, mail, storage, broadcasting và log đều theo mẫu này. Log được chuyển sang dùng nó, và các channel của log trở thành driver của manager. Ở bản 0.5, config log cho phép các channel `stack`, `single` và `daily`, nhưng chỉ `single` được cài đặt, các channel còn lại ném `DriverNotImplement`.
