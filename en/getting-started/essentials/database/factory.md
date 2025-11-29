---
outline: deep
---

# Factory

Factories are classes used to create sample data for your models easily and quickly. They are very useful in application development and testing, helping you create mock records without having to write repetitive code.

> [!INFO]
> Factories are organized in the `database/factories` directory.

> [!TIP]
> You can use [@faker-js/faker](https://www.npmjs.com/package/@faker-js/faker) to create random data in your factories.

## Creating Factory

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

In the example above, we defined a factory for the `User` model, using the `faker` library to generate random data for the model fields.

> [!WARNING]
> Make sure you use the `UseModel` decorator to link the factory with the corresponding model.

## Using Factory

You can use the factory to create sample records in the database

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

If a model has relationships with other models, you can define these relationships in the factory to automatically create related records when creating the main record.

### Has Many Relationships

Suppose the `User` model has a "has many" relationship with the `Post` model. You can define this relationship in the factory as follows:

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

In the example above, when creating 10 users, each user will automatically have 3 related posts created.

::: warning
Make sure you have defined the relationship in the model so the factory can use it correctly.
Ensure you have added `cascade: true` in the `User` model's relationship definition:
```
@OneToMany(() => Post, post => post.user, { cascade: true })
posts: Relation<Post>[]
```
:::
