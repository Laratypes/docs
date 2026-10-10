---
outline: deep
---

# Seeder

Seeder được sử dụng để chèn dữ liệu mẫu vào cơ sở dữ liệu của bạn, rất hữu ích trong quá trình phát triển và kiểm thử ứng dụng.

> [!INFO]
> Seeder được tổ chức trong thư mục `database/seeders`.

> [!INFO]
> [Mass Assignment](../database/model.md#mass-assignment) sẽ tự động tắt khi bạn chạy seeder để đảm bảo rằng tất cả các trường đều có thể được gán giá trị.


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

Laratype sẽ tạo một file seeder mới trong thư mục `database/seeders/` với tên `UserSeeder.ts`.

### Writing Seeder

Mỗi một seeder kế thừa từ lớp `Seeder` và phải triển khai phương thức `run`, nơi bạn định nghĩa logic để chèn dữ liệu vào cơ sở dữ liệu.

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

Bạn cũng có thể sử dụng factories để tạo dữ liệu mẫu trong seeder của mình. Trước tiên, hãy xem phần [Factory](./factory.md) để biết cách tạo factories.

Giả sử bạn đã định nghĩa một factory cho model `User`, bạn có thể sử dụng nó trong seeder như sau để tạo ra 10 user ngẫu nhiên:

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

Bạn có thể gọi một seeder khác từ trong seeder hiện tại bằng cách sử dụng phương thức `call`:

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

Sau khi định nghĩa seeder, bạn có thể chạy nó để chèn dữ liệu vào cơ sở dữ liệu của mình, xem thêm trong phần [Chạy Seeder cụ thể](#chạy-seeder-cụ-thể).

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
