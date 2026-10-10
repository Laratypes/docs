---
outline: deep
---

# Model

Model đại diện cho các bảng trong cơ sở dữ liệu và chịu trách nhiệm tương tác với dữ liệu.

> [!INFO]
> Model được tổ chức trong thư mục `src/models`.

Laratype dựa trên ORM [TypeORM](https://typeorm.io/) để cung cấp các tính năng mạnh mẽ cho việc quản lý dữ liệu, bao gồm các phương thức để tạo, đọc, cập nhật và xóa (CRUD) dữ liệu.

## Tạo Model

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

Laratype sẽ tạo một file model mới trong thư mục `src/models/` với tên `User.ts`.

> [!TIP]
> Bạn có thể tạo nhiều model cùng lúc bằng cách truyền vào nhiều tên.

::: details Xem thêm

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
> Mỗi model phải kế thừa từ lớp `Model` của Laratype.
> Sau khi định nghĩa model, laratype sẽ không tự động đồng bộ với cơ sở dữ liệu. Bạn cần chạy lệnh `sauf db:init` để áp dụng các thay đổi, xem thêm trong phần [Command](#command).

#### Mass Assignment

Thuộc tính `fillable` xác định các trường có thể được gán hàng loạt (mass assignment). Điều này giúp bảo vệ chống lại các cuộc tấn công gán hàng loạt không mong muốn.

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
  isAdmin: true, // Sẽ bị bỏ qua vì không có trong fillable
});
```

:::

#### Password Hashing

Mặc định Laratype sẽ tự hash password khi bạn sử dụng phương thức `findOneBy`, `save` hoặc `create`, và tự bỏ trường password khi bạn sử dụng phương thức `findOne`.

#### Casting <Badge type="warning" text="coming soon" />

> [!NOTE] Casting sẽ được bổ sung trong các bản cập nhật tiếp theo.

## Command

Sau khi tạo model, bạn cần chạy lệnh sau để đồng bộ các thay đổi với cơ sở dữ liệu:

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
