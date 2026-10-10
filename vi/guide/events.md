# Event

Event cho phép một phần của ứng dụng báo rằng có việc gì đó vừa xảy ra, và các listener phản ứng với nó. v1 dự kiến event là class, còn listener do container tạo ([#165](https://github.com/Laratypes/Laratype/issues/165)). Bản 0.5 không có package event, và #165 chưa nêu package nào sẽ chứa nó.

## Event và listener <Status issue="165" />

- Event là một class.
- Listener là một class do container tạo, nên nhận constructor injection.
- Method `handle(event: X)` của listener cho biết nó xử lý event nào.

## Đăng ký listener <Status issue="165" />

Listener được đăng ký theo một trong hai cách:

- bằng `EventServiceProvider.listen`;
- bằng cách tự tìm: DI transform ghi lại type của event từ tham số `handle(event: X)`.

Cách transform ghi lại type của event chưa được đặc tả. Hiện output của transform chỉ mang dependency của constructor (xem [Dependency injection › Constructor injection hoạt động thế nào](./dependency-injection#constructor-injection-hoat-đong-the-nao)).

## Phát event <Status issue="165" />

`Event.dispatch(new UserRegistered(user))` phát một event, có type theo class của nó. Subscriber cũng được lên kế hoạch.

::: info Ví dụ minh hoạ
Lên kế hoạch ở [#165](https://github.com/Laratypes/Laratype/issues/165). Chưa có đoạn code nào ở đây chạy được. `UserRegistered` và `SendWelcomeMail` là tên dùng cho ví dụ này. Event và listener có kế thừa một class cơ sở hay không thì chưa được đặc tả.
:::

```ts
class SendWelcomeMail {
  handle(event: UserRegistered) {
    // react to the event
  }
}

Event.dispatch(new UserRegistered(user))
```

Event còn được dùng bởi listener chạy trên queue (`ShouldQueue`, xem [Queue](./queues#listener-chay-tren-queue)), bởi [broadcasting](./broadcasting) và bởi hook vòng đời của model, phần này chờ [tầng database](./database).

## Kiểm thử <Status issue="165" />

`Event.fake()` thay dispatcher trong test. `assertDispatched` và `assertNotDispatched` kiểm tra event nào đã được phát. Tham số của chúng chưa được đặc tả.
