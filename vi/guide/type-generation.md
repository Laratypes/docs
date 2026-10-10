# Sinh type

Frontend nằm cùng repository import API object và lấy type trực tiếp từ contract (xem [Client](./client)). Frontend ở repository khác thì không import được file của server, nên `sauf` sinh type của nó ra một file mà frontend dùng được. Cùng dữ liệu route đó còn tạo ra tài liệu OpenAPI và cung cấp dữ liệu cho Detective, giao diện devtools.

Toàn bộ phần này đang lên kế hoạch. [Spec typegen](https://github.com/Laratypes/Laratype/blob/master/docs/v1/typegen.md) là bản khung với ghi chú thiết kế ngắn, được quyết định trong spike S2 ([#85](https://github.com/Laratypes/Laratype/issues/85)). Ở v0.5.4, package `@laratype/ts-gen` còn trống.

## sauf types:generate <Status issue="133" />

```sh
npx sauf types:generate
```

Lệnh này ghi ra một file, `api.ts`, chứa hai thứ:

- một type alias `AppApi` đã được làm phẳng, cùng hình dạng với các type mà client đọc từ [API object](./contracts#type-cua-api);
- một manifest runtime gọn nhẹ: method, path và mã lỗi đã khai báo của từng endpoint.

File không chứa thư viện contract hay thư viện schema, nên bundle frontend vẫn nhỏ. Theo số đo của S2, một frontend dựng trên file này khoảng 0.7 KiB gzip.

- Bộ sinh chỉ dùng type checker của TypeScript. Nó không bao giờ chạy các module contract của bạn.
- Type sinh ra có thể là khai báo `interface`. Client chấp nhận chúng.
- `sauf build` chạy lệnh này như một trong các [bước](./build#sinh-type) của nó.
- Frontend trong monorepo cũng có thể dùng file này thay cho API object, để schema không vào bundle.

Phần này xong khi một project frontend riêng biên dịch được chỉ với các file sinh ra. `api.ts` được ghi ở đâu, và frontend đưa nó cho client thế nào, đều chưa được đặc tả.

## Chế độ watch <Status issue="142" />

`sauf dev` sẽ theo dõi `app/contracts/**` và ghi type mới vào `.laratype/types/` khi một contract thay đổi. Nhờ vậy frontend trong monorepo thấy endpoint mới mà không phải khởi động lại dev server.

## OpenAPI <Status issue="143" />

`openapi.json` được sinh từ [route registry](./routing#route-registry). Mỗi schema của contract được chuyển sang JSON Schema.

- [Route không có contract](./routing#route-khong-co-contract) bị bỏ ra.
- Tài liệu phải pass `redocly lint`.

Phần này dành cho bên dùng API không viết bằng TypeScript, và cho Detective.

## Detective <Status issue="144" />

Detective là giao diện devtools cho một app Laratype. Nó sẽ đọc `openapi.json` và route registry, để hiển thị controller, middleware và schema của từng route.

Cùng issue này sửa route manifest, nơi controller hiện đang hiển thị là `null`.
