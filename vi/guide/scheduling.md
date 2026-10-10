# Lập lịch tác vụ

`@laratype/schedule` sẽ chạy tác vụ theo lịch ([#171](https://github.com/Laratypes/Laratype/issues/171)). Ở bản 0.5, package này chỉ chứa một file `package.json`, nhưng config app của bản 0.5 đã có `schedule_timezone`.

## Khai báo lịch <Status issue="171" />

Lịch được khai báo bằng `schedule(s => ...)` trong `routes/console.ts`. Ba method thêm tác vụ:

- `s.command()` chạy một [console command](./console);
- `s.job()` gửi một [job](./queues);
- `s.call()` chạy một hàm.

Tần suất của tác vụ là một biểu thức cron, được parse bằng `croner`, hoặc một tần suất dạng fluent như `daily()` hay `everyFiveMinutes()`. Thời gian dùng múi giờ trong `config.schedule_timezone`.

Tham số của các method này, và cách gắn tần suất vào tác vụ, chưa được đặc tả.

## Tránh chạy chồng <Status issue="171" />

`withoutOverlapping()` và `onOneServer()` ngăn một tác vụ chạy hai lần cùng lúc. Cả hai dùng `Cache.lock` (xem [Cache › Lock](./cache#lock)).

## Chạy scheduler <Status issue="171" />

#171 nêu ba lệnh: `sauf schedule:run`, `sauf schedule:work` và `sauf schedule:list`. Option của chúng chưa được đặc tả.

Trên Vercel, Vercel Cron gọi `schedule:run` qua một route được bảo vệ bằng secret (xem [Build › Vercel](./build#vercel)).
