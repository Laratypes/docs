# Build Deployment

Laratype tách môi trường phát triển khỏi môi trường production. Bước build biên dịch mã TypeScript sang JavaScript và tối ưu các tài nguyên cần để triển khai, nên bạn phải build ứng dụng trước khi đưa lên production.

Nhờ vậy, máy production không cần cài TypeScript hay các công cụ phát triển khác. Ứng dụng vì thế nhỏ hơn và an toàn hơn.

Bạn cũng có thể xóa `sauf` khỏi `dependencies` trong `package.json` để ứng dụng nhỏ hơn nữa.

## Thực hiện Build

Chạy script `build` của dự án. Script này biên dịch TypeScript bằng `tsc`, rồi chạy `sauf build` để chép file `cli.js` và `index.js` vào `dist/` và sửa lại alias đường dẫn theo tsconfig. Chạy riêng `sauf build` thì không biên dịch TypeScript.

```json [package.json]
"scripts": {
  "build": "tsc -b ./tsconfig.build.json && sauf build"
}
```

::: code-group

```sh [npm]
$ npm run build
```

```sh [pnpm]
$ pnpm build
```

```sh [yarn]
$ yarn build
```

```sh [bun]
$ bun run build
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