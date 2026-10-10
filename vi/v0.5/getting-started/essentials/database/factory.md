---
outline: deep
---

# Factory

Factories là các lớp được sử dụng để tạo dữ liệu mẫu cho các model của bạn một cách dễ dàng và nhanh chóng. Chúng rất hữu ích trong việc phát triển và kiểm thử ứng dụng, giúp bạn tạo ra các bản ghi giả lập mà không cần phải viết mã lặp đi lặp lại.

> [!INFO]
> Factory được tổ chức trong thư mục `database/factories`.

> [!TIP]
> Bạn có thể sử dụng [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker) để tạo dữ liệu ngẫu nhiên trong factories của mình.

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

Trong ví dụ trên, chúng ta đã định nghĩa một factory cho model `User`, sử dụng thư viện `faker` để tạo dữ liệu ngẫu nhiên cho các trường của model.

> [!WARNING]
> Hãy đảm bảo bạn sử dụng `UseModel` decorator để liên kết factory với model tương ứng.

## Sử dụng Factory

Bạn có thể sử dụng factory để tạo các bản ghi mẫu trong cơ sở dữ liệu

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

Nếu model có các mối quan hệ với các model khác, bạn có thể định nghĩa các mối quan hệ này trong factory để tự động tạo các bản ghi liên quan khi tạo bản ghi chính.

### Has Many Relationships

Giả sử model `User` có mối quan hệ "has many" với model `Post`. Bạn có thể định nghĩa mối quan hệ này trong factory như sau:

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

Trong ví dụ trên, khi tạo 10 user, mỗi user sẽ tự động có 3 bài post liên quan được tạo ra.

::: warning
Đảm bảo rằng bạn đã định nghĩa mối quan hệ trong model để factory có thể sử dụng đúng cách.
Hãy đảm bảo bạn đã thêm `cascade: true` trong định nghĩa mối quan hệ của model `User`:
```
@OneToMany(() => Post, post => post.user, { cascade: true })
posts: Relation<Post>[]
```
:::