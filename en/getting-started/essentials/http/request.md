# Request

`Request` is an important part of handling HTTP requests in the application. It provides methods and properties to access data from the request, such as params, headers, and body.

In Laratype, Request classes are typically used to validate and filter input data from users before it is processed by the controller. This helps ensure that the received data is valid and secure.

Request classes are typically placed in the `src/http/requests` directory. You can create custom Request classes to handle specific requests, for example, `CreateUserRequest` or `UpdateProfileRequest`.

Below is an example of how to create and use a Request class in Laratype:

```typescript
import { Request } from "@laratype/http";
import { z } from "zod";

export default class CreateUserRequest extends Request {
  public rules() {
    return z.object({
      email: z.string(),
      password: z.string().min(8),
      name: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      age: z.number().min(18)
    })
  }
}
```

See more about Request API [here](../../../api/api-reference/http/request.md)
