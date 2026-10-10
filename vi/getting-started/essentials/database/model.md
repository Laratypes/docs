---
outline: deep
---

# Model

Mỗi model ứng với một bảng trong cơ sở dữ liệu, và bạn đọc, ghi dữ liệu của bảng đó qua model.

> [!INFO]
> Model nằm trong thư mục `src/models`.

Model của Laratype xây dựng trên ORM [TypeORM](https://typeorm.io/) và có sẵn các phương thức tạo, đọc, cập nhật và xóa (CRUD) dữ liệu.

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

Lệnh này tạo file `User.ts` trong thư mục `src/models/`.

> [!TIP]
> Truyền nhiều tên để tạo nhiều model cùng lúc.

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
> Mỗi model phải kế thừa lớp `Model` của Laratype.
> Laratype không tự đồng bộ model với cơ sở dữ liệu. Sau khi định nghĩa hoặc sửa model, bạn chạy `sauf db:init` để áp dụng thay đổi (xem phần [Command](#command)).

#### Mass Assignment

Thuộc tính `fillable` liệt kê các trường được phép gán hàng loạt (mass assignment). Trường nào không có trong danh sách sẽ bị bỏ qua, nên người dùng không thể gửi kèm trường ngoài ý muốn để ghi vào cơ sở dữ liệu.

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

Mặc định, Laratype tự hash password khi bạn gọi `findOneBy`, `save` hoặc `create`, và tự bỏ trường password khỏi kết quả của `findOne`.

#### Casting <Badge type="warning" text="coming soon" />

> [!NOTE] Casting sẽ có trong một bản cập nhật sau.

## Command

Sau khi tạo model, chạy lệnh sau để đồng bộ thay đổi vào cơ sở dữ liệu:

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
