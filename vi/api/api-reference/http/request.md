# Request

Request API gồm các phương thức đọc thông tin của yêu cầu HTTP gửi tới ứng dụng: `header`, `params` và `data` gửi kèm.

## API

Yêu cầu dùng cho các ví dụ bên dưới:
```sh
curl --location 'http://localhost:3000/api/register?role=admin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Nguyen",
    "lastName": "Nguyen",
    "age": 24
}'

```

1. `all()`

Trả về toàn bộ dữ liệu của yêu cầu, gồm cả `query string` và `body`.

```typescript
const requestData = request.all();
// requestData = { role: 'admin', firstName: 'Nguyen', lastName: 'Nguyen', age: 24 }
```

2. `query()`

Trả về mọi tham số trong `query string`.

```typescript
const queryParams = request.query();
// queryParams = { role: 'admin' }
```

3. `input(key: string | string[])`

Lấy giá trị của một hoặc nhiều trường trong dữ liệu yêu cầu.

```typescript
const firstName = request.input('firstName');
// firstName = 'Nguyen'

const selectedData = request.input(['firstName', 'age']);
// selectedData = { firstName: 'Nguyen', age: 24 }

```

4. `only(keys: string[])`

Chỉ trả về các trường được liệt kê.

```typescript
const requestData = request.only(['firstName', 'lastName']);
// requestData = { firstName: 'Nguyen', lastName: 'Nguyen' }

```

5. `except(keys: string[])`

Trả về toàn bộ dữ liệu, trừ các trường được liệt kê.

```typescript
const requestData = request.except(['age']);
// requestData = { role: 'admin', firstName: 'Nguyen', lastName: 'Nguyen' }
```

6. headers()

Trả về mọi header của request.

```typescript
const headers = request.headers();
// headers = { 'content-type': 'application/json', ... }
```

7. `header(key: string, defaultValue?: string)`

Lấy giá trị của một header. Nếu header không có, trả về `defaultValue`.

```typescript
const contentType = request.header('Content-Type');
// contentType = 'application/json'

const nonExistentHeader = request.header('Non-Existent', 'default-value');
// nonExistentHeader = 'default-value'
```

8. `param(key: string)`

Lấy giá trị của một tham số trên đường dẫn route (path param). Muốn đọc `query string` thì dùng `query()`.

```typescript
// route: /users/:id, URL: /users/1
const id = request.param('id');
// id = '1'
```

9. `has(key: string | string[])`

Kiểm tra một hoặc nhiều trường có trong dữ liệu yêu cầu không. Với nhiều trường, kết quả chỉ là `true` khi có đủ tất cả.

```typescript
const hasRole = request.has('role');
// hasRole = true

const hasNonExistentField = request.has('nonExistentField');
// hasNonExistentField = false

const hasMultipleFields = request.has(['firstName', 'age']);
// hasMultipleFields = true

const hasSomeFields = request.has(['firstName', 'nonExistentField']);
// hasSomeFields = false

```

10. `hasAny(key: string | string[])`

Trả về `true` nếu có ít nhất một trong các trường.

```typescript
const hasAnyRole = request.hasAny(['role', 'nonExistentField']);
// hasAnyRole = true
const hasAnyNonExistent = request.hasAny(['nonExistentField1', 'nonExistentField2']);
// hasAnyNonExistent = false
```
11. `protocol()`

Trả về giao thức của request (HTTP hoặc HTTPS).

```typescript
const protocol = request.protocol();
// protocol = 'http://'
```   

12. `hasHeader(key: string)`

Kiểm tra request có một header hay không.

```typescript
const hasContentType = request.hasHeader('Content-Type');
// hasContentType = true

const hasNonExistentHeader = request.hasHeader('Non-Existent-Header');
// hasNonExistentHeader = false
```

13. `isMethod(method: string)`

Kiểm tra phương thức HTTP của request có khớp với giá trị truyền vào không.

```typescript
const isPost = request.isMethod('POST');
// isPost = true

const isGet = request.isMethod('GET');
// isGet = false
```

14. `path()`

Trả về đường dẫn (path) của request.

```typescript
const path = request.path();
// path = '/api/register'
```

15. `url()`

Trả về URL đầy đủ của request.

```typescript
const fullUrl = request.url();
// fullUrl = 'http://localhost:3000/api/register'
```

16. `method()`

Trả về phương thức HTTP của request.

```typescript
const method = request.method();
// method = 'POST'
```

17. `validated()`

Trả về dữ liệu đã qua kiểm tra (validation).

```typescript
const validatedData = request.validated();
// validatedData = { firstName: 'Nguyen', lastName: 'Nguyen', age: 24 }