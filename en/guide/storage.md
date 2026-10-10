# Storage

`@laratype/storage` will give one API over local and cloud file storage ([#168](https://github.com/Laratypes/Laratype/issues/168)). In 0.5 the package contains only a `package.json`.

## Disks <Status issue="168" />

The planned disks are local and s3. The s3 disk uses `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`, and it accepts a custom endpoint, so it also works with Cloudflare R2 and MinIO.

Storage is built on the [driver manager](./services#the-driver-manager), and it is configured by a typed `app/config/filesystems.ts` (see [Configuration](./configuration)).

## Operations <Status issue="168" />

A disk will offer `put`, `get`, `stream`, `delete`, `exists`, `url`, `temporaryUrl`, `copy` and `move`. The parameters of these operations are not specified yet.

## Uploaded files <Status issue="168" />

`UploadedFile.store()` will store a multipart upload that the request pipeline has parsed (see [Middleware › Pipeline order](./middleware#pipeline-order)). `UploadedFile` itself is not specified in the request pipeline yet ([#106](https://github.com/Laratypes/Laratype/issues/106)).

## Testing and the CLI <Status issue="168" />

`Storage.fake()` replaces the disks in tests. #168 also names a `sauf storage:link` command but doesn't describe it.
