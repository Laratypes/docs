---
outline: deep
---

# Seeder

Seeder chèn dữ liệu mẫu vào cơ sở dữ liệu, thường dùng khi phát triển và kiểm thử.

> [!INFO]
> Seeder nằm trong thư mục `database/seeders`.

> [!INFO]
> Khi chạy seeder, [Mass Assignment](../database/model.md#mass-assignment) tự tắt, nên mọi trường đều gán được giá trị.


## Tạo Seeder

### Generate Seeder

::: code-group

```sh [npx]
$ npx sauf make:seeder UserSeeder 
```

```sh [pnpx]
$ pnpx sauf make:seeder UserSeeder 
```

```sh [bunx]
$ bunx sauf make:seeder UserSeeder
```

:::

Lệnh này tạo file `UserSeeder.ts` trong thư mục `database/seeders/`.

### Writing Seeder

Mỗi seeder kế thừa lớp `Seeder` và phải có phương thức `run`. Code chèn dữ liệu nằm trong `run`.

::: code-group

```ts [UserSeeder.ts]
import { Seeder } from "@laratype/database";
import User from "../../src/models/User";

export default class UserSeeder extends Seeder {
  public async run(): Promise<void> {
    const users = await User.create({
      name: "John Doe",
      email: "john.doe@example.com"
    }).save();
  }
}

```
:::

### Sử dụng Factories

Seeder có thể dùng factory để sinh dữ liệu. Cách viết factory xem ở phần [Factory](./factory.md).

Với một factory cho model `User`, seeder sau tạo 10 user ngẫu nhiên:

::: code-group

```ts [UserSeeder.ts]
import { Seeder } from "@laratype/database";
import User from "../../src/models/User";
import UserFactory from "../factories/UserFactory";

export default class UserSeeder extends Seeder {
  public async run(): Promise<void> {
    const users = await UserFactory.make<User>().count(10).create()
  }
}
```
:::

### Gọi seeder khác

Một seeder gọi các seeder khác bằng phương thức `call`:

::: code-group

```ts [DatabaseSeeder.ts]
import { Seeder } from "@laratype/database";
import UserSeeder from "./UserSeeder";

export default class DatabaseSeeder extends Seeder {
  public async run() {
    await this.call([
      UserSeeder
    ])
  }
}
```
:::

#### Chạy Seeder

Cách chạy một seeder để chèn dữ liệu xem ở phần [Chạy Seeder cụ thể](#chạy-seeder-cụ-thể).

## Command

### Chạy Seeder

::: details Development {open}

::: code-group

```sh [npx]
$ npx sauf db:seed
```

```sh [pnpx]
$ pnpx sauf db:seed
```

```sh [bunx]
$ bunx sauf db:seed
```

:::

::: details Production

::: code-group

```sh [npm]
$ npm run saufx db:seed
```

```sh [pnpm]
$ pnpm saufx db:seed
```

```sh [bun]
$ bun run saufx db:seed
```

:::

### Chạy Seeder cụ thể

::: details Development {open}

::: code-group

```sh [npx]
$ npx sauf db:seed --class=UserSeeder
```

```sh [pnpx]
$ pnpx sauf db:seed --class=UserSeeder
```

```sh [bunx]
$ bunx sauf db:seed --class=UserSeeder
```

:::

::: details Production

::: code-group

```sh [npm]
$ npm run saufx db:seed --class=UserSeeder
```

```sh [pnpm]
$ pnpm saufx db:seed --class=UserSeeder
```

```sh [bun]
$ bun run saufx db:seed --class=UserSeeder
```

:::
