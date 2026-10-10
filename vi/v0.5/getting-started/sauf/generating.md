# Generating commands

Sauf cung cấp một cách đơn giản để tạo các lệnh tùy chỉnh cho ứng dụng dòng lệnh của bạn. Bạn có thể sử dụng lệnh `sauf make:...` để tạo một lệnh mới với cấu trúc cơ bản đã được thiết lập sẵn.

> [!WARNING]
> `sauf make:...` chỉ có thể được sử dụng trong môi trường phát triển.

## Make Command

- `make:command <names>`: Tạo một lệnh mới.
  - `<names>`: Tên của lệnh bạn muốn tạo. Bạn có thể truyền vào nhiều tên để tạo nhiều lệnh cùng lúc.

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
- `make:controller <names>`: Tạo một controller mới.
  - `<names>`: Tên của controller bạn muốn tạo. Bạn có thể truyền vào nhiều tên để tạo nhiều controller cùng lúc.

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
- `make:factory <model>`: Tạo một factory mới.
  - `<model>`: Tên của model mà factory sẽ liên kết.

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
- `make:gate <names>`: Tạo một gate mới.
  - `<names>`: Tên của gate bạn muốn tạo. Bạn có thể truyền vào nhiều tên để tạo nhiều gate cùng lúc.

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
- `make:middleware <names>`: Tạo một middleware mới.
  - `<names>`: Tên của middleware bạn muốn tạo. Bạn có thể truyền vào nhiều tên để tạo nhiều middleware cùng lúc.

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
- `make:model <names>`: Tạo một model mới.
  - `<names>`: Tên của model bạn muốn tạo. Bạn có thể truyền vào nhiều tên để tạo nhiều model cùng lúc.

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
- `make:policy [option] <name>`: Tạo một policy mới.
  - `<name>`: Tên của policy bạn muốn tạo.
  - `-m, --model <model>`: Chỉ định model mà policy sẽ liên kết.

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
- `make:request <names>`: Tạo một request mới.
  - `<names>`: Tên của request bạn muốn tạo. Bạn có thể truyền vào nhiều tên để tạo nhiều request cùng lúc.

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
- `make:resource [options] <names>`: Tạo một resource mới.
  - `<names>`: Tên của resource bạn muốn tạo. Bạn có thể truyền vào nhiều tên để tạo nhiều resource cùng lúc.
  - `-c, --collection`: Tạo resource dạng collection.

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
- `make:seeder <model>`: Tạo một seeder mới.
  - `<model>`: Tên của model mà seeder sẽ liên kết.

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
