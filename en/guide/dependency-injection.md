# Dependency injection

Classes in a v1 app get their dependencies through the constructor, and decorators are not required. A build step records the parameter types of every constructor. At runtime the container reads that record and builds the class: concrete classes are created on demand, while interfaces and primitives are bound to typed tokens.

```ts
export class UserService {
  constructor(readonly users: UserRepository, readonly mailer: Mailer) {}
}
```

Here `UserRepository` is a class, so the container builds it with no setup. `Mailer` is an interface, which has no runtime value, so it needs a token and a binding.

The container lives in `@laratype/core`, and the build transform in `sauf`. On `master`, `@laratype/core` is still an empty scaffold: everything on this page is in open pull requests.

## Tokens <Status issue="96" pr="196" />

A token is a typed key for a value that has no runtime class, such as an interface, a primitive or a config object:

```ts
export interface Mailer { send(to: string, body: string): Promise<void> }
export const MAILER = token<Mailer>('mailer')
```

`container.make(MAILER)` returns a `Mailer`. Tokens are compared by identity, not by name, so two calls to `token('x')` give two different keys. The container doesn't accept plain strings or symbols as keys.

## The container <Status issue="96" pr="196" />

| Method | What it does |
|---|---|
| `bind(token, concrete?, { scope }?)` | Binds a token to a class or a factory. Transient unless you pass `{ scope: 'singleton' }`. |
| `singleton(token, concrete?)` | Binds and caches the first instance. |
| `transient(token, concrete?)` | Binds and builds a new instance on every `make()`. |
| `instance(token, value)` | Binds an existing value. |
| `make(token)` | Resolves a token or a class. |
| `has(token)` | Whether there is an explicit binding, searching parent containers too. |
| `createChild()` | Creates a child container. |

A concrete is either a class or a factory `(container) => value`. A class bound without a concrete is bound to itself, as in `app.singleton(Clock)`. Tokens and abstract classes can't be bound to themselves.

`make()` resolves in this order:

1. It looks for a binding in this container, then in each parent.
2. If there is none and the key is a class, it builds the class (autowiring). Autowired classes are transient for now.
3. Otherwise it throws.

**Singletons** are built by the container that owns the binding, so a child's overrides never leak into a shared instance. Binding a token again replaces the cached instance.

**Child containers** see their parent's bindings, and their own bindings shadow the parent's without changing it. That makes them useful in tests:

```ts
const testApp = app.createChild()
testApp.instance(MAILER, { send: async () => {} })
```

**Scopes.** The container currently has two scopes, `transient` and `singleton`. A third, `request`, is planned (see [Request scope](#request-scope)).

**Cycles** are detected across the whole container tree, factories included. A cycle throws `Circular dependency: A -> B -> A`, and the container keeps working for later calls.

The container doesn't support async factories.

### Errors

Resolution failures throw a `DiError` with one of these messages:

| Message | Usual cause |
|---|---|
| `No binding for InjectionToken(mailer).` | A token was never bound. |
| `Cannot bind InjectionToken(x) to itself: only a class can be self-bound.` | `bind(token)` without a concrete. |
| `Cannot autowire UserService: its constructor takes 2 param(s) but no dependency metadata was found.` | The class wasn't processed by the DI transform. |
| ``Cannot resolve UserService constructor param #1 `mailer`: type `Mailer` has no runtime value.`` | An interface or primitive parameter with no token. |
| ``Cannot resolve UserService constructor param #1 `mailer`: its type resolved to undefined at runtime.`` | Usually a circular import evaluated too early. |
| `Circular dependency: A -> B -> A` | Two services depend on each other. |

Messages with fix hints are planned in [#100](https://github.com/Laratypes/Laratype/issues/100).

## How constructor injection works <Status issue="101" pr="194" />

The DI transform runs at build time, before SWC. For every class with its own constructor, it adds a call after the class that lists one entry per parameter:

```ts
export class Notifier {
  constructor(@Inject(MAILER) private mailer: Mailer, public name: string, public clock: Clock = new Clock()) {}
}
__laratype_deps(Notifier, [() => MAILER, { unresolved: "string", index: 1 }, () => Clock],
  { params: ["mailer", "name", "clock"], optional: [2] });
```

Each entry is a function that returns the key, so it runs only when the class is resolved. Circular module imports therefore work without `forwardRef`.

What the transform records for each parameter type:

| Parameter type | Injected as |
|---|---|
| A class imported as a value, or declared in the file | that class |
| `@Inject(TOKEN)` | the token, whatever the type says |
| A generic class, such as `Repo<User>` | `Repo`. Type arguments are erased, so `Repo<User>` and `Repo<Post>` share one key; use tokens to keep them apart. |
| `Foo \| undefined`, `Foo \| null` | `Foo`, marked optional |
| An `import type` name, an interface, a type alias, a primitive, a union, an array, a function type or no annotation | nothing it can resolve, so the container throws unless the parameter is optional |

A parameter is optional when it has `?`, a default value or a nullable union. If the container can't resolve an optional parameter, it passes `undefined` and the JavaScript default applies. A class type that can be resolved is still injected, so its default is ignored.

A class without its own constructor gets no entry and inherits its parent's. The transform never throws on your code; problems show up as `DiError`s when the class is resolved.

The transform is not wired into `sauf dev` and `sauf build` yet. That is [#102](https://github.com/Laratypes/Laratype/issues/102) for the Vite dev server and [#116](https://github.com/Laratypes/Laratype/issues/116) for Bun builds.

## The dependency registry <Status issue="97" pr="201" />

The call emitted by the transform, `__laratype_deps`, stores the entry on the class itself. `depsRegistry` is what the container reads, so an application creates its container like this:

```ts
const app = new Container({ deps: depsRegistry })
```

The registry walks up the class hierarchy. A class with its own entry uses it. For third-party classes compiled with decorator metadata, it falls back to `design:paramtypes` when `reflect-metadata` is loaded. A class with neither inherits its nearest ancestor's entry.

You don't call `__laratype_deps` yourself. The example below calls it by hand only because the transform isn't part of the example's compile step.

::: info Illustrative example
The container, tokens and registry are in review in PRs [#196](https://github.com/Laratypes/Laratype/pull/196) and [#201](https://github.com/Laratypes/Laratype/pull/201). The example is type-checked against those pull requests.
:::

<<< @/snippets/v1/di/proposed/container.ts

## @Inject and @Injectable <Status issue="98" />

Two decorators are planned for `@laratype/core`:

- `@Inject(token)` on a constructor parameter, for interfaces, primitives and generics. The transform already reads it and injects the token. At runtime the decorator will also record the token, so the container can report a conflict when a wrapper decorator hides it from the transform.
- `@Injectable({ scope })` on a class, only when it needs a scope other than the default.

Their signatures will be documented when [#98](https://github.com/Laratypes/Laratype/issues/98) lands.

## Request scope <Status issue="112" />

A third scope, `request`, will cache one instance per HTTP request and dispose of it when the request ends. A controller that depends on a request-scoped service becomes request-scoped itself, and you get a warning in development.

The same issue settles three open points: whether autowired classes default to transient or singleton, whether `has()` counts classes that can be autowired, and a runtime guard against resolving abstract classes.

## Boot-time checks <Status issue="113" />

The container will be able to check the whole dependency graph at boot: it will report cycles with the chain of tokens, singletons that depend on request-scoped services, and bindings nothing uses. `sauf build` will run this check.

## Registries and facades <Status issue="114" />

The route registry, the model binding registry and the database connection will move from globals into the container. A `Facade` base class over the container will then back `Auth`, `Log`, `Hash` and `Mail`, and tests will swap or fake them through the container ([#115](https://github.com/Laratypes/Laratype/issues/115)).

## Method injection <Status issue="158" />

Handler methods will be able to take services after the context argument, as in `async store(ctx, mailer: Mailer)`, and so will job `handle()` methods. Constructor injection stays the main style.
