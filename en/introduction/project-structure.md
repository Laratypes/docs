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

Laratype is based on the project structure of [Laravel](https://laravel.com/docs/12.x/structure) with the following main directories:

- [`src/`](#src): Contains the application's source code ([Laravel app directory](https://laravel.com/docs/12.x/structure#the-root-app-directory)).
- [`config/`](#config): Contains configuration files. ([Laravel config directory](https://laravel.com/docs/12.x/structure#the-config-directory))
- [`database/`](#database): Contains database files. ([Laravel database directory](https://laravel.com/docs/12.x/structure#the-database-directory))
- [`public/`](#public): Public directory, contains static files. ([Laravel public directory](https://laravel.com/docs/12.x/structure#the-public-directory))
- [`routes/`](#routes): Contains route definition files. ([Laravel routes directory](https://laravel.com/docs/12.x/structure#the-routes-directory))


### 1. /src {#src}
`src` is the directory containing the application's source code, including components such as controllers, models, and views.

#### ./console
`console` is the directory containing custom commands for the application. ([The Console Directory](https://laravel.com/docs/12.x/structure#the-console-directory))

#### ./http
`http` is the directory containing HTTP-related components, including controllers, requests, and resources. ([The Http Directory](https://laravel.com/docs/12.x/structure#the-http-directory))

### 2. /config {#config}
`config` is the directory containing configuration files for the application, allowing customization of settings such as database connections, API information, and other parameters. ([The Config Directory](https://laravel.com/docs/12.x/structure#the-config-directory))

### 3. /database {#database}
`database` is the directory containing database files, including migrations, seeders, and other files related to the database. ([The Database Directory](https://laravel.com/docs/12.x/structure#the-database-directory))

### 4. /public {#public}
`public` is the public directory, containing static files such as images, CSS, and JavaScript. This is where users can access the application's static assets. ([The Public Directory](https://laravel.com/docs/12.x/structure#the-public-directory))

### 5. /routes {#routes}
`routes` is the directory containing route definition files for the application, allowing you to define URLs and corresponding actions. ([The Routes Directory](https://laravel.com/docs/12.x/structure#the-routes-directory))