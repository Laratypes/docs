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

Laratype xây dựng cấu trúc dựa trên cấu trúc dự án của [Laravel](https://laravel.com/docs/12.x/structure) với các thư mục chính như sau:

- [`app/`](#app): Chứa mã nguồn của ứng dụng.
- [`dist/`](#dist): Chứa các tệp đã được build để triển khai trên môi trường production.
- [`storage/`](#storage): Chứa các tệp lưu trữ như logs, cache, v.v.

### /app {#app}
`app` là thư mục chứa mã nguồn của ứng dụng.

#### ./config {#config}
`config` là thư mục chứa các tệp cấu hình cho ứng dụng, cho phép tùy chỉnh các thiết lập như kết nối cơ sở dữ liệu, thông tin API, và các tham số khác.

#### ./database {#database}
`database` là thư mục chứa các tệp cơ sở dữ liệu, bao gồm các migration, seeders, và các tệp khác liên quan đến cơ sở dữ liệu.

#### ./declare {#declare}
`declare` là thư mục chứa các khai báo kiểu TypeScript tùy chỉnh cho ứng dụng.

#### ./routes {#routes}
`routes` là thư mục chứa các tệp định nghĩa route cho ứng dụng, cho phép xác định các URL và hành động tương ứng.

#### ./console
`console` là thư mục chứa các lệnh khởi chạy tùy chỉnh cho ứng dụng. ([The Console Directory](https://laravel.com/docs/12.x/structure#the-console-directory))

#### ./src {#src}
`src` là thư mục chính chứa mã nguồn ứng dụng, nơi mà business logic được triển khai, bao gồm các thành phần như models, controllers, middleware, và providers,...

### /dist {#dist}

`dist` là thư mục chứa các tệp đã được build để triển khai trên môi trường production. Thư mục này thường được tạo ra sau khi chạy lệnh build và không nên chỉnh sửa trực tiếp.

### /storage {#storage}

`storage` là thư mục chứa các tệp lưu trữ như logs, cache, và các tệp tạm thời khác. Thư mục này giúp quản lý dữ liệu ứng dụng một cách hiệu quả và an toàn.

