---
outline: deep
---

# Seeder

Seeders are used to insert sample data into your database, very useful during application development and testing.

> [!INFO]
> Seeders are organized in the `database/seeders` directory.

> [!INFO]
> [Mass Assignment](../database/model.md#mass-assignment) will be automatically disabled when you run seeders to ensure that all fields can be assigned values.


## Creating Seeder

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

Laratype will create a new seeder file in the `database/seeders/` directory with the name `UserSeeder.ts`.

### Writing Seeder

Each seeder inherits from the `Seeder` class and must implement the `run` method, where you define the logic to insert data into the database.

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

### Using Factories

You can also use factories to create sample data in your seeder. First, see the [Factory](./factory.md) section to learn how to create factories.

Assuming you have defined a factory for the `User` model, you can use it in the seeder as follows to create 10 random users:

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

### Calling Other Seeders

You can call another seeder from within the current seeder using the `call` method:

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

#### Running Seeder

After defining the seeder, you can run it to insert data into your database, see more in the [Running Specific Seeder](#running-specific-seeder) section.

## Command

### Running Seeder

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

### Running Specific Seeder

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
