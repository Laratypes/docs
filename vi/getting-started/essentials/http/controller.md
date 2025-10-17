# Controller

Controller chịu trách nhiệm xử lý các yêu cầu HTTP, tương tác với Model và trả về phản hồi thích hợp. Trong Laratype, controller được tổ chức trong thư mục `src/http/controllers`.

Dưới đây là một ví dụ về cách tạo một controller trong Laratype:

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

`Controller` luôn đảm bảo tính độc lập giữa các `request context`, nghĩa là mỗi lần một `request` được gửi đến `controller`, một instance mới của `controller` sẽ được tạo ra để xử lý yêu cầu đó. Điều này giúp tránh các vấn đề liên quan đến trạng thái chia sẻ giữa các `request` khác nhau.