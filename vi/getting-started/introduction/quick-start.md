# Bắt đầu nhanh

## Khởi tạo ứng dụng {#creating-laratype-app}

::: info Điều kiện bắt buộc
- Hỗ trợ commandline
- [Node.js](https://nodejs.org/) version 20 hoặc cao hơn.
:::

Trong phần này, bạn sẽ tìm hiểu cách khởi tạo một ứng dụng Laratype mới, có thể bắt đầu ngay với câu lệnh sau:

::: code-group

```sh [npm]
$ npx create laratype@latest
```

```sh [pnpm]
$ pnpm create laratype@latest
```

```sh [yarn]
$ yarn create laratype@latest
```

```sh [bun]
$ bun create laratype@latest
```

:::

Dòng lệnh trên sẽ thực thi [create-laratype](https://www.npmjs.com/package/create-laratype), và tạo ra một ứng dụng Laratype mới trong thư mục hiện tại. Bạn có thể đặt tên dự án, lựa chọn các tùy chọn cấu hình và bắt đầu phát triển ứng dụng của mình ngay lập tức.

```md
√ Enter the name of your package: ... laratype-test
√ Do you want to use ORM? ... yes
Your project laratype-test has been initialized.
cd laratype-test
npm install

```

Sau khi project đã được tạo, hãy cài đặt các dependencies và khởi chạy dev server

::: code-group

```sh [npm]
cd <project-name>
npm install
npm run dev
```

```sh [pnpm]
cd <project-name>
pnpm install
pnpm dev
```

```sh [yarn]
cd <project-name>
yarn install
yarn dev
```

```sh [bun]
cd <project-name>
bun install
bun dev
```

:::