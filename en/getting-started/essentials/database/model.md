---
outline: deep
---

# Model

Models represent tables in the database and are responsible for interacting with data.

> [!INFO]
> Models are organized in the `src/models` directory.

Laratype is based on the [TypeORM](https://typeorm.io/) ORM to provide powerful features for data management, including methods to create, read, update, and delete (CRUD) data.

## Creating Model

### Generate Model

::: code-group

```sh [npx]
$ npx sauf make:model User 
```

```sh [pnpx]
$ pnpx sauf make:model User 
```

```sh [bunx]
$ bunx sauf make:model User
```

:::

Laratype will create a new model file in the `src/models/` directory with the name `User.ts`.

> [!TIP]
> You can create multiple models at once by passing multiple names.

::: details See more

::: code-group

```sh [npx]
$ npx sauf make:model User Post 
```

```sh [pnpx]
$ pnpx sauf make:model User Post 
```

```sh [bunx]
$ bunx sauf make:model User Post
```
:::

### Writing Model

::: code-group

```ts [User.ts]
import { Column, Entity, Model, PrimaryGeneratedColumn } from "@laratype/database"

@Entity()
export class User extends Model {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  email: string

  @Column({ select: false })
  password: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column()
  age: number

  static readonly fillable = [
    'email',
    'password',
    'firstName',
    'lastName',
    'age',
  ]
}

```
:::

> [!IMPORTANT]
> Each model must inherit from Laratype's `Model` class.
> After defining the model, Laratype will not automatically sync with the database. You need to run the `sauf db:init` command to apply the changes, see more in the [Command](#command) section.

#### Mass Assignment

The `fillable` property defines fields that can be mass assigned. This helps protect against unwanted mass assignment attacks.

::: code-group

```ts [User.ts]
  static readonly fillable = [
    'name',
    'age',
  ]
```

```ts [Usage Example]
User.save({
  name: "John Doe",
  age: 30,
  isAdmin: true, // Will be ignored because it's not in fillable
});
```

:::

#### Password Hashing

By default, Laratype will automatically hash passwords when you use the `findOneBy`, `save`, or `create` methods, and automatically remove the password field when you use the `findOne` method.

#### Casting <Badge type="warning" text="coming soon" />

> [!NOTE] Casting will be added in upcoming updates.

## Command

After creating the model, you need to run the following command to sync changes with the database:

::: details Development {open}

::: code-group

```sh [npx]
$ npx sauf db:init
```

```sh [pnpx]
$ pnpx sauf db:init
```

```sh [bunx]
$ bunx sauf db:init
```

:::

::: details Production

::: code-group

```sh [npm]
$ npm run saufx db:init
```

```sh [pnpm]
$ pnpm saufx db:init
```

```sh [bun]
$ bun run saufx db:init
```

:::
