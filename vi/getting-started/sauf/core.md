# Core Commands

Sauf cung cấp một loạt các lệnh cốt lõi để giúp bạn quản lý và vận hành ứng dụng dòng lệnh của mình một cách hiệu quả. Dưới đây là danh sách các lệnh cốt lõi mà Sauf hỗ trợ:

- `dev`: Khởi động ứng dụng ở chế độ phát triển.
  - `-p, --port <port>`: Chỉ định cổng mà ứng dụng sẽ lắng nghe (mặc định là 3000).
  - `-h, --host <host>`: Chỉ định host mà ứng dụng sẽ lắng nghe (mặc định là localhost).

::: code-group

```sh [npm]
$ npx sauf dev
```

```sh [pnpm]
$ pnpx sauf dev
```

```sh [yarn]
$ yarn sauf dev
```

```sh [bun]
$ bun sauf dev
```

:::

- `db: init`: Khởi tạo cơ sở dữ liệu.

::: code-group

```sh [npm]
$ npx sauf db:init
```

```sh [pnpm]
$ pnpx sauf db:init
```

```sh [yarn]
$ yarn sauf db:init
```

```sh [bun]
$ bun sauf db:init
```

:::

- `route:list`: Hiển thị danh sách các route đã đăng ký trong ứng dụng của bạn.

::: code-group

```sh [npm]
$ npx sauf route:list
```

```sh [pnpm]
$ pnpx sauf route:list
```

```sh [yarn]
$ yarn sauf route:list
```

```sh [bun]
$ bun sauf route:list
```

:::