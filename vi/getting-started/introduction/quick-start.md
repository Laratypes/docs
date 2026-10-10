# Bắt đầu nhanh

## Khởi tạo ứng dụng {#creating-laratype-app}

::: info Yêu cầu
- Một terminal (dòng lệnh)
- [Node.js](https://nodejs.org/) 20 trở lên
:::

Ứng dụng Laratype mới được tạo bằng công cụ dòng lệnh [create-laratype](https://www.npmjs.com/package/create-laratype). Bạn chạy nó qua `npx`, `pnpm`, `yarn` hoặc `bun`:

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

Lệnh này chạy [create-laratype](https://www.npmjs.com/package/create-laratype) và tạo ứng dụng mới trong thư mục hiện tại. Công cụ sẽ hỏi tên package và có dùng ORM hay không:

```md
√ Enter the name of your package: ... laratype-test
√ Do you want to use ORM? ... yes
Your project laratype-test has been initialized.
cd laratype-test
npm install

```

Tạo xong, bạn cài dependencies rồi chạy dev server:

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