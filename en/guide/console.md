# Console commands

Console commands are classes that you run with `sauf`, for example `sauf send:mail`. v1 plans to create them through the container and to type their arguments from the signature ([#161](https://github.com/Laratypes/Laratype/issues/161)). The commands that come with `sauf` are listed on [The sauf CLI](./cli) page.

In 0.5, `@laratype/console` has a `Command` base class with static `signature`, `description`, `options` and `arguments` and a `handle()` method. `sauf` loads app commands from `app/src/console/commands/*.ts` and from the default export of `app/routes/console.ts`. See the [0.5.4 docs](/v0.5/getting-started/essentials/console/commands).

## Resolved by the container <Status issue="161" />

Commands will be created with `app.make()`, so they get constructor injection like any other class (see [Dependency injection](./dependency-injection)). In 0.5 they are created without DI.

The [scheduler](./scheduling), the [queue worker](./queues#failed-jobs-and-the-worker) and the other `sauf` commands rely on commands created this way.

## Typed signatures <Status issue="161" />

A signature such as `"send:mail {user} {--queue=}"` will type `this.argument('user')` and `this.option('queue')`. The parser uses template literal types, the same technique that types a contract's [path params](./contracts#path-params).

Whether the 0.5 static `options` and `arguments` arrays stay next to the typed signature is not specified yet.

## Closure commands <Status issue="161" />

`routes/console.ts` will also hold commands written as closures. Their form is not specified yet.

## Registration <Status issue="161" />

Commands will be registered through the [build manifest](./build#the-build-manifest) instead of being discovered from paths at runtime ([#125](https://github.com/Laratypes/Laratype/issues/125)).
