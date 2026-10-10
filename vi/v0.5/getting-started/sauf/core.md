# Core Commands

Sauf cung cấp một loạt các lệnh cốt lõi để giúp bạn quản lý và vận hành ứng dụng dòng lệnh của mình một cách hiệu quả. Dưới đây là danh sách các lệnh cốt lõi mà Sauf hỗ trợ:

## Start Development Server

- `dev`: Khởi động ứng dụng ở chế độ phát triển.
  - `-p, --port <port>`: Chỉ định cổng mà ứng dụng sẽ lắng nghe (mặc định là 3000).
  - `-h, --host <host>`: Chỉ định host mà ứng dụng sẽ lắng nghe (mặc định là localhost).

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

- `build`: Biên dịch ứng dụng cho môi trường production.
  - `-p, --platform <platform>`: Chỉ định nền tảng build (ví dụ: node, deno).

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

- `db:init`: Khởi tạo cơ sở dữ liệu.

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

- `db:seed`: Thêm dữ liệu mẫu vào cơ sở dữ liệu.

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

- `route:list`: Hiển thị danh sách các route đã đăng ký trong ứng dụng của bạn.

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
