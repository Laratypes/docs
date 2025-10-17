# Commands

Laratype cung cấp một số lệnh tiện ích để giúp bạn quản lý và phát triển ứng dụng của mình. Các lệnh này có thể được chạy từ dòng lệnh (CLI) và thường được sử dụng để tạo các thành phần mới, chạy máy chủ phát triển, và thực hiện các tác vụ khác. Bạn có thể tham khảo thêm [tại đây](/vi/sauf/introduction.md).

Tuy nhiên, bạn có thể tự tạo các lệnh tùy chỉnh của riêng mình để phục vụ các nhu cầu cụ thể của ứng dụng. Dưới đây là hướng dẫn cơ bản về cách tạo và sử dụng lệnh trong Laratype.

## Tạo lệnh mới

Laratype sử dụng thư viện [commander](https://github.com/tj/commander.js) để quản lý các lệnh CLI. Để tạo một lệnh mới, bạn cần tạo một tệp TypeScript trong thư mục `src/console/commands`. Ví dụ, để tạo một lệnh có tên `SendMail`, bạn có thể làm như sau:

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

## Chạy lệnh

Sau khi tạo lệnh, bạn có thể chạy nó từ dòng lệnh bằng cách sử dụng lệnh `sauf` (Laratype CLI). Ví dụ, để chạy lệnh `SendMail`, bạn sẽ sử dụng:

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

Bạn có thể lấy danh sách tất cả các lệnh có sẵn bằng cách chạy:

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