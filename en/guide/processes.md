# Processes

v1 plans a `Process` facade for running external programs, built on `node:child_process` ([#176](https://github.com/Laratypes/Laratype/issues/176)). It is in the last milestone (M4). #176 doesn't name the package that will hold it.

## Running processes <Status issue="176" />

The facade offers `Process.run`, `start`, `pool` and `pipe`. A process can have a timeout, environment variables and a working directory, and its output can be streamed. The parameters of these methods are not specified yet.

## Testing <Status issue="176" />

`Process.fake()` replaces the facade in tests and comes with assertions. Their names are not specified yet.

## Edge runtimes <Status issue="176" />

`Process` is marked as not safe for the edge. The edge adapters leave it out (see [Build › Edge runtimes](./build#edge-runtimes)).
