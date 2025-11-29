---
 outline: deep
---

# Project Structure

## Overview

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

## Details

Laratype builds its structure based on the [Laravel](https://laravel.com/docs/12.x/structure) project structure with the following main directories:

- [`app/`](#app): Contains the application source code.
- [`dist/`](#dist): Contains built files for production deployment.
- [`storage/`](#storage): Contains storage files like logs, cache, etc.

### /app {#app}
`app` is the directory containing the application source code.

#### ./config {#config}
`config` is the directory containing configuration files for the application, allowing you to customize settings such as database connections, API information, and other parameters.

#### ./database {#database}
`database` is the directory containing database files, including migrations, seeders, and other database-related files.

#### ./declare {#declare}
`declare` is the directory containing custom TypeScript declarations for the application.

#### ./routes {#routes}
`routes` is the directory containing route definition files for the application, allowing you to define URLs and corresponding actions.

#### ./console
`console` is the directory containing custom startup commands for the application. ([The Console Directory](https://laravel.com/docs/12.x/structure#the-console-directory))

#### ./src {#src}
`src` is the main directory containing the application source code, where business logic is implemented, including components such as models, controllers, middleware, and providers.

### /dist {#dist}

`dist` is the directory containing built files for production deployment. This directory is typically created after running the build command and should not be edited directly.

### /storage {#storage}

`storage` is the directory containing storage files such as logs, cache, and other temporary files. This directory helps manage application data efficiently and securely.
