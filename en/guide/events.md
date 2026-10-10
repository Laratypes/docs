# Events

Events let one part of the application announce that something happened, and listeners react to it. v1 plans events as classes, with listeners created by the container ([#165](https://github.com/Laratypes/Laratype/issues/165)). 0.5 has no events package, and #165 doesn't name the package that will hold them.

## Events and listeners <Status issue="165" />

- An event is a class.
- A listener is a class created by the container, so it gets constructor injection.
- A listener's `handle(event: X)` method names the event it handles.

## Registering listeners <Status issue="165" />

A listener is registered in one of two ways:

- with `EventServiceProvider.listen`;
- by discovery: the DI transform records the event type from the `handle(event: X)` parameter.

How the transform records the event type is not specified yet. The transform's output carries only constructor dependencies so far (see [Dependency injection › How constructor injection works](./dependency-injection#how-constructor-injection-works)).

## Dispatching events <Status issue="165" />

`Event.dispatch(new UserRegistered(user))` dispatches an event, typed by its class. Subscribers are planned too.

::: info Illustrative example
Planned in [#165](https://github.com/Laratypes/Laratype/issues/165). None of this code runs today. `UserRegistered` and `SendWelcomeMail` are names for this example. Whether events and listeners extend a base class is not specified yet.
:::

```ts
class SendWelcomeMail {
  handle(event: UserRegistered) {
    // react to the event
  }
}

Event.dispatch(new UserRegistered(user))
```

Events are also used by queued listeners (`ShouldQueue`, see [Queues](./queues#queued-listeners)), by [broadcasting](./broadcasting) and by model lifecycle hooks, which wait on the [database layer](./database).

## Testing <Status issue="165" />

`Event.fake()` replaces the dispatcher in tests. `assertDispatched` and `assertNotDispatched` check which events were dispatched. Their arguments are not specified yet.
