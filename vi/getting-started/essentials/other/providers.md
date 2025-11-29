# Service Providers

Service provider là một lớp chịu trách nhiệm khởi tạo các thành phần khác nhau của ứng dụng.

Trong Laratype, hầu hết các dịch vụ được cung cấp bởi các service provider. Chúng chịu trách nhiệm đăng ký các binding trong service container, sự kiện, middleware, và nhiều hơn nữa.

Laratype hỗ trợ nhiều loại service provider khác nhau, bao gồm:

- `ServiceProvider`: Lớp cơ sở cho tất cả các service provider.
- `RouteServiceProvider`: Chuyên dùng để đăng ký các route.
- `AppServiceProvider`: Dùng để đăng ký các dịch vụ ứng dụng chung.

Đặc điểm chung của các service provider là chúng đều kế thừa từ lớp `ServiceProvider` và có thể ghi đè các phương thức như `register` và `boot` để thực hiện các hành động cụ thể khi ứng dụng khởi động.

> [!INFO]
> Các service provider được tổ chức trong thư mục `src/providers`.

## Tạo Service Provider

Để tạo một service provider mới, bạn cần tạo một tệp TypeScript trong thư mục `src/providers`.

::: code-group

```ts [RouteServiceProvider.ts]

import { defineRouteGroup } from "@laratype/http";
import { RouteAppServiceProvider } from "@laratype/support";
import { baseRouteApi } from "../../routes/api";

export default class RouteServiceProvider extends RouteAppServiceProvider {

  public routes() {
    return defineRouteGroup("/api", baseRouteApi, this)
  }
}

```
:::

## Đăng ký Service Provider

Sau khi tạo service provider, bạn cần đăng ký nó trong tệp `config/providers.ts` để Laratype có thể sử dụng nó.

::: code-group

```ts [config/providers.ts]{5}
import { DatabaseServiceProvider } from "@laratype/database";
import RouteServiceProvider from "../src/providers/RouteServiceProvider";

export default [
  RouteServiceProvider,
  DatabaseServiceProvider,
];

```
:::