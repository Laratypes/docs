# Dependency injection

Trong ứng dụng v1, class nhận dependency qua constructor và không bắt buộc decorator. Một bước build ghi lại type tham số của mọi constructor. Lúc chạy, container đọc bản ghi đó và tạo class: class cụ thể được tạo khi cần, còn interface và kiểu nguyên thuỷ được gắn với token có type.

```ts
export class UserService {
  constructor(readonly users: UserRepository, readonly mailer: Mailer) {}
}
```

Ở đây `UserRepository` là class nên container tự tạo được mà không cần cấu hình. `Mailer` là interface, không có giá trị lúc chạy, nên cần một token và một binding.

Container nằm trong `@laratype/core`, còn transform lúc build nằm trong `sauf`. Trên `master`, `@laratype/core` mới chỉ là khung rỗng: mọi thứ trong trang này đang nằm ở các pull request chưa merge.

## Token <Status issue="96" pr="196" />

Token là key có type cho một giá trị không có class lúc chạy, như interface, kiểu nguyên thuỷ hay object cấu hình:

```ts
export interface Mailer { send(to: string, body: string): Promise<void> }
export const MAILER = token<Mailer>('mailer')
```

`container.make(MAILER)` trả về `Mailer`. Token được so sánh theo object chứ không theo tên, nên hai lần gọi `token('x')` cho ra hai key khác nhau. Container không nhận chuỗi hay symbol làm key.

## Container <Status issue="96" pr="196" />

| Method | Tác dụng |
|---|---|
| `bind(token, concrete?, { scope }?)` | Gắn token với class hoặc factory. Mặc định là transient, trừ khi bạn truyền `{ scope: 'singleton' }`. |
| `singleton(token, concrete?)` | Gắn và giữ lại instance đầu tiên. |
| `transient(token, concrete?)` | Gắn và tạo instance mới ở mỗi lần `make()`. |
| `instance(token, value)` | Gắn một giá trị có sẵn. |
| `make(token)` | Resolve một token hoặc một class. |
| `has(token)` | Có binding tường minh hay không, tìm cả ở container cha. |
| `createChild()` | Tạo container con. |

Concrete là một class hoặc một factory `(container) => value`. Class được gắn mà không có concrete thì gắn với chính nó, như `app.singleton(Clock)`. Token và abstract class không gắn với chính nó được.

`make()` resolve theo thứ tự:

1. Tìm binding ở container hiện tại, rồi lần lượt ở từng container cha.
2. Nếu không có và key là class, container tự tạo class đó (autowire). Class autowire hiện là transient.
3. Nếu không, nó ném lỗi.

**Singleton** được tạo bởi container sở hữu binding, nên binding ghi đè ở container con không bao giờ lọt vào instance dùng chung. Gắn lại một token sẽ thay luôn instance đã lưu.

**Container con** thấy binding của cha, và binding riêng của nó che binding của cha mà không thay đổi cha. Điều này tiện khi viết test:

```ts
const testApp = app.createChild()
testApp.instance(MAILER, { send: async () => {} })
```

