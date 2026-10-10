---
 outline: deep
---

# Cấu trúc dự án

## Tổng quan

```md
.
├───.vscode
├───app
│   ├───config
│   ├───database
│   │   ├───factories
│   │   └───seeders
│   ├───declare
│   ├───routes
│   └───src
│       ├───console
│       │   └───commands
│       ├───http
│       │   ├───controllers
│       │   ├───middleware
│       │   ├───requests
│       │   └───resources
│       ├───models
│       └───providers
├───dist
└───storage
    └───logs
```

## Chi tiết

Cấu trúc thư mục của Laratype dựa theo [cấu trúc dự án của Laravel](https://laravel.com/docs/12.x/structure). Ở cấp cao nhất có ba thư mục:

- [`app/`](#app): mã nguồn của ứng dụng.
- [`dist/`](#dist): bản build để triển khai lên production.
- [`storage/`](#storage): dữ liệu lưu trữ như log và cache.

### /app {#app}
`app` chứa mã nguồn của ứng dụng.

#### ./config {#config}
`config` chứa các file cấu hình: kết nối cơ sở dữ liệu, thông tin API và các tham số khác.

#### ./database {#database}
`database` chứa migration, seeder và các file khác liên quan đến cơ sở dữ liệu.

#### ./declare {#declare}
`declare` chứa các khai báo kiểu TypeScript riêng của ứng dụng.

#### ./routes {#routes}
`routes` chứa các file định nghĩa route, tức là URL nào gọi tới hành động nào.

#### ./console
`console` chứa các lệnh dòng lệnh do bạn tự viết cho ứng dụng. ([The Console Directory](https://laravel.com/docs/12.x/structure#the-console-directory))

#### ./src {#src}
`src` chứa business logic của ứng dụng: models, controllers, middleware, providers và các thành phần khác.

### /dist {#dist}

`dist` chứa bản build để triển khai lên production. Lệnh build tạo ra thư mục này, nên bạn không sửa trực tiếp các file trong đó.

### /storage {#storage}

`storage` chứa log, cache và các file tạm khác của ứng dụng.

