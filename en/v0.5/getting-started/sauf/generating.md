# Generating Commands

Sauf provides a simple way to create custom commands for your command-line application. You can use the `sauf make:...` command to create a new command with a pre-configured basic structure.

> [!WARNING]
> `sauf make:...` can only be used in development environment.

## Make Command

- `make:command <names>`: Create a new command.
  - `<names>`: Name of the command you want to create. You can pass multiple names to create multiple commands at once.

::: details Usage
::: code-group

```sh [npx]
$ npx sauf make:command
```

```sh [pnpx]
$ pnpx sauf make:command
```

```sh [yarn]
$ yarn sauf make:command
```

```sh [bunx]
$ bunx sauf make:command
```

:::

## Make Controller
- `make:controller <names>`: Create a new controller.
  - `<names>`: Name of the controller you want to create. You can pass multiple names to create multiple controllers at once.

::: details Usage
::: code-group

```sh [npx]
$ npx sauf make:controller
```

```sh [pnpx]
$ pnpx sauf make:controller
```

```sh [yarn]
$ yarn sauf make:controller
```

```sh [bunx]
$ bunx sauf make:controller
```

:::

## Make Factory
- `make:factory <model>`: Create a new factory.
  - `<model>`: Name of the model that the factory will be linked to.

::: details Usage

::: code-group

```sh [npx]
$ npx sauf make:factory
```

```sh [pnpx]
$ pnpx sauf make:factory
```

```sh [yarn]
$ yarn sauf make:factory
```

```sh [bunx]
$ bunx sauf make:factory
```

:::

## Make Gate
- `make:gate <names>`: Create a new gate.
  - `<names>`: Name of the gate you want to create. You can pass multiple names to create multiple gates at once.

::: details Usage

::: code-group

```sh [npx]
$ npx sauf make:gate
```

```sh [pnpx]
$ pnpx sauf make:gate
```

```sh [yarn]
$ yarn sauf make:gate
```

```sh [bunx]
$ bunx sauf make:gate
```

:::

## Make Middleware
- `make:middleware <names>`: Create a new middleware.
  - `<names>`: Name of the middleware you want to create. You can pass multiple names to create multiple middlewares at once.

::: details Usage

::: code-group

```sh [npx]
$ npx sauf make:middleware
```

```sh [pnpx]
$ pnpx sauf make:middleware
```

```sh [yarn]
$ yarn sauf make:middleware
```

```sh [bunx]
$ bunx sauf make:middleware
```

:::

## Make Model
- `make:model <names>`: Create a new model.
  - `<names>`: Name of the model you want to create. You can pass multiple names to create multiple models at once.

::: details Usage

::: code-group

```sh [npx]
$ npx sauf make:model
```

```sh [pnpx]
$ pnpx sauf make:model
```

```sh [yarn]
$ yarn sauf make:model
```

```sh [bunx]
$ bunx sauf make:model
```

:::

## Make Policy
- `make:policy [option] <name>`: Create a new policy.
  - `<name>`: Name of the policy you want to create.
  - `-m, --model <model>`: Specify the model that the policy will be linked to.

::: details Usage

::: code-group

```sh [npx]
$ npx sauf make:policy
```

```sh [pnpx]
$ pnpx sauf make:policy
```

```sh [yarn]
$ yarn sauf make:policy
```

```sh [bunx]
$ bunx sauf make:policy
```

:::

## Make Request
- `make:request <names>`: Create a new request.
  - `<names>`: Name of the request you want to create. You can pass multiple names to create multiple requests at once.

::: details Usage

::: code-group

```sh [npx]
$ npx sauf make:request
```

```sh [pnpx]
$ pnpx sauf make:request
```

```sh [yarn]
$ yarn sauf make:request
```

```sh [bunx]
$ bunx sauf make:request
```

:::

## Make Resource
- `make:resource [options] <names>`: Create a new resource.
  - `<names>`: Name of the resource you want to create. You can pass multiple names to create multiple resources at once.
  - `-c, --collection`: Create a collection-type resource.

::: details Usage

::: code-group

```sh [npx]
$ npx sauf make:resource
```

```sh [pnpx]
$ pnpx sauf make:resource
```

```sh [yarn]
$ yarn sauf make:resource
```

```sh [bunx]
$ bunx sauf make:resource
```

:::

## Make Seeder
- `make:seeder <model>`: Create a new seeder.
  - `<model>`: Name of the model that the seeder will be linked to.

::: details Usage

::: code-group

```sh [npx]
$ npx sauf make:seeder
```

```sh [pnpx]
$ pnpx sauf make:seeder
```

```sh [yarn]
$ yarn sauf make:seeder
```

```sh [bunx]
$ bunx sauf make:seeder
```

:::
