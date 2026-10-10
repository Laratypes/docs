# Đa ngôn ngữ

`@laratype/i18n` sẽ dịch văn bản của ứng dụng ([#167](https://github.com/Laratypes/Laratype/issues/167)). Ở bản 0.5, package này chỉ chứa một file `package.json`, nhưng config app của bản 0.5 đã có `locale` và `fallback_locale`.

## File bản dịch <Status issue="167" />

Bản dịch nằm trong `lang/{locale}/*.ts`, với key có type. Manifest lúc build tự tìm các file này (xem [Build › Manifest lúc build](./build#manifest-luc-build)).

Vị trí của `lang/` trong cấu trúc project chưa được đặc tả.

## Tra bản dịch <Status issue="167" />

`__()` và `trans()` tra một bản dịch. Key và các param của placeholder được suy ra: một bản dịch như `"Hello {name}"` cho param type `{ name: string }`. Cách truyền tham số chưa được đặc tả.

Bản dịch còn thiếu sẽ dùng locale trong `config.fallback_locale`. Số nhiều dùng `Intl.PluralRules`.

## Locale hiện tại <Status issue="167" />

Một middleware locale chọn locale từ header Accept-Language, query string hoặc tuỳ chọn của người dùng. Locale được lưu theo từng request (xem [Dependency injection › Request scope](./dependency-injection#request-scope)).

## Thông báo validation <Status issue="167" />

Package cung cấp thông báo mặc định đã dịch cho các issue của Standard Schema. [FormRequest](./validation#formrequest) dùng các thông báo này.

## Xuất cho frontend <Status issue="167" />

Mỗi locale có thể được xuất ra JSON cho frontend nếu cần.
