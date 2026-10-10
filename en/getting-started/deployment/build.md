# Build Deployment

Laratype separates the development and production environments to ensure optimal performance and security. The build process will compile TypeScript source code to JavaScript and optimize the necessary resources for deployment.

Therefore, when deploying a Laratype application, you need to perform the build process before deploying the application to the production environment.

You won't need to install TypeScript or other development tools on the production environment, helping to minimize application size and enhance security.

Additionally, you can remove `sauf` from `dependencies` in `package.json` to further reduce the application size.

## Performing Build

Run the project's `build` script. It compiles TypeScript with `tsc`, then runs `sauf build`, which copies the `cli.js` and `index.js` entry files into `dist/` and rewrites tsconfig path aliases. Running `sauf build` on its own does not compile TypeScript.

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

## Starting the Application

After the build is complete, start the application from the `dist` directory with Node.js. The `saufx` command only runs the CLI (see below); it does not start the application.

```sh
$ node dist/index.js
```

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
