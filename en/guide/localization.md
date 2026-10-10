# Localization

`@laratype/i18n` will translate the application's text ([#167](https://github.com/Laratypes/Laratype/issues/167)). In 0.5 the package contains only a `package.json`, but the 0.5 app config already has `locale` and `fallback_locale`.

## Translation files <Status issue="167" />

Translations live in `lang/{locale}/*.ts`, with typed keys. The build manifest discovers them (see [Build › The build manifest](./build#the-build-manifest)).

Where `lang/` sits in the project layout is not specified yet.

## Looking up translations <Status issue="167" />

`__()` and `trans()` look up a translation. The key and the placeholder params are inferred: a translation such as `"Hello {name}"` gives the params the type `{ name: string }`. How the arguments are passed is not specified yet.

Missing translations fall back to the locale in `config.fallback_locale`. Plurals use `Intl.PluralRules`.

## The current locale <Status issue="167" />

A locale middleware picks the locale from the Accept-Language header, the query string or the user's preference. The locale is stored per request (see [Dependency injection › Request scope](./dependency-injection#request-scope)).

## Validation messages <Status issue="167" />

The package provides default localized messages for Standard Schema issues. [FormRequest](./validation#formrequest) uses them.

## Frontend export <Status issue="167" />

Each locale can optionally be exported as JSON for the frontend.
