# Service Providers

Service provider là lớp khởi tạo các thành phần của ứng dụng khi ứng dụng khởi động.

Phần lớn dịch vụ trong Laratype đến từ service provider. Provider đăng ký binding trong service container, sự kiện, middleware và các thành phần khác.

Các loại service provider trong Laratype gồm:

- `ServiceProvider`: lớp cơ sở của mọi service provider.
- `RouteAppServiceProvider`: đăng ký route.
- `AppServiceProvider`: đăng ký các dịch vụ chung của ứng dụng.

Mọi service provider đều kế thừa `ServiceProvider`. Bạn ghi đè các phương thức như `register` và `boot` để chạy code của mình lúc ứng dụng khởi động.

> [!INFO]
> Các service provider được tổ chức trong thư mục `src/providers`.

## Tạo Service Provider

Mỗi service provider là một file TypeScript trong thư mục `src/providers`:

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

Laratype chỉ chạy những provider được khai báo trong file `config/providers.ts`. Thêm provider mới vào danh sách này:

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