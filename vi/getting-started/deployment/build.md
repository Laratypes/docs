# Build Deployment

Laratype tách môi trường phát triển khỏi môi trường production. Bước build biên dịch mã TypeScript sang JavaScript và tối ưu các tài nguyên cần để triển khai, nên bạn phải build ứng dụng trước khi đưa lên production.

Nhờ vậy, máy production không cần cài TypeScript hay các công cụ phát triển khác. Ứng dụng vì thế nhỏ hơn và an toàn hơn.

Bạn cũng có thể xóa `sauf` khỏi `dependencies` trong `package.json` để ứng dụng nhỏ hơn nữa.

## Thực hiện Build

::: code-group

```sh [npx]
$ npx sauf build
```

```sh [pnpx]
$ pnpx sauf build
```

```sh [yarn]
$ yarn sauf build
```

```sh [bunx]
$ bunx sauf build
```

:::

## Khởi chạy Application

Build xong, bạn khởi động ứng dụng từ thư mục `dist` bằng Node.js. Lệnh `saufx` chỉ dùng để chạy CLI (xem phần dưới), không dùng để khởi động ứng dụng.

```sh
$ node dist/index.js
```

## Sử dụng CLI

Bản build không đóng gói các lệnh chỉ dùng khi phát triển, như `make:...`, nên ứng dụng nhỏ hơn. Các lệnh còn lại chạy qua `saufx`:

::: code-group

```sh [npm]
$ npm run saufx <command-name>
```

```sh [pnpm]
$ pnpm saufx <command-name>
```

```sh [yarn]
$ yarn saufx <command-name>
```

```sh [bun]
$ bun saufx <command-name>
```

:::