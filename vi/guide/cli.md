# CLI sauf

`sauf` là công cụ dòng lệnh của Laratype. Nó chạy dev server, build ứng dụng, sinh type cho frontend và tạo file mới từ template. DI transform cũng sẽ nằm trong package này ([#194](https://github.com/Laratypes/Laratype/pull/194), đang review).

Trang này nói về các lệnh mà v1 thay đổi nhiều nhất: `sauf dev`, `sauf build`, `sauf types:generate` và các generator `make:*`. [Spec CLI](https://github.com/Laratypes/Laratype/blob/master/docs/v1/cli.md) liệt kê mọi lệnh v1 đã được nêu tên. Tất cả đều đang lên kế hoạch, và phần lớn được mô tả ở trang của mảng tương ứng:

| Lệnh | Tác dụng | Issue | Trang |
|---|---|---|---|
| `sauf dev` | Dev server | [#126](https://github.com/Laratypes/Laratype/issues/126) | [sauf dev](#sauf-dev) |
| `sauf build` | Build production | [#128](https://github.com/Laratypes/Laratype/issues/128) | [sauf build](#sauf-build) |
| `sauf types:generate` | Ghi `api.ts` cho frontend ở repository khác | [#133](https://github.com/Laratypes/Laratype/issues/133) | [sauf types:generate](#sauf-types-generate) |
| `sauf route:list` | Liệt kê route registry | [#104](https://github.com/Laratypes/Laratype/issues/104) | [Routing › Route registry](./routing#route-registry) |
| `sauf make:*` | Tạo file từ template | [#134](https://github.com/Laratypes/Laratype/issues/134) | [Các generator make:*](#cac-generator-make) |
| `sauf db:introspect` | Sinh interface `Database` từ schema | [#148](https://github.com/Laratypes/Laratype/issues/148) | [Database](./database) |
| `sauf db:seed` | Chạy seeder | [#149](https://github.com/Laratypes/Laratype/issues/149) | [Database](./database) |
| `sauf queue:work`, `queue:failed`, `queue:retry` | Queue worker và job lỗi | [#169](https://github.com/Laratypes/Laratype/issues/169) | [Queue](./queues#job-loi-va-worker) |
| `sauf schedule:run`, `schedule:work`, `schedule:list` | Scheduler | [#171](https://github.com/Laratypes/Laratype/issues/171) | [Lập lịch tác vụ](./scheduling#chay-scheduler) |
| `sauf storage:link` | Chưa được mô tả | [#168](https://github.com/Laratypes/Laratype/issues/168) | [Storage](./storage#kiem-thu-va-cli) |
| `sauf oauth:keys` | Sinh key JWT cho OAuth2 | [#179](https://github.com/Laratypes/Laratype/issues/179) | [OAuth2 server](./oauth2#grant-va-token-guard) |
| `sauf oauth:client` | Client OAuth2, kể cả personal access client | [#180](https://github.com/Laratypes/Laratype/issues/180) | [OAuth2 server](./oauth2#scope-client-va-consent) |

Số phận của lệnh `db:init` ở bản 0.5, vốn không có issue v1, chưa được đặc tả. Lệnh chạy migration ([#148](https://github.com/Laratypes/Laratype/issues/148)) và lệnh xoá token OAuth2 đã hết hạn ([#180](https://github.com/Laratypes/Laratype/issues/180)) cũng vậy.

Command do bạn tự viết được mô tả ở [Console command](./console).

Trên `master`, `sauf` vẫn là CLI của bản 0.5. Mọi thứ trên trang này đều đang lên kế hoạch.

## sauf dev <Status issue="126" />

`sauf dev` khởi động dev server và khởi động lại nó khi có file thay đổi. Ở bản 0.5, lệnh này chạy Vite ở chế độ SSR với SWC.

Ở v1, dev server dùng cùng chuỗi plugin với `sauf build` và preset test (xem [Build › Một chuỗi plugin](./build#mot-chuoi-plugin)):

- DI transform chạy trước SWC, nên constructor injection khi dev hoạt động giống như trong bản build ([#102](https://github.com/Laratypes/Laratype/issues/102)).
- App khởi động từ manifest lúc build thay vì quét file system lúc chạy ([#125](https://github.com/Laratypes/Laratype/issues/125)).
- `sauf dev` sẽ theo dõi `app/contracts/**` và sinh lại type cho frontend mà không cần khởi động lại ([#142](https://github.com/Laratypes/Laratype/issues/142), xem [Sinh type › Chế độ watch](./type-generation#che-đo-watch)).
- `--strict-contract` bật [chế độ strict contract](./controllers#che-đo-strict-contract) ([#157](https://github.com/Laratypes/Laratype/issues/157)).

Option nào của bản 0.5 được giữ lại ở v1 thì chưa được đặc tả: `--port`, `--host`, và `--hmr`, option này có trên `master` nhưng không có ở v0.5.4.

## sauf build <Status issue="128" />

`sauf build` biến ứng dụng thành bản bundle production trong `dist/`. Lệnh này kiểm tra type, bundle, xác nhận app khởi động được, sinh type và ghi entry cho nền tảng đích. Từng bước được mô tả ở [Build và triển khai](./build).

Các option đã được nêu tên:

| Option | Tác dụng | Issue |
|---|---|---|
| `--no-typecheck` | Bỏ qua bước `tsc --noEmit` | [#127](https://github.com/Laratypes/Laratype/issues/127) |
| `--platform node`, `--platform bun` | Ghi entry cho Node hoặc Bun | [#130](https://github.com/Laratypes/Laratype/issues/130) |
| `--platform vercel` | Ghi build output cho Vercel | [#173](https://github.com/Laratypes/Laratype/issues/173) |
| `--standalone` | Bundle luôn cả dependency | [#155](https://github.com/Laratypes/Laratype/issues/155) |

Ở v0.5.4, `sauf build` chỉ nhận `--platform node`. Script build của app chạy `tsc -b` trước, sau đó `sauf build` copy các file entry và chạy `tsc-alias`. v1 thay tất cả bằng một lệnh `sauf build`.

## sauf types:generate <Status issue="133" />

`sauf types:generate` ghi một file `api.ts` cho frontend nằm ngoài monorepo. `sauf build` chạy lệnh này như một trong các bước của nó. Xem [Sinh type](./type-generation).

## Các generator make:* <Status issue="134" />

Các lệnh `make:*` tạo file từ template. v0.5.4 có các generator sau:

`make:command`, `make:controller`, `make:factory`, `make:gate`, `make:middleware`, `make:model`, `make:policy`, `make:request`, `make:resource`, `make:seeder`

Với v1, [#134](https://github.com/Laratypes/Laratype/issues/134) dự kiến các thay đổi sau:

- thêm generator `make:contract`;
- template của controller, request và resource chuyển sang API v1: [controller](./controllers) có type từ `Ctx`, [FormRequest](./validation#formrequest) dựa trên contract, và [resource](./responses#resource) có type;
- các file sinh ra pass type-check trong app ví dụ.

Template nào có schema thì theo hai quy tắc từ phần contract ([#91](https://github.com/Laratypes/Laratype/issues/91), [#85](https://github.com/Laratypes/Laratype/issues/85)):

- Import zod bằng `import * as z from "zod"`. Với zod 4, `import { z } from "zod/v4"` làm bundle frontend lớn gấp khoảng ba lần (khoảng 47 KiB gzip thay vì 16 KiB). Với bundle frontend, `zod/v4-mini` còn nhỏ hơn nữa (khoảng 8.3 KiB).
- Viết `z.coerce.number<number>()`. Ở zod 4, `z.coerce.number()` không kèm type argument có type input là `unknown`, nên type phía client cũng thành `unknown`.

Số phận của các generator còn lại của bản 0.5 ở v1 chưa được đặc tả ([#134](https://github.com/Laratypes/Laratype/issues/134)). Generator cho các service của v1, như job, event, listener và mailable, cũng chưa được đặc tả.
