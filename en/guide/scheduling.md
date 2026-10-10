# Task scheduling

`@laratype/schedule` will run tasks on a schedule ([#171](https://github.com/Laratypes/Laratype/issues/171)). In 0.5 the package contains only a `package.json`, but the 0.5 app config already has `schedule_timezone`.

## Defining the schedule <Status issue="171" />

The schedule is defined with `schedule(s => ...)` in `routes/console.ts`. Three methods add tasks:

- `s.command()` runs a [console command](./console);
- `s.job()` dispatches a [job](./queues);
- `s.call()` runs a function.

A task's frequency is a cron expression, parsed with `croner`, or a fluent frequency such as `daily()` or `everyFiveMinutes()`. Times use the timezone in `config.schedule_timezone`.

The arguments of these methods, and how a frequency is attached to a task, are not specified yet.

## Preventing overlaps <Status issue="171" />

`withoutOverlapping()` and `onOneServer()` stop a task from running twice at the same time. Both use `Cache.lock` (see [Cache › Locks](./cache#locks)).

## Running the scheduler <Status issue="171" />

#171 names three commands: `sauf schedule:run`, `sauf schedule:work` and `sauf schedule:list`. Their options are not specified yet.

On Vercel, Vercel Cron calls `schedule:run` through a route protected by a secret (see [Build › Vercel](./build#vercel)).
