# Build Deployment

Laratype tách biệt môi trường phát triển và môi trường production để đảm bảo hiệu suất và bảo mật tối ưu. Quá trình build sẽ biên dịch mã nguồn TypeScript sang JavaScript và tối ưu hóa các tài nguyên cần thiết cho việc triển khai.

Vậy nên, khi trển khai ứng dụng Laratype, bạn cần thực hiện quá trình build trước khi đưa ứng dụng lên môi trường production.

Bạn sẽ không cần cài đặt TypeScript hay các công cụ phát triển khác trên môi trường production, giúp giảm thiểu kích thước ứng dụng và tăng cường bảo mật.

Ngoài ra, bạn có thể xóa `sauf` khỏi `dependencies` trong `package.json` để giảm thiểu kích thước ứng dụng hơn nữa.

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

Sau khi build xong, bạn có thể khởi động ứng dụng từ thư mục `dist` bằng cách sử dụng Node.js, hoặc sử dụng lệnh `saufx`.

::: code-group

```sh [npm]
$ npm run saufx build
```

```sh [pnpm]
$ pnpm saufx build
```

```sh [yarn]
$ yarn saufx build
```

```sh [bun]
$ bun saufx build
```

:::

## Sử dụng CLI

Các cli không cần thiết như (`make:...`) sẽ không được bundle, giúp giảm kích thước ứng dụng, bạn có thể sử dụng qua lệnh `saufx`.

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