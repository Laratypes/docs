# Commands

Laratype có sẵn các lệnh dòng lệnh (CLI) để tạo thành phần mới, chạy server phát triển và làm các việc khác (xem [tại đây](/vi/getting-started/sauf/introduction.md)). Trang này hướng dẫn tự viết lệnh riêng cho ứng dụng.

> [!INFO]
> Các lệnh nằm trong thư mục `src/console/commands`.

> [!INFO]
> Lệnh CLI của Laratype chạy trên thư viện [commander](https://github.com/tj/commander.js).

## Tạo lệnh mới

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

Lệnh này tạo file `SendMail.ts` trong thư mục `src/console/commands/`.

> [!TIP]
> Truyền nhiều tên để tạo nhiều command cùng lúc.

::: details Xem thêm

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

Mỗi command kế thừa lớp `Command` của gói `@laratype/console`. `signature` là tên lệnh, `description` là mô tả, còn code chạy khi gọi lệnh nằm trong phương thức `handle()`.

### Options

Khai báo tùy chọn (options) của lệnh trong `static options`:

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

Khai báo đối số (arguments) của lệnh trong `static arguments`:

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

## Chạy command

Chạy command bằng `sauf`, hoặc bằng `saufx` trên production. Ví dụ với lệnh `SendMail`:

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

Xem danh sách mọi lệnh hiện có:

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