# Queue

Queue chạy các việc chậm, như gửi mail, bên ngoài request. `@laratype/queue` là một package mới được lên kế hoạch cho v1 ([#169](https://github.com/Laratypes/Laratype/issues/169)), còn chuỗi job và batch đến sau ở [#175](https://github.com/Laratypes/Laratype/issues/175). Bản 0.5 không có package queue.

## Job <Status issue="169" />

- Job là một class. Constructor của nó nhận payload.
- `handle()` nhận dependency của job qua [inject vào method](./dependency-injection#inject-vao-method).
- Job được serialize thành tên của nó, lấy từ manifest lúc build, cùng các tham số dạng JSON.
- Model trong payload được serialize theo primary key và được lấy lại khi job chạy. Cách làm việc này trước khi chọn ORM chưa được đặc tả ([#88](https://github.com/Laratypes/Laratype/issues/88)).
- Mỗi job chạy trong request scope riêng (xem [Dependency injection › Request scope](./dependency-injection#request-scope)).

## Gửi job <Status issue="169" />

`dispatch(job)` gửi một job vào queue. Lệnh gửi có thể nối tiếp với `.delay()`, `.onQueue()` và `.onConnection()`, và job hỗ trợ retry, backoff và timeout. Tham số của các method này chưa được đặc tả.

::: info Ví dụ minh hoạ
Lên kế hoạch ở [#169](https://github.com/Laratypes/Laratype/issues/169). Chưa có đoạn code nào ở đây chạy được. `SendWelcomeMail` và `Mailer` là tên dùng cho ví dụ này. Job có kế thừa một class cơ sở hay không thì chưa được đặc tả.
:::

```ts
class SendWelcomeMail {
  constructor(private readonly email: string) {} // the payload

  async handle(mailer: Mailer) {
    // mailer is resolved by method injection
  }
}

dispatch(new SendWelcomeMail(email))
```

## Driver <Status issue="169" />

Các driver dự kiến là sync và redis, chạy trên BullMQ. Driver database đến sau migration runner của [tầng database](./database) ([#148](https://github.com/Laratypes/Laratype/issues/148)). Queue được xây trên [driver manager](./services#driver-manager).

## Job lỗi và worker <Status issue="169" />

Job lỗi được đưa vào một kho lưu job lỗi. Ba lệnh `sauf` làm việc với queue:

- `sauf queue:work` chạy worker;
- `sauf queue:failed` và `sauf queue:retry` xử lý job lỗi.

Trên Heroku, stub `Procfile` chạy worker bằng `worker: sauf queue:work` (xem [Build › Heroku](./build#heroku)). Vercel không chạy được worker dài hạn (xem [Build › Vercel](./build#vercel)).

## Listener chạy trên queue <Status issue="169" />

Listener được đánh dấu `ShouldQueue` chạy trên queue thay vì chạy ngay lúc phát event (xem [Event](./events)).

## Kiểm thử <Status issue="169" />

`Queue.fake()` thay queue trong test và đi kèm các assertion. Tên của chúng chưa được đặc tả.

## Chuỗi job và batch <Status issue="175" />

- **Chuỗi** chạy các job lần lượt: `Bus.chain([...]).catch().dispatch()`.
- **Batch** chạy một nhóm job: `Bus.batch([...]).then().catch().finally().allowFailures().dispatch()`. Batch báo tiến độ và có thể bị huỷ.

Batch chạy các job song song qua BullMQ flow, và được lưu trong bảng `job_batches`, bảng này cần migration runner của [tầng database](./database) ([#148](https://github.com/Laratypes/Laratype/issues/148)). Tham số của các callback chưa được đặc tả.
