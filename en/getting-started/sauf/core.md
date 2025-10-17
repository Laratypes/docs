# Core Commands

Sauf provides a series of core commands to help you manage and operate your command-line application efficiently. Below is a list of the core commands that Sauf supports:

- `dev`: Start the application in development mode.
  - `-p, --port <port>`: Specify the port the application will listen on (default is 3000).
  - `-h, --host <host>`: Specify the host the application will listen on (default is localhost).

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

- `db: init`: Initialize the database.

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

- `route:list`: Display the list of routes registered in your application.

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