**Scope.** Container hiện có hai scope là `transient` và `singleton`. Scope thứ ba, `request`, đang được lên kế hoạch (xem [Request scope](#request-scope)).

**Vòng phụ thuộc** được phát hiện trên toàn bộ cây container, kể cả factory. Khi có vòng, container ném `Circular dependency: A -> B -> A` và vẫn hoạt động bình thường cho các lần gọi sau.

Container không hỗ trợ factory async.

### Lỗi

Khi resolve thất bại, container ném `DiError` với một trong các thông báo sau:

| Thông báo | Nguyên nhân thường gặp |
|---|---|
| `No binding for InjectionToken(mailer).` | Token chưa bao giờ được gắn. |
| `Cannot bind InjectionToken(x) to itself: only a class can be self-bound.` | Gọi `bind(token)` mà không có concrete. |
| `Cannot autowire UserService: its constructor takes 2 param(s) but no dependency metadata was found.` | Class chưa đi qua DI transform. |
| ``Cannot resolve UserService constructor param #1 `mailer`: type `Mailer` has no runtime value.`` | Tham số là interface hoặc kiểu nguyên thuỷ mà không có token. |
| ``Cannot resolve UserService constructor param #1 `mailer`: its type resolved to undefined at runtime.`` | Thường do một import vòng được thực thi quá sớm. |
| `Circular dependency: A -> B -> A` | Hai service phụ thuộc lẫn nhau. |

Thông báo kèm gợi ý cách sửa được lên kế hoạch ở [#100](https://github.com/Laratypes/Laratype/issues/100).

## Constructor injection hoạt động thế nào <Status issue="101" pr="194" />

DI transform chạy lúc build, trước SWC. Với mỗi class có constructor riêng, nó thêm một lời gọi sau class, liệt kê một mục cho mỗi tham số:

```ts
export class Notifier {
  constructor(@Inject(MAILER) private mailer: Mailer, public name: string, public clock: Clock = new Clock()) {}
}
__laratype_deps(Notifier, [() => MAILER, { unresolved: "string", index: 1 }, () => Clock],
  { params: ["mailer", "name", "clock"], optional: [2] });
```

Mỗi mục là một hàm trả về key, nên nó chỉ chạy khi class được resolve. Nhờ vậy import vòng giữa các module vẫn chạy mà không cần `forwardRef`.

Transform ghi lại gì cho từng kiểu tham số:

| Kiểu tham số | Được inject là |
|---|---|
| Class import như giá trị, hoặc khai báo trong file | chính class đó |
| `@Inject(TOKEN)` | token đó, bất kể type ghi gì |
| Class generic như `Repo<User>` | `Repo`. Tham số type bị xoá, nên `Repo<User>` và `Repo<Post>` dùng chung một key; hãy dùng token để tách chúng. |
| `Foo \| undefined`, `Foo \| null` | `Foo`, đánh dấu tuỳ chọn |
| Tên import bằng `import type`, interface, type alias, kiểu nguyên thuỷ, union, mảng, kiểu hàm hoặc không ghi type | không resolve được, nên container ném lỗi trừ khi tham số là tuỳ chọn |
| Global không có binding như `Date`, `Map` hay `Promise`, hoặc enum khai báo trong file | không resolve được, giống dòng trên. Chúng không được inject. |

Tham số là tuỳ chọn khi có `?`, có giá trị mặc định hoặc là union có null. Nếu transform không ghi được type lúc chạy cho một tham số tuỳ chọn, hoặc type đó là `undefined` lúc chạy, container truyền `undefined` và giá trị mặc định của JavaScript được dùng. Token hay class không resolve được thì vẫn ném lỗi, ví dụ `@Inject(TOKEN)` chưa có binding. Một class type resolve được thì vẫn được inject, nên giá trị mặc định của nó bị bỏ qua.

Class không có constructor riêng thì không có mục nào và dùng mục của class cha. Transform không bao giờ ném lỗi vì code của bạn; vấn đề sẽ hiện ra dưới dạng `DiError` khi class được resolve.

Transform chưa được gắn vào `sauf dev` và `sauf build`. Việc đó nằm ở [#102](https://github.com/Laratypes/Laratype/issues/102) cho dev server Vite và [#116](https://github.com/Laratypes/Laratype/issues/116) cho build bằng Bun. Xem [Build › Một chuỗi plugin](./build#mot-chuoi-plugin) và [Build › Plugin DI cho Bun](./build#plugin-di-cho-bun).

## Registry dependency <Status issue="97" pr="201" />

Lời gọi do transform sinh ra, `__laratype_deps`, lưu mục đó ngay trên class. `depsRegistry` là thứ container đọc, nên ứng dụng tạo container như sau:

```ts
const app = new Container({ deps: depsRegistry })
```

Registry đi ngược lên cây kế thừa. Class có mục riêng thì dùng mục đó. Với class bên thứ ba được compile kèm decorator metadata, nó dùng `design:paramtypes` khi `reflect-metadata` đã được nạp. Class không có cả hai thì dùng mục của class tổ tiên gần nhất.

Bạn không tự gọi `__laratype_deps`. Ví dụ dưới đây có lời gọi mà transform sinh ra cho `UserService`, để bạn thấy nó ghi lại những gì.

::: info Ví dụ minh hoạ
Container, token và registry đang được review trong PR [#196](https://github.com/Laratypes/Laratype/pull/196) và [#201](https://github.com/Laratypes/Laratype/pull/201).
:::

```ts
import { __laratype_deps, Container, DiError, depsRegistry, token } from '@laratype/core'

// Interfaces have no runtime value: bind them through a typed token.
export interface Mailer { send(to: string, body: string): Promise<void> }
export const MAILER = token<Mailer>('mailer')

export class SmtpMailer implements Mailer {
  async send(_to: string, _body: string) {}
}

export class UserRepository {
  find(id: number) { return { id } }
}

export class UserService {
  constructor(readonly users: UserRepository, readonly mailer: Mailer) {}
}
// The DI transform emits this call after the class. You don't write it.
// Mailer is an interface, so in app code `mailer` needs `@Inject(MAILER)` (see @Inject below); with it, the transform records `() => MAILER`.
__laratype_deps(UserService, [() => UserRepository, () => MAILER], { params: ['users', 'mailer'] })

// The container reads the emitted metadata through `depsRegistry`.
export const app = new Container({ deps: depsRegistry })
app.singleton(MAILER, () => new SmtpMailer())

const service = app.make(UserService) // UserService; UserRepository is autowired (no binding needed)
const mailer = app.make(MAILER) // Mailer

// Child containers shadow bindings without touching the parent (tests, per-request overrides).
export const testApp = app.createChild()
testApp.instance(MAILER, { send: async () => {} })

export function missingBinding() {
  try {
    new Container({ deps: depsRegistry }).make(UserService)
  } catch (e) {
    // DiError: No binding for InjectionToken(mailer).
    return e instanceof DiError ? e.message : String(e)
  }
}
```

## @Inject và @Injectable <Status issue="98" />

Hai decorator đang được lên kế hoạch cho `@laratype/core`:

- `@Inject(token)` đặt trên tham số constructor, cho interface, kiểu nguyên thuỷ và generic. Transform đã đọc được nó và inject token. Lúc chạy, decorator cũng sẽ ghi lại token, để container báo xung đột khi một decorator bọc ngoài che nó khỏi transform.
- `@Injectable({ scope })` đặt trên class, chỉ khi class cần scope khác mặc định.

Chữ ký của chúng sẽ được ghi lại khi [#98](https://github.com/Laratypes/Laratype/issues/98) được merge.

## Request scope <Status issue="112" />

Scope thứ ba, `request`, sẽ giữ một instance cho mỗi HTTP request và huỷ nó khi request kết thúc. Controller phụ thuộc vào service có scope request cũng sẽ thành scope request, và bạn nhận một cảnh báo khi chạy ở môi trường dev.

Issue này cũng chốt ba điểm còn mở: class autowire mặc định là transient hay singleton, `has()` có tính các class autowire được hay không, và một bước chặn lúc chạy khi resolve abstract class.

## Kiểm tra lúc khởi động <Status issue="113" />

Container sẽ kiểm tra được toàn bộ đồ thị dependency lúc khởi động: báo vòng phụ thuộc kèm chuỗi token, singleton phụ thuộc vào service có scope request, và binding không ai dùng. `sauf build` sẽ chạy bước kiểm tra này.

## Registry và facade <Status issue="114" />

Registry route, registry model binding và kết nối database sẽ chuyển từ biến toàn cục vào container. Sau đó một class `Facade` dựa trên container sẽ đứng sau `Auth`, `Log`, `Hash` và `Mail`, và test sẽ thay thế hoặc giả lập chúng qua container ([#115](https://github.com/Laratypes/Laratype/issues/115)).

## Inject vào method <Status issue="158" />

Method handler sẽ nhận được service sau tham số context, như `async store(ctx, mailer: Mailer)`, và method `handle()` của job cũng vậy. Constructor injection vẫn là cách chính.
