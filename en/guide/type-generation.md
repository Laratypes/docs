# Type generation

A frontend in the same repository imports the API object and gets its types from the contracts directly (see [Client](./client)). A frontend in another repository can't import server files, so `sauf` generates its types into a file the frontend can use. The same route data also produces an OpenAPI document and feeds Detective, the devtools UI.

All of it is planned. The [typegen spec](https://github.com/Laratypes/Laratype/blob/master/docs/v1/typegen.md) is a skeleton with short design notes, decided in the S2 spike ([#85](https://github.com/Laratypes/Laratype/issues/85)). In v0.5.4, the `@laratype/ts-gen` package is empty.

## sauf types:generate <Status issue="133" />

```sh
npx sauf types:generate
```

The command writes one file, `api.ts`, with two things in it:

- a flattened `AppApi` type alias, with the same shape as the types the client reads from the [API object](./contracts#api-types);
- a slim runtime manifest: the method, the path and the declared error codes of each endpoint.

The file holds no contract library and no schema library, so the frontend bundle stays small. In the S2 measurements a frontend built on it was about 0.7 KiB gzip.

- The generator uses only the TypeScript type checker. It never runs your contract modules.
- The generated types may be `interface` declarations. The client accepts them.
- `sauf build` runs this command as one of its [steps](./build#generating-types).
- A frontend in the monorepo can use the same file instead of the API object, to keep schemas out of its bundle.

It is done when a separate frontend project compiles with only the generated files. Where `api.ts` is written, and how the frontend passes it to the client, are not specified yet.

## Watch mode <Status issue="142" />

`sauf dev` will watch `app/contracts/**` and write updated types to `.laratype/types/` when a contract changes. A frontend in the monorepo then sees new endpoints without restarting the dev server.

## OpenAPI <Status issue="143" />

`openapi.json` is generated from the [route registry](./routing#route-registry). Each schema of a contract is converted to JSON Schema.

- [Ad-hoc routes](./routing#ad-hoc-routes) have no contract, so they are left out.
- The document must pass `redocly lint`.

This is for consumers that don't use TypeScript, and for Detective.

## Detective <Status issue="144" />

Detective is the devtools UI for a Laratype app. It will read `openapi.json` and the route registry, so it can show the controller, the middleware and the schemas of each route.

The same issue fixes the route manifest, where the controller currently shows as `null`.
