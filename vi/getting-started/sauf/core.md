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

- `build`: build ứng dụng cho production.
  - `-p, --platform <platform>`: nền tảng đích, ví dụ node hoặc deno.

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
