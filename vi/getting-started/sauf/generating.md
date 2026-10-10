# Generating commands

Các lệnh `sauf make:...` tạo file mới cho từng loại thành phần (command, controller, model...) với khung code dựng sẵn.

> [!WARNING]
> `sauf make:...` chỉ dùng được trong môi trường phát triển.

## Make Command

- `make:command <names>`: tạo lệnh mới.
  - `<names>`: tên lệnh. Truyền nhiều tên để tạo nhiều lệnh cùng lúc.

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
- `make:controller <names>`: tạo controller mới.
  - `<names>`: tên controller. Truyền nhiều tên để tạo nhiều controller cùng lúc.

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
- `make:factory <model>`: tạo factory mới.
  - `<model>`: tên model mà factory sinh dữ liệu cho.

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
- `make:gate <names>`: tạo gate mới.
  - `<names>`: tên gate. Truyền nhiều tên để tạo nhiều gate cùng lúc.

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
- `make:middleware <names>`: tạo middleware mới.
  - `<names>`: tên middleware. Truyền nhiều tên để tạo nhiều middleware cùng lúc.

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
- `make:model <names>`: tạo model mới.
  - `<names>`: tên model. Truyền nhiều tên để tạo nhiều model cùng lúc.

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
- `make:policy [option] <name>`: tạo policy mới.
  - `<name>`: tên policy.
  - `-m, --model <model>`: model mà policy áp dụng.

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
- `make:request <names>`: tạo request mới.
  - `<names>`: tên request. Truyền nhiều tên để tạo nhiều request cùng lúc.

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
- `make:resource [options] <names>`: tạo resource mới.
  - `<names>`: tên resource. Truyền nhiều tên để tạo nhiều resource cùng lúc.
  - `-c, --collection`: tạo resource dạng collection.

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
- `make:seeder <model>`: tạo seeder mới.
  - `<model>`: tên model mà seeder chèn dữ liệu cho.

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
