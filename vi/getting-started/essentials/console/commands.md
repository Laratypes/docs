# Commands

Laratype cung cấp một số lệnh tiện ích để giúp bạn quản lý và phát triển ứng dụng của mình. Các lệnh này có thể được chạy từ dòng lệnh (CLI) và thường được sử dụng để tạo các thành phần mới, chạy máy chủ phát triển, và thực hiện các tác vụ khác. Bạn có thể tham khảo thêm [tại đây](/vi/getting-started/sauf/introduction.md).

Tuy nhiên, bạn có thể tự tạo các lệnh tùy chỉnh của riêng mình để phục vụ các nhu cầu cụ thể của ứng dụng. Dưới đây là hướng dẫn cơ bản về cách tạo và sử dụng lệnh trong Laratype.

> [!INFO]
> Các lệnh được tổ chức trong thư mục `console/commands`.

> [!INFO]
> Laratype sử dụng thư viện [commander](https://github.com/tj/commander.js) để quản lý các lệnh CLI.

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

Laratype sẽ tạo một file command mới trong thư mục `src/console/commands/` với tên `SendMail.ts`.

> [!TIP]
> Bạn có thể tạo nhiều command cùng lúc bằng cách truyền vào nhiều tên.

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

Mỗi command sẽ kế thừa từ lớp `Command` có sẵn trong gói `@laratype/console`. Bạn cần định nghĩa các thuộc tính `signature` và `description` để mô tả lệnh, và phương thức `handle()` để chứa logic thực thi của lệnh.

### Options

Bạn có thể định nghĩa các tùy chọn (options) cho lệnh của mình bằng cách sử dụng `static options` trong class command.

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

Bạn có thể định nghĩa các đối số (arguments) cho lệnh của mình bằng cách sử dụng `static arguments` trong class command.

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

Sau khi tạo command, bạn có thể chạy nó từ dòng lệnh bằng cách sử dụng lệnh `sauf` hoặc `saufx` (đối với môi trường production). Ví dụ, để chạy lệnh `SendMail`, bạn sẽ sử dụng:

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

Bạn có thể lấy danh sách tất cả các lệnh có sẵn bằng cách chạy:

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