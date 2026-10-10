# Process

v1 dự kiến một facade `Process` để chạy chương trình bên ngoài, xây trên `node:child_process` ([#176](https://github.com/Laratypes/Laratype/issues/176)). Nó nằm ở milestone cuối (M4). #176 chưa nêu package nào sẽ chứa nó.

## Chạy process <Status issue="176" />

Facade có `Process.run`, `start`, `pool` và `pipe`. Một process có thể có timeout, biến môi trường và thư mục làm việc, và output của nó có thể được stream. Tham số của các method này chưa được đặc tả.

## Kiểm thử <Status issue="176" />

`Process.fake()` thay facade trong test và đi kèm các assertion. Tên của chúng chưa được đặc tả.

## Runtime edge <Status issue="176" />

`Process` được đánh dấu là không an toàn trên edge. Các adapter edge loại nó ra (xem [Build › Runtime edge](./build#runtime-edge)).
