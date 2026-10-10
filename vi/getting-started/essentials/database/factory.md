---
outline: deep
---

# Factory

Factory là lớp tạo dữ liệu mẫu cho model. Khi phát triển và kiểm thử, bạn dùng factory để sinh bản ghi giả thay vì viết đi viết lại cùng một đoạn code.

> [!INFO]
> Factory nằm trong thư mục `database/factories`.

> [!TIP]
> Dùng [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker) nếu bạn cần dữ liệu ngẫu nhiên trong factory.

## Tạo Factory

### Generate Factory

::: code-group

```sh [npx]
$ npx sauf make:factory UserFactory 
```

```sh [pnpx]
$ pnpx sauf make:factory UserFactory 
```

```sh [bunx]
$ bunx sauf make:factory UserFactory
```

:::

### Writing Factory

::: code-group

```ts [UserFactory.ts]
import { Factory, UseModel } from "@laratype/database"
import { faker } from "@faker-js/faker"
import { Hash } from "@laratype/support"
import User from "../../src/models/User"

@UseModel(User)
export default class UserFactory extends Factory<User> {
  definition () {
    return this.createDefinition({
      email: faker.internet.email(),
      password: Hash.make("password"),
      age: faker.number.int({ min: 18, max: 80 }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      isActive: true,
    })
  }
}
```
:::

Factory trên dành cho model `User` và dùng `faker` để sinh giá trị ngẫu nhiên cho các trường.

> [!WARNING]
> Factory cần decorator `UseModel` để biết nó thuộc model nào.

## Sử dụng Factory

Gọi factory để tạo bản ghi mẫu trong cơ sở dữ liệu:

::: code-group

```ts [Usage Example]
const users = await UserFactory.make<User>().state((attributes) => {
  return {
    isActive: false,
  }
}).count(5).create()

```
:::

## Factory Relationships

Khi model có quan hệ với model khác, factory có thể tạo luôn các bản ghi liên quan cùng lúc với bản ghi chính.

### Has Many Relationships

Ví dụ model `User` có quan hệ "has many" với model `Post`:

::: code-group

```ts [PostFactory.ts]
import { Factory, UseModel } from "@laratype/database"
import { faker } from "@faker-js/faker"
import Post from "../../src/models/Post"

@UseModel(Post)
export default class PostFactory extends Factory<Post> {
  definition () {
    return this.createDefinition({
      content: faker.lorem.paragraphs(3),
    })
  }
}
```

```ts [Usage Example]
const users = await UserFactory.make<User>()
  .count(10)
  .has<Post>(
    PostFactory.make<Post>().count(3),
    'posts'
  )
  .create()
```

:::

Đoạn code này tạo 10 user, và mỗi user có thêm 3 bài post.

::: warning
Quan hệ phải được khai báo trong model thì factory mới dùng được. Trong model `User`, quan hệ cần có `cascade: true`:
```
@OneToMany(() => Post, post => post.user, { cascade: true })
posts: Relation<Post>[]
```
:::