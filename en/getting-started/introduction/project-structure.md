# Project Structure

## Overview

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

## Details

Laratype is based on the [Laravel](https://laravel.com/docs/12.x/structure) project structure with the following main directories:

- [`src/`](#src): Contains the application source code ([Laravel app directory](https://laravel.com/docs/12.x/structure#the-root-app-directory)).
- [`config/`](#config): Contains configuration files. ([Laravel config directory](https://laravel.com/docs/12.x/structure#the-config-directory))
- [`database/`](#database): Contains database files. ([Laravel database directory](https://laravel.com/docs/12.x/structure#the-database-directory))
- [`public/`](#public): Public directory containing static files. ([Laravel public directory](https://laravel.com/docs/12.x/structure#the-public-directory))
- [`routes/`](#routes): Contains route definition files. ([Laravel routes directory](https://laravel.com/docs/12.x/structure#the-routes-directory))
- [`storage/`](#storage): Contains storage files, including log files and other files. ([Laravel storage directory](https://laravel.com/docs/12.x/structure#the-storage-directory))


### 1. /src {#src}
`src` is the directory that contains the application source code, including components such as controllers, models, and views.

#### 1.1 ./console
`console` is the directory that contains custom startup commands for the application. ([The Console Directory](https://laravel.com/docs/12.x/structure#the-console-directory))

#### 1.2 ./http
`http` is the directory that contains HTTP-related components, including controllers, requests, and resources. ([The Http Directory](https://laravel.com/docs/12.x/structure#the-http-directory))

#### 1.3 ./providers
`providers` is the directory that contains the application's service providers. ([The Providers Directory](https://laravel.com/docs/12.x/structure#the-providers-directory))

### 2. /config {#config}
`config` is the directory that contains configuration files for the application, allowing you to customize settings such as database connections, API information, and other parameters. ([The Config Directory](https://laravel.com/docs/12.x/structure#the-config-directory))

### 3. /database {#database}
`database` is the directory that contains database files, including migrations, seeders, and other database-related files. ([The Database Directory](https://laravel.com/docs/12.x/structure#the-database-directory))

### 4. /public {#public}
`public` is the public directory containing static files such as images, CSS, and JavaScript. This is where users can access the application's static resources. ([The Public Directory](https://laravel.com/docs/12.x/structure#the-public-directory))

### 5. /routes {#routes}
`routes` is the directory that contains route definition files for the application, allowing you to define URLs and corresponding actions. ([The Routes Directory](https://laravel.com/docs/12.x/structure#the-routes-directory))
