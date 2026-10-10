# Core Commands

Sauf provides a series of core commands to help you manage and operate your command-line application efficiently. Below is a list of the core commands that Sauf supports:

## Start Development Server

- `dev`: Start the application in development mode.
  - `-p, --port <port>`: Specify the port the application will listen on (default is 3000).
  - `-h, --host <host>`: Specify the host the application will listen on (default is localhost).

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

- `build`: Compile the application for production environment.
  - `-p, --platform <platform>`: Specify the build platform (e.g., node, deno).

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

- `db:init`: Initialize the database.

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

- `db:seed`: Add sample data to the database.

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

- `route:list`: Display the list of routes registered in your application.

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
