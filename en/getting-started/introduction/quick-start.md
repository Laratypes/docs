# Quick Start

## Creating an Application {#creating-laratype-app}

::: info Prerequisites
- Command line support
- [Node.js](https://nodejs.org/) version 20 or higher.
:::

In this section, you will learn how to create a new Laratype application. You can get started right away with the following command:

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

The command above will execute [create-laratype](https://www.npmjs.com/package/create-laratype) and create a new Laratype application in the current directory. You can name your project, choose configuration options, and start developing your application immediately.

```md
√ Enter the name of your package: ... laratype-test
√ Do you want to use ORM? ... yes
Your project laratype-test has been initialized.
cd laratype-test
npm install

```

After the project has been created, install the dependencies and start the dev server:

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