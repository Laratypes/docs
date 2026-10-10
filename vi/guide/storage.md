# Storage

`@laratype/storage` sẽ cung cấp một API chung cho việc lưu file cục bộ và trên cloud ([#168](https://github.com/Laratypes/Laratype/issues/168)). Ở bản 0.5, package này chỉ chứa một file `package.json`.

## Disk <Status issue="168" />

Các disk dự kiến là local và s3. Disk s3 dùng `@aws-sdk/client-s3` và `@aws-sdk/s3-request-presigner`, và nhận endpoint tuỳ chỉnh, nên cũng dùng được với Cloudflare R2 và MinIO.

Storage được xây trên [driver manager](./services#driver-manager), và được cấu hình bằng một file `app/config/filesystems.ts` có type (xem [Cấu hình](./configuration)).

## Thao tác <Status issue="168" />

Mỗi disk sẽ có `put`, `get`, `stream`, `delete`, `exists`, `url`, `temporaryUrl`, `copy` và `move`. Tham số của các thao tác này chưa được đặc tả.

## File upload <Status issue="168" />

`UploadedFile.store()` sẽ lưu một file upload multipart mà request pipeline đã parse (xem [Middleware › Thứ tự pipeline](./middleware#thu-tu-pipeline)). Bản thân `UploadedFile` chưa được đặc tả trong request pipeline ([#106](https://github.com/Laratypes/Laratype/issues/106)).

## Kiểm thử và CLI <Status issue="168" />

`Storage.fake()` thay các disk trong test. #168 cũng nêu một lệnh `sauf storage:link` nhưng không mô tả nó.
