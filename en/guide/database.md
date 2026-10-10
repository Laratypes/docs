# Database

::: warning Design not decided
The v1 model layer waits on the ORM decision S5 ([#88](https://github.com/Laratypes/Laratype/issues/88)): an Eloquent-like model on Kysely, or keeping TypeORM. This page lists what is planned and will be written once that decision is made.
:::

`@laratype/database` is the model layer. In 0.5 it is built on TypeORM. To build an application today, see the [0.5.4 database docs](/v0.5/getting-started/essentials/database/introduction).

## The ORM decision <Status issue="88" />

S5 compares the two options on typed `where`, `with` and `select`, relations, migrations, introspection, transactions and the effort to port factories and seeders. It also defines a minimal `BindableModel` interface that both options satisfy: find by key, plus primary key metadata.

Other parts of v1 depend on it:

- [model binding](./model-binding), explicit and implicit ([#118](https://github.com/Laratypes/Laratype/issues/118), [#163](https://github.com/Laratypes/Laratype/issues/163));
- the model types used by [policies](./authorization) and [resources](./responses#resources);
- the storage of the [OAuth2 server](./oauth2), which needs migrations;
- SWC's `decoratorMetadata`, which stays on while TypeORM is in use (see [Build › One plugin chain](./build#one-plugin-chain)).

## Planned work <Status issue="145" />

These issues are planned for the v1 beta (milestone M3). Their scope depends on the ORM that S5 picks.

| Issue | Planned |
|---|---|
| DB1 [#145](https://github.com/Laratypes/Laratype/issues/145) | An Eloquent-like model: query builder, `find`, `findOrFail`, pagination, primary key metadata |
| DB2 [#146](https://github.com/Laratypes/Laratype/issues/146) | Typed `fillable` and `hidden`: creating a model accepts only fillable keys, and hidden keys leave the serialized type |
| DB3 [#147](https://github.com/Laratypes/Laratype/issues/147) | Typed relations (`hasOne`, `hasMany`, `belongsTo`, `belongsToMany`) and typed eager loading with `with()` |
| DB4 [#148](https://github.com/Laratypes/Laratype/issues/148) | A migration runner, and `sauf db:introspect`, which generates the `Database` interface from the schema |
| DB5 [#149](https://github.com/Laratypes/Laratype/issues/149) | Factories and seeders ported from 0.5 |
| DB6 [#150](https://github.com/Laratypes/Laratype/issues/150) | An adapter over TypeORM entities, so 0.5 apps can upgrade gradually |
