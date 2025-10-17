# Service Providers

Service providers are classes responsible for initializing various components of the application.

In Laratype, most services are provided by service providers. They are responsible for registering bindings in the service container, events, middleware, and much more.

Laratype supports many different types of service providers, including:

- `ServiceProvider`: The base class for all service providers.
- `RouteServiceProvider`: Specialized for registering routes.
- `AppServiceProvider`: Used to register general application services.

The common feature of service providers is that they all inherit from the `ServiceProvider` class and can override methods like `register` and `boot` to perform specific actions when the application starts.

Additionally, all service providers will have a `transpile` property, which is a `ViteDevServer instance`. By default, when Laratype starts, it will pass the `ViteDevServer instance` to this property. You can use it to access Vite features in your service provider or compile TypeScript files during development.

## Creating a Service Provider

To create a new service provider, you need to create a TypeScript file in the `src/providers` directory.

```typescript
// src/providers/RouteServiceProvider.ts

import { defineRouteGroup } from "@laratype/http";
import { RouteAppServiceProvider } from "@laratype/support";
import { baseRouteApi } from "../../routes/api";

export default class RouteServiceProvider extends RouteAppServiceProvider {

  public routes() {
    return defineRouteGroup("/api", baseRouteApi, this)
  }
}

```

## Registering a Service Provider

After creating a service provider, you need to register it in the `config/providers.ts` file so that Laratype can use it.

```typescript{7}
// config/providers.ts

import { DatabaseServiceProvider } from "@laratype/database";
import RouteServiceProvider from "../src/providers/RouteServiceProvider";

export default [
  RouteServiceProvider,
  DatabaseServiceProvider,
];

```
