# Model

Models represent tables in the database and are responsible for interacting with data. In Laratype, models are organized in the `src/models` directory.

Laratype is based on the [TypeORM](https://typeorm.io/) ORM to provide powerful features for data management, including methods to create, read, update, and delete (CRUD) data.

Below is an example of how to create a model in Laratype:

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

The `fillable` property defines fields that can be mass assigned. This helps protect against unwanted mass assignment attacks.

By default, Laratype will automatically hash passwords when you use the `findOneBy`, `save`, or `create` methods, and automatically remove the password field when you use the `findOne` method.
