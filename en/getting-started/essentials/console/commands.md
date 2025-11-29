# Commands

Laratype provides a number of utility commands to help you manage and develop your application. These commands can be run from the command line (CLI) and are typically used to create new components, run the development server, and perform other tasks. You can learn more [here](/en/getting-started/sauf/introduction.md).

However, you can create your own custom commands to serve the specific needs of your application. Below is a basic guide on how to create and use commands in Laratype.

> [!INFO]
> Commands are organized in the `console/commands` directory.

> [!INFO]
> Laratype uses the [commander](https://github.com/tj/commander.js) library to manage CLI commands.

## Creating a New Command

### Generate Command

::: code-group

```sh [npx]
$ npx sauf make:command SendMail
```

```sh [pnpx]
$ pnpx sauf make:command SendMail
```

```sh [bunx]
$ bunx sauf make:command SendMail
```

:::

Laratype will create a new command file in the `src/console/commands/` directory with the name `SendMail.ts`.

> [!TIP]
> You can create multiple commands at once by passing multiple names.

::: details See more

::: code-group

```sh [npx]
$ npx sauf make:command SendMail AnotherCommand
```

```sh [pnpx]
$ pnpx sauf make:command SendMail AnotherCommand
```

```sh [bunx]
$ bunx sauf make:command SendMail AnotherCommand
```
:::

### Writing Command

::: code-group

```ts [SendMail.ts]
import { Command } from "@laratype/console";

export default class SendMail extends Command {

  static signature = "send:mail";

  static description = "Send a test email";

  public async handle() {
    console.log("Sending a test email...");
  }

}

```
:::

Each command inherits from the `Command` class available in the `@laratype/console` package. You need to define the `signature` and `description` properties to describe the command, and the `handle()` method to contain the command's execution logic.

### Options

You can define options for your command using `static options` in the command class.

::: code-group

```ts [SendMail.ts]
import { Command } from "@laratype/console";

export default class SendMail extends Command {

  static signature = "send:mail";

  static description = "Send a test email";

  static options = [
    ['-d, --date <date>', 'Date to send the email', '2025-11-29'],
    ['-l, --logs <logs>', 'Logs to display', 'info'],
  ]

  public async handle() {
    const options = this.opts();
    console.log(`Sending email on date: ${options.date}`);
    console.log(`Logging level: ${options.logs}`);
    console.log("Sending a test email...");
  }

}

```
:::

### Arguments

You can define arguments for your command using `static arguments` in the command class.

::: code-group

```ts [SendMail.ts]
import { Command } from "@laratype/console";

export default class SendMail extends Command {

  static signature = "send:mail";

  static description = "Send a test email";

  static arguments = [
    {
      name: "<ids...>",
      description: "The IDs of users to send email to",
    }
  ]

  public async handle(userIds: string[]) {

    for (const id of userIds) {
      console.log(`Sending email to user ID: ${id}`);
    }
  }

}

```
:::

## Running Commands

After creating a command, you can run it from the command line using the `sauf` or `saufx` (for production environment) command. For example, to run the `SendMail` command, you would use:

::: details Development {open}

::: code-group

```sh [npx]
$ npx sauf send:mail
```

```sh [pnpx]
$ pnpx sauf send:mail
```

```sh [yarn]
$ yarn sauf send:mail
```

```sh [bunx]
$ bunx sauf send:mail
```

:::

::: details Production

::: code-group

```sh [npm]
$ npm saufx send:mail
```

```sh [pnpm]
$ pnpm saufx send:mail
```

```sh [yarn]
$ yarn saufx send:mail
```

```sh [bun]
$ bun saufx send:mail
```

:::

You can get a list of all available commands by running:

::: details Development {open}

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

::: details Production

::: code-group

```sh [npm]
$ npm saufx -h
```

```sh [pnpm]
$ pnpm saufx -h
```

```sh [yarn]
$ yarn saufx -h
```

```sh [bun]
$ bun saufx -h
```

:::
