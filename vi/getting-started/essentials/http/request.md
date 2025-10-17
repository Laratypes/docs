# Request

`Request` là một phần quan trọng trong việc xử lý các yêu cầu HTTP trong ứng dụng. Nó cung cấp các phương thức và thuộc tính để truy cập dữ liệu từ yêu cầu, như params, headers, và body.

Trong Laratype, các lớp Request thường được sử dụng để xác thực và lọc dữ liệu đầu vào từ người dùng trước khi nó được xử lý bởi controller. Điều này giúp đảm bảo rằng dữ liệu nhận được là hợp lệ và an toàn.

Các lớp Request thường được đặt trong thư mục `src/http/requests`. Bạn có thể tạo các lớp Request tùy chỉnh để xử lý các yêu cầu cụ thể, ví dụ như `CreateUserRequest` hoặc `UpdateProfileRequest`.

Dưới đây là một ví dụ về cách tạo và sử dụng một lớp Request trong Laratype:

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

Tham khảo thêm về Request API [tại đây](../../../api/api-reference/http/request.md)