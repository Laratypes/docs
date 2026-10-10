# OAuth2 server

Một OAuth2 server đang được lên kế hoạch, theo kiểu Laravel Passport, để ứng dụng khác lấy access token cho API của bạn. Nó gồm hai phần: grant và token guard ở [#179](https://github.com/Laratypes/Laratype/issues/179), sau đó là scope, client và consent ở [#180](https://github.com/Laratypes/Laratype/issues/180). Cả hai nằm ở milestone cuối (M4).

[Spec auth](https://github.com/Laratypes/Laratype/blob/master/docs/v1/auth.md) chỉ liệt kê các ý chính. Chi tiết dưới đây lấy từ hai issue và là thiết kế có thể còn thay đổi. Chưa có code ví dụ.

## Grant và token guard <Status issue="179" />

- **Grant:** authorization code kèm PKCE, client credentials và refresh token. Issue đề xuất đánh giá `@jmondi/oauth2-server` cho phần này.
- **Token guard:** một guard cho chế độ `verification: 'oauth2'`. Config bản 0.5 đã chấp nhận `'oauth2'`, nhưng bản 0.5 ném `UnsupportedVerificationModeException` cho chế độ này.
- **Token:** access token dạng JWT, ký bằng key do `sauf oauth:keys` tạo. Token có thể introspect và thu hồi, và guard từ chối token đã thu hồi hoặc hết hạn.
- **Lưu trữ:** migration cho các bảng `oauth_*`. Phần này phụ thuộc tầng database ([#148](https://github.com/Laratypes/Laratype/issues/148)).
- **Endpoint:** các endpoint `/oauth/*` là một contract có sẵn, nên chúng xuất hiện trong OpenAPI.

Nó dựa trên guard trong container ([#151](https://github.com/Laratypes/Laratype/issues/151), xem [Xác thực › Guard](./authentication#guard)) và config có type ([#152](https://github.com/Laratypes/Laratype/issues/152)).

## Scope, client và consent <Status issue="180" />

- **Scope có type:** scope được khai báo qua `Register` (xem [Xác thực › Interface `Register`](./authentication#interface-register)). `auth('api').scopes(...)` và `tokenCan()` kiểm tra scope, và một scope không tồn tại là lỗi type.
- **Client:** một lệnh `sauf oauth:client`, và personal access client.
- **Consent headless:** bước cấp quyền chuyển hướng tới một trang consent trong SPA của bạn, trang này đồng ý hoặc từ chối qua các endpoint JSON.
- **Dọn dẹp:** một lệnh xoá token đã hết hạn. Lệnh này có thể chạy theo lịch ([#171](https://github.com/Laratypes/Laratype/issues/171)).
