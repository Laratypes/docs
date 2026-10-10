# Request

Request API cung cấp các phương thức để truy cập và thao tác với các yêu cầu HTTP đến trong ứng dụng của bạn. Bạn có thể sử dụng API này để lấy thông tin về yêu cầu, như `header`, `params`, và `data` gửi kèm.

## API

Example request
```sh
curl --location 'http://localhost:3000/api/register?rol=admin' \
--header 'Content-Type: application/json' \
--data-raw '{
    "firstName": "Nguyen",
    "lastName": "Nguyen",
    "age": 24
}'

```

1. `all()`

Trả về tất cả dữ liệu yêu cầu (bao gồm cả `query string` và `body`).

```typescript
const requestData = request.all();
// requestData = { role: 'admin', firstName: 'Nguyen', lastName: 'Nguyen', age: 24 }
```

2. `query()`

Lấy tất cả các tham số trong `query string` của yêu cầu.

```typescript
const queryParams = request.query();
// queryParams = { role: 'admin' }
```

3. `input(key: string | string[])`

Lấy giá trị của một trường cụ thể từ dữ liệu yêu cầu.

```typescript
const firstName = request.input('firstName');
// firstName = 'Nguyen'

const selectedData = request.input(['firstName', 'age']);
// selectedData = { firstName: 'Nguyen', age: 24 }

```

4. `only(keys: string[])`

Trả về một phần dữ liệu yêu cầu dựa trên các trường được chỉ định.

```typescript
const requestData = request.only(['firstName', 'lastName']);
// requestData = { firstName: 'Nguyen', lastName: 'Nguyen' }

```

5. `except(keys: string[])`

Trả về tất cả dữ liệu của request ngoại trừ các trường được chỉ định.

```typescript
const requestData = request.except(['age']);
// requestData = { role: 'admin', firstName: 'Nguyen', lastName: 'Nguyen' }
```

6. headers()

Trả về tất cả các header của request.

```typescript
const headers = request.headers();
// headers = { 'content-type': 'application/json', ... }
```

7. `header(key: string, defaultValue?: string)`

Lấy giá trị của một header cụ thể từ yêu cầu.

```typescript
const contentType = request.header('Content-Type');
// contentType = 'application/json'

const nonExistentHeader = request.header('Non-Existent', 'default-value');
// nonExistentHeader = 'default-value'
```

8. `param(key: string)`

Lấy giá trị của một tham số cụ thể từ `query string`.

```typescript
const role = request.param('rol');
// role = 'admin' 
```

9. `has(key: string | string[])`

Kiểm tra xem một hoặc nhiều trường có tồn tại trong dữ liệu yêu cầu hay không.

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

Kiểm tra xem ít nhất một trong các trường có tồn tại trong dữ liệu yêu cầu hay không.

```typescript
const hasAnyRole = request.hasAny(['role', 'nonExistentField']);
// hasAnyRole = true
const hasAnyNonExistent = request.hasAny(['nonExistentField1', 'nonExistentField2']);
// hasAnyNonExistent = false
```
11. `protocol()`

Lấy giao thức của request (HTTP hoặc HTTPS).

```typescript
const protocol = request.protocol();
// protocol = 'http://'
```   

12. `hasHeader(key: string)`

Kiểm tra xem một header cụ thể có tồn tại trong yêu cầu hay không.

```typescript
const hasContentType = request.hasHeader('Content-Type');
// hasContentType = true

const hasNonExistentHeader = request.hasHeader('Non-Existent-Header');
// hasNonExistentHeader = false
```

13. `isMethod(method: string)`

Kiểm tra xem phương thức của yêu cầu có khớp với phương thức đã cho hay không.

```typescript
const isPost = request.isMethod('POST');
// isPost = true

const isGet = request.isMethod('GET');
// isGet = false
```

14. `path()`

Lấy đường dẫn của request.

```typescript
const path = request.path();
// path = '/api/register'
```

15. `url()`

Lấy URL đầy đủ của request.

```typescript
const fullUrl = request.url();
// fullUrl = 'http://localhost:3000/api/register'
```

16. `method()`

Lấy phương thức HTTP của request.

```typescript
const method = request.method();
// method = 'POST'
```

17. `validated()`

Lấy dữ liệu đã được xác thực từ yêu cầu.

```typescript
const validatedData = request.validated();
// validatedData = { firstName: 'Nguyen', lastName: 'Nguyen', age: 24 }