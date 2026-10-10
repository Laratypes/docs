# Database

::: warning Chưa chốt thiết kế
Tầng model của v1 chờ quyết định ORM S5 ([#88](https://github.com/Laratypes/Laratype/issues/88)): một model kiểu Eloquent trên Kysely, hoặc giữ TypeORM. Trang này liệt kê những gì đã lên kế hoạch và sẽ được viết khi có quyết định.
:::

`@laratype/database` là tầng model. Ở bản 0.5 nó dựa trên TypeORM. Để xây ứng dụng ngay bây giờ, xem [tài liệu database của 0.5.4](/vi/v0.5/getting-started/essentials/database/introduction).

## Quyết định ORM <Status issue="88" />

S5 so sánh hai phương án về `where`, `with` và `select` có type, relation, migration, introspection, transaction và công sức port factory và seeder. Nó cũng định nghĩa một interface `BindableModel` tối thiểu mà cả hai phương án đều thoả: tìm theo key, cộng với metadata của primary key.

Các phần khác của v1 phụ thuộc vào nó:

- [model binding](./model-binding), cả tường minh lẫn ngầm định ([#118](https://github.com/Laratypes/Laratype/issues/118), [#163](https://github.com/Laratypes/Laratype/issues/163));
- type của model dùng trong [policy](./authorization) và [resource](./responses#resource);
- phần lưu trữ của [OAuth2 server](./oauth2), vốn cần migration;
- `decoratorMetadata` của SWC, được giữ bật chừng nào còn dùng TypeORM (xem [Build › Một chuỗi plugin](./build#mot-chuoi-plugin)).

## Việc đã lên kế hoạch <Status issue="145" />

Các issue này được lên kế hoạch cho bản v1 beta (milestone M3). Phạm vi của chúng tuỳ vào ORM mà S5 chọn.

| Issue | Dự kiến |
|---|---|
| DB1 [#145](https://github.com/Laratypes/Laratype/issues/145) | Model kiểu Eloquent: query builder, `find`, `findOrFail`, phân trang, metadata của primary key |
| DB2 [#146](https://github.com/Laratypes/Laratype/issues/146) | `fillable` và `hidden` có type: tạo model chỉ nhận các key fillable, và các key hidden bị bỏ khỏi type khi serialize |
| DB3 [#147](https://github.com/Laratypes/Laratype/issues/147) | Relation có type (`hasOne`, `hasMany`, `belongsTo`, `belongsToMany`) và eager loading có type bằng `with()` |
| DB4 [#148](https://github.com/Laratypes/Laratype/issues/148) | Bộ chạy migration, và `sauf db:introspect` sinh interface `Database` từ schema |
| DB5 [#149](https://github.com/Laratypes/Laratype/issues/149) | Factory và seeder port từ bản 0.5 |
| DB6 [#150](https://github.com/Laratypes/Laratype/issues/150) | Adapter trên entity TypeORM, để app 0.5 nâng cấp dần dần |
