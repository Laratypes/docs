# Exception

Khi một request thất bại, response là một trong các lỗi thuộc danh mục lỗi của contract. Handler trả về một lỗi đã khai báo bằng `fail()`. Code cũng có thể ném ra lỗi, và exception filter, bước cuối của pipeline, biến nó thành response lỗi.

Exception filter sẽ nằm trong `@laratype/http` và thay cho `Response.resolveException` của bản 0.5. Danh mục lỗi đã có sẵn; phần còn lại đang lên kế hoạch ở [#108](https://github.com/Laratypes/Laratype/issues/108).

## Danh mục lỗi <Status available />

Lỗi là các giá trị từ `@laratype/contract`. Mỗi lỗi gồm một status và một code, kèm type của body chỉ tồn tại lúc compile. Một endpoint liệt kê các lỗi nó có thể trả về bằng `.errors()`.

Bộ có sẵn gồm sáu lỗi: `unauthorized` (401), `forbidden` (403), `notFound` (404), `conflict` (409), `validation` (422) và `tooManyRequests` (429). Tất cả có body `{ message }`, trừ `validation` có body `{ message, errors }`. Lỗi riêng của ứng dụng được tạo bằng `defineError(status, code)`. Bảng đầy đủ và ví dụ nằm ở [Contract › Lỗi](./contracts#loi).

Server và client dùng chung các định nghĩa này. [Result union của client](./client#result-union) thu hẹp một response lỗi theo status của nó về đúng type body đã khai báo ở đây.

## Lỗi từ pipeline <Status issue="108" />

Một số bước của pipeline trả lỗi trước khi handler chạy. Tất cả đang lên kế hoạch:

| Bước | Status | Lên kế hoạch ở |
|---|---|---|
| `auth()` không tìm thấy user đã đăng nhập | 401 (`errors.unauthorized`) | [#120](https://github.com/Laratypes/Laratype/issues/120) |
| Policy từ chối một kiểm tra `.can()` | 403 | [#122](https://github.com/Laratypes/Laratype/issues/122) |
| Model binding không tìm thấy bản ghi | 404 | [#118](https://github.com/Laratypes/Laratype/issues/118) |
| Validation thất bại | 422 (`errors.validation`) | [#106](https://github.com/Laratypes/Laratype/issues/106) |

Body 422 được mô tả ở [Validation › Response 422](./validation#response-422). Test của [#108](https://github.com/Laratypes/Laratype/issues/108) sẽ kiểm tra body của 404, 403, 422 và 500.

## `HttpException` <Status issue="108" />

`HttpException` là một exception được tạo từ một định nghĩa lỗi. Exception filter ánh xạ nó sang response lỗi của contract, `{ status, body }`.

`fail()` và `HttpException` đều tạo ra một lỗi của contract. `fail()` là giá trị mà handler trả về, nên nó chỉ dùng được bên trong handler, và lỗi của nó phải được khai báo trên endpoint (xem [Controller › Giá trị trả về và `fail`](./controllers#gia-tri-tra-ve-va-fail)). `HttpException` được ném ra, nên nó có thể đến từ code mà handler gọi.

Cách tạo một `HttpException` chưa được đặc tả ([#108](https://github.com/Laratypes/Laratype/issues/108)).

Chế độ dev `--strict-contract`, đang lên kế hoạch, kiểm tra lúc chạy rằng lỗi được ném ra đã được khai báo trong `.errors()` của endpoint ([#157](https://github.com/Laratypes/Laratype/issues/157), xem [Controller › Chế độ strict contract](./controllers#che-đo-strict-contract)).

## Lỗi không xác định <Status issue="108" />

Mọi lỗi khác được ném ra đều thành response 500 không làm lộ chi tiết. Hình dạng body của response đó chưa được đặc tả.
