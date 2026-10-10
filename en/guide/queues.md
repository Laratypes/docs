# Queues

Queues run slow work, such as sending mail, outside the request. `@laratype/queue` is a new package planned for v1 ([#169](https://github.com/Laratypes/Laratype/issues/169)), and job chains and batches follow in [#175](https://github.com/Laratypes/Laratype/issues/175). 0.5 has no queue package.

## Jobs <Status issue="169" />

- A job is a class. Its constructor takes the payload.
- `handle()` receives the job's dependencies by [method injection](./dependency-injection#method-injection).
- A job is serialized as its name, taken from the build manifest, plus its arguments as JSON.
- A model in the payload is serialized by its primary key and fetched again when the job runs. How this works before the ORM is chosen is not specified yet ([#88](https://github.com/Laratypes/Laratype/issues/88)).
- Each job runs in its own request scope (see [Dependency injection › Request scope](./dependency-injection#request-scope)).

## Dispatching jobs <Status issue="169" />

`dispatch(job)` sends a job to the queue. The dispatch can be chained with `.delay()`, `.onQueue()` and `.onConnection()`, and jobs support retries, backoff and a timeout. The parameters of these methods are not specified yet.

::: info Illustrative example
Planned in [#169](https://github.com/Laratypes/Laratype/issues/169). None of this code runs today. `SendWelcomeMail` and `Mailer` are names for this example. Whether a job extends a base class is not specified yet.
:::

```ts
class SendWelcomeMail {
  constructor(private readonly email: string) {} // the payload

  async handle(mailer: Mailer) {
    // mailer is resolved by method injection
  }
}

dispatch(new SendWelcomeMail(email))
```

## Drivers <Status issue="169" />

The planned drivers are sync and redis, which runs on BullMQ. A database driver comes after the migration runner of the [database layer](./database) ([#148](https://github.com/Laratypes/Laratype/issues/148)). Queues are built on the [driver manager](./services#the-driver-manager).

## Failed jobs and the worker <Status issue="169" />

Failed jobs go to a failed job store. Three `sauf` commands work with the queue:

- `sauf queue:work` runs the worker;
- `sauf queue:failed` and `sauf queue:retry` handle failed jobs.

On Heroku, the `Procfile` stub runs the worker as `worker: sauf queue:work` (see [Build › Heroku](./build#heroku)). Vercel can't host a long-running worker (see [Build › Vercel](./build#vercel)).

## Queued listeners <Status issue="169" />

A listener marked with `ShouldQueue` runs on the queue instead of during the dispatch (see [Events](./events)).

## Testing <Status issue="169" />

`Queue.fake()` replaces the queue in tests and comes with assertions. Their names are not specified yet.

## Job chains and batches <Status issue="175" />

- **Chains** run jobs one after another: `Bus.chain([...]).catch().dispatch()`.
- **Batches** run a group of jobs: `Bus.batch([...]).then().catch().finally().allowFailures().dispatch()`. A batch reports its progress and can be cancelled.

Batches run their jobs in parallel through BullMQ flows, and they are stored in a `job_batches` table, which needs the migration runner of the [database layer](./database) ([#148](https://github.com/Laratypes/Laratype/issues/148)). The arguments of the callbacks are not specified yet.
