# Services

v1 plans a set of application services in the style of Laravel: [console commands](./console), [events](./events), [queues](./queues), the [scheduler](./scheduling), [mail](./mail), the [cache](./cache), [storage](./storage), [localization](./localization), [processes](./processes) and [broadcasting](./broadcasting). Each one has its own page. This page covers what they share: the driver manager, facades and the classes the container creates.

No v1 service code exists yet. The design on these pages comes from the [services spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/services.md) and the issues it links, and it may still change. A name in backticks is the name its issue uses. Its parameters and return type are not specified yet.

In 0.5, `@laratype/console` has a `Command` base class, and `@laratype/log` writes logs through winston. The `mail`, `i18n`, `storage`, `schedule` and `broadcast` packages contain only a `package.json`, and there is no events, cache, queue or process package.

## Shared rules <Status issue="160" />

Every service follows these rules:

- **Drivers:** a service that has drivers is built on the [driver manager](#the-driver-manager).
- **Facades:** every service has a facade with `fake()` for tests ([#115](https://github.com/Laratypes/Laratype/issues/115), see [Dependency injection › Registries and facades](./dependency-injection#registries-and-facades)).
- **Created by the container:** listeners, jobs, mailables and commands are created with `app.make()`, so constructor injection works without decorators.
- **Jobs:** a job's constructor holds its payload, and `handle()` receives its dependencies by [method injection](./dependency-injection#method-injection) ([#158](https://github.com/Laratypes/Laratype/issues/158)).
- **Listener discovery:** the DI transform reads a listener's `handle(event: X)` to register it for the event `X` ([#165](https://github.com/Laratypes/Laratype/issues/165), see [Events](./events)).

The details of each service come from its own issue. Anything the issue doesn't say is not settled yet.

## The driver manager <Status issue="160" />

`Manager<Drivers>` in `@laratype/core` is the base class of every service that has drivers. It provides:

- `driver(name?)`, which returns a driver by name, or the default driver;
- `extend(name, factory)`, which adds a driver;
- one cached instance per driver name.

The default driver and the driver names are typed from the config keys (see [Configuration](./configuration), [#152](https://github.com/Laratypes/Laratype/issues/152)). How the config type reaches the manager is not specified yet. The manager also works with the facades' `fake()`.

The cache, queues, mail, storage, broadcasting and logging follow this pattern. Logging is ported onto it, and its channels become manager drivers. In 0.5 the log config allows the channels `stack`, `single` and `daily`, but only `single` is implemented, and the others throw `DriverNotImplement`.
