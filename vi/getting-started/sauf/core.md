# Core Commands

Các lệnh cốt lõi của Sauf dùng để chạy, build và quản lý ứng dụng.

## Start Development Server

- `dev`: chạy ứng dụng ở chế độ phát triển.
  - `-p, --port <port>`: cổng ứng dụng lắng nghe, mặc định 3000.
  - `-h, --host <host>`: host ứng dụng lắng nghe, mặc định localhost.

::: code-group

```sh [npx]
$ npx sauf dev
```

```sh [pnpx]
$ pnpx sauf dev
```

```sh [yarn]
$ yarn sauf dev
```

```sh [bunx]
$ bunx sauf dev
```

:::

## Build Application

- `build`: đóng gói bản build cho production: chép file `cli.js` và `index.js` vào `dist/` và sửa alias đường dẫn theo tsconfig. Lệnh này không biên dịch TypeScript, nên phải chạy sau `tsc -b ./tsconfig.build.json` (script `build` của dự án làm cả hai bước, xem [Build Deployment](../deployment/build.md)).
  - `-p, --platform <platform>`: nền tảng đích, mặc định `node`. Hiện chỉ hỗ trợ `node`; giá trị khác sẽ báo lỗi "not supported yet".

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

## Sync Database

- `db:init`: khởi tạo cơ sở dữ liệu.

::: code-group

```sh [npx]
$ npx sauf db:init
```

```sh [pnpx]
$ pnpx sauf db:init
```

```sh [yarn]
$ yarn sauf db:init
```

```sh [bunx]
$ bunx sauf db:init
```

:::

## Seeding Database

- `db:seed`: thêm dữ liệu mẫu vào cơ sở dữ liệu.

::: code-group

```sh [npx]
$ npx sauf db:seed
```

```sh [pnpx]
$ pnpx sauf db:seed
```

```sh [yarn]
$ yarn sauf db:seed
```

```sh [bunx]
$ bunx sauf db:seed
```

:::

## List Registered Routes

- `route:list`: liệt kê các route đã đăng ký trong ứng dụng.

::: code-group

```sh [npx]
$ npx sauf route:list
```

```sh [pnpx]
$ pnpx sauf route:list
```

```sh [yarn]
$ yarn sauf route:list
```

```sh [bunx]
$ bunx sauf route:list
```

:::
