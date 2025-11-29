# Build Deployment

Laratype separates the development and production environments to ensure optimal performance and security. The build process will compile TypeScript source code to JavaScript and optimize the necessary resources for deployment.

Therefore, when deploying a Laratype application, you need to perform the build process before deploying the application to the production environment.

You won't need to install TypeScript or other development tools on the production environment, helping to minimize application size and enhance security.

Additionally, you can remove `sauf` from `dependencies` in `package.json` to further reduce the application size.

## Performing Build

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

## Starting the Application

After the build is complete, you can start the application from the `dist` directory using Node.js, or use the `saufx` command.

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

## Using CLI

Unnecessary CLI commands like (`make:...`) will not be bundled, helping to reduce application size. You can use them via the `saufx` command.

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
