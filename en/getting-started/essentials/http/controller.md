# Controller

Controllers are responsible for handling HTTP requests, interacting with Models, and returning appropriate responses. In Laratype, controllers are organized in the `src/http/controllers` directory.

Below is an example of how to create a controller in Laratype:

```typescript
// src/http/controllers/RegisterController.ts

import { Controller } from "@laratype/http";
import CreateUserRequest from "../requests/CreateUserRequest";
import { User } from "../../models/User";

export default class RegisterController extends Controller {

  async register(request: CreateUserRequest) {

    const user = await User.save(request.validated());

    return user;
  }

  
}

```

`Controller` always ensures independence between `request contexts`, meaning that each time a `request` is sent to a `controller`, a new instance of the `controller` is created to handle that request. This helps avoid issues related to shared state between different `requests`.
