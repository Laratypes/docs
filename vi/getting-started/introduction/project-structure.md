# Cấu trúc dự án

## Tổng quan

```md
.
├───.vscode
├───config
├───database
├───public
├───routes
├───src
│   ├───console
│   │   └───commands
│   ├───http
│   │   ├───controllers
│   │   ├───requests
│   │   └───resources
│   └───providers
└───storage
    └───logs
```

## Chi tiết

Laratype dựa trên cấu trúc dự án của [Laravel](https://laravel.com/docs/12.x/structure) với các thư mục chính như sau:

- [`src/`](#src): Chứa mã nguồn của ứng dụng ([Laravel app directory](https://laravel.com/docs/12.x/structure#the-root-app-directory)).
- [`config/`](#config): Chứa các tệp cấu hình. ([Laravel config directory](https://laravel.com/docs/12.x/structure#the-config-directory))
- [`database/`](#database): Chứa các tệp cơ sở dữ liệu. ([Laravel database directory](https://laravel.com/docs/12.x/structure#the-database-directory))
- [`public/`](#public): Thư mục công khai, chứa các tệp tĩnh. ([Laravel public directory](https://laravel.com/docs/12.x/structure#the-public-directory))
- [`routes/`](#routes): Chứa các tệp định nghĩa route. ([Laravel routes directory](https://laravel.com/docs/12.x/structure#the-routes-directory))
- [`storage/`](#storage): Chứa các tệp lưu trữ, bao gồm các tệp nhật ký và các tệp khác. ([Laravel storage directory](https://laravel.com/docs/12.x/structure#the-storage-directory))


### 1. /src {#src}
`src` là thư mục chứa mã nguồn của ứng dụng, bao gồm các thành phần như controller, model, và view.

#### 1.1 ./console
`console` là thư mục chứa các lệnh khởi chạy tùy chỉnh cho ứng dụng. ([The Console Directory](https://laravel.com/docs/12.x/structure#the-console-directory))

#### 1.2 ./http
`http` là thư mục chứa các thành phần liên quan đến HTTP, bao gồm các controller, request, và resource. ([The Http Directory](https://laravel.com/docs/12.x/structure#the-http-directory))

#### 1.3 ./providers
`providers` là thư mục chứa các service provider của ứng dụng. ([The Providers Directory](https://laravel.com/docs/12.x/structure#the-providers-directory))

### 2. /config {#config}
`config` là thư mục chứa các tệp cấu hình cho ứng dụng, cho phép tùy chỉnh các thiết lập như kết nối cơ sở dữ liệu, thông tin API, và các tham số khác. ([The Config Directory](https://laravel.com/docs/12.x/structure#the-config-directory))

### 3. /database {#database}
`database` là thư mục chứa các tệp cơ sở dữ liệu, bao gồm các migration, seeders, và các tệp khác liên quan đến cơ sở dữ liệu. ([The Database Directory](https://laravel.com/docs/12.x/structure#the-database-directory))

### 4. /public {#public}
`public` là thư mục công khai, chứa các tệp tĩnh như hình ảnh, CSS, và JavaScript. Đây là nơi mà người dùng có thể truy cập các tài nguyên tĩnh của ứng dụng. ([The Public Directory](https://laravel.com/docs/12.x/structure#the-public-directory))

### 5. /routes {#routes}
`routes` là thư mục chứa các tệp định nghĩa route cho ứng dụng, cho phép xác định các URL và hành động tương ứng. ([The Routes Directory](https://laravel.com/docs/12.x/structure#the-routes-directory))