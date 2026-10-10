# Request

Request API provides methods to access and manipulate incoming HTTP requests in your application. You can use this API to get information about the request, such as `headers`, `params`, and `data` sent with it.

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

Returns all request data (including both `query string` and `body`).

```typescript
const requestData = request.all();
// requestData = { role: 'admin', firstName: 'Nguyen', lastName: 'Nguyen', age: 24 }
```

2. `query()`

Gets all parameters in the `query string` of the request.

```typescript
const queryParams = request.query();
// queryParams = { role: 'admin' }
```

3. `input(key: string | string[])`

Gets the value of a specific field from the request data.

```typescript
const firstName = request.input('firstName');
// firstName = 'Nguyen'

const selectedData = request.input(['firstName', 'age']);
// selectedData = { firstName: 'Nguyen', age: 24 }

```

4. `only(keys: string[])`

Returns a portion of the request data based on the specified fields.

```typescript
const requestData = request.only(['firstName', 'lastName']);
// requestData = { firstName: 'Nguyen', lastName: 'Nguyen' }

```

5. `except(keys: string[])`

Returns all request data except the specified fields.

```typescript
const requestData = request.except(['age']);
// requestData = { role: 'admin', firstName: 'Nguyen', lastName: 'Nguyen' }
```

6. headers()

Returns all request headers.

```typescript
const headers = request.headers();
// headers = { 'content-type': 'application/json', ... }
```

7. `header(key: string, defaultValue?: string)`

Gets the value of a specific header from the request.

```typescript
const contentType = request.header('Content-Type');
// contentType = 'application/json'

const nonExistentHeader = request.header('Non-Existent', 'default-value');
// nonExistentHeader = 'default-value'
```

8. `param(key: string)`

Gets the value of a specific parameter from the `query string`.

```typescript
const role = request.param('rol');
// role = 'admin' 
```

9. `has(key: string | string[])`

Checks whether one or more fields exist in the request data.

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

Checks whether at least one of the fields exists in the request data.

```typescript
const hasAnyRole = request.hasAny(['role', 'nonExistentField']);
// hasAnyRole = true
const hasAnyNonExistent = request.hasAny(['nonExistentField1', 'nonExistentField2']);
// hasAnyNonExistent = false
```
11. `protocol()`

Gets the protocol of the request (HTTP or HTTPS).

```typescript
const protocol = request.protocol();
// protocol = 'http://'
```   

12. `hasHeader(key: string)`

Checks whether a specific header exists in the request.

```typescript
const hasContentType = request.hasHeader('Content-Type');
// hasContentType = true

const hasNonExistentHeader = request.hasHeader('Non-Existent-Header');
// hasNonExistentHeader = false
```

13. `isMethod(method: string)`

Checks whether the request method matches the given method.

```typescript
const isPost = request.isMethod('POST');
// isPost = true

const isGet = request.isMethod('GET');
// isGet = false
```

14. `path()`

Gets the path of the request.

```typescript
const path = request.path();
// path = '/api/register'
```

15. `url()`

Gets the full URL of the request.

```typescript
const fullUrl = request.url();
// fullUrl = 'http://localhost:3000/api/register'
```

16. `method()`

Gets the HTTP method of the request.

```typescript
const method = request.method();
// method = 'POST'
```

17. `validated()`

Gets validated data from the request.

```typescript
const validatedData = request.validated();
// validatedData = { firstName: 'Nguyen', lastName: 'Nguyen', age: 24 }
````
