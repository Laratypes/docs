# Model

Model đại diện cho các bảng trong cơ sở dữ liệu và chịu trách nhiệm tương tác với dữ liệu. Trong Laratype, model được tổ chức trong thư mục `src/models`.

Laratype dựa trên ORM [TypeORM](https://typeorm.io/) để cung cấp các tính năng mạnh mẽ cho việc quản lý dữ liệu, bao gồm các phương thức để tạo, đọc, cập nhật và xóa (CRUD) dữ liệu.

Dưới đây là một ví dụ về cách tạo một model trong Laratype:

```typescript
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

Thuộc tính `fillable` xác định các trường có thể được gán hàng loạt (mass assignment). Điều này giúp bảo vệ chống lại các cuộc tấn công gán hàng loạt không mong muốn.

Mặc định Laratype sẽ tự hash password khi bạn sử dụng phương thức `findOneBy`, `save` hoặc `create`, và tự bỏ trường password khi bạn sử dụng phương thức `findOne`.