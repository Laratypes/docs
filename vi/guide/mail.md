# Mail

`@laratype/mail` sẽ gửi email qua các class mailable ([#170](https://github.com/Laratypes/Laratype/issues/170)). Ở bản 0.5, package này chỉ chứa một file `package.json`.

## Mailable <Status issue="170" />

Một class `Mailable` mô tả một email:

- envelope;
- nội dung: HTML viết bằng `hono/jsx` và render ra chuỗi, kèm một bản text;
- file đính kèm, sẽ lấy từ [storage](./storage) khi phần đó có.

Mailable do container tạo, nên nhận constructor injection. Cách một mailable khai báo envelope, nội dung và file đính kèm chưa được đặc tả.

## Gửi mail <Status issue="170" />

`Mail.to(user).send(mailable)` gửi một mailable. `.queue()` gửi nó qua [queue](./queues).

## Transport <Status issue="170" />

Các transport dự kiến là smtp (qua `nodemailer`), ses (qua `@aws-sdk/client-sesv2`), log và array. Mail được xây trên [driver manager](./services#driver-manager).

Mailer được bind trong container bằng token `MAILER` (xem [Dependency injection › Token](./dependency-injection#token)), và được cấu hình bằng một file `app/config/mail.ts` có type (xem [Cấu hình](./configuration)).

## Kiểm thử <Status issue="170" />

`Mail.fake()` thay mailer trong test. `assertSent` và `assertQueued` kiểm tra mailable nào đã được gửi hoặc đưa vào queue. Tham số của chúng chưa được đặc tả.
