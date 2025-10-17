# Commands

Laratype provides a number of utility commands to help you manage and develop your application. These commands can be run from the command line (CLI) and are typically used to create new components, run the development server, and perform other tasks. You can learn more [here](/en/sauf/introduction.md).

However, you can create your own custom commands to serve the specific needs of your application. Below is a basic guide on how to create and use commands in Laratype.

## Creating a New Command

Laratype uses the [commander](https://github.com/tj/commander.js) library to manage CLI commands. To create a new command, you need to create a TypeScript file in the `src/console/commands` directory. For example, to create a command named `SendMail`, you can do the following:

```typescript
// src/console/commands/SendMail.ts

import { Command } from "@laratype/console";

export default class SendMail extends Command {

  static signature = "send:mail";

  static description = "Send a test email";

  public async handle() {
    console.log("Sending a test email...");
  }

}

```

## Running Commands

After creating a command, you can run it from the command line using the `sauf` command (Laratype CLI). For example, to run the `SendMail` command, you would use:

::: code-group

```sh [npm]
$ npx sauf send:mail
```

```sh [pnpm]
$ pnpx sauf send:mail
```

```sh [yarn]
$ yarn sauf send:mail
```

```sh [bun]
$ bun sauf send:mail
```

:::

You can get a list of all available commands by running:

::: code-group

```sh [npm]
$ npx sauf -h
```

```sh [pnpm]
$ pnpx sauf -h
```

```sh [yarn]
$ yarn sauf -h
```

```sh [bun]
$ bun sauf -h
```

:::
