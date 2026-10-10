# Mail

`@laratype/mail` will send email through mailable classes ([#170](https://github.com/Laratypes/Laratype/issues/170)). In 0.5 the package contains only a `package.json`.

## Mailables <Status issue="170" />

A `Mailable` class describes one email:

- an envelope;
- the content: HTML written with `hono/jsx` and rendered to a string, plus a text version;
- attachments, which will come from [storage](./storage) once it exists.

Mailables are created by the container, so they get constructor injection. How a mailable declares its envelope, content and attachments is not specified yet.

## Sending mail <Status issue="170" />

`Mail.to(user).send(mailable)` sends a mailable. `.queue()` sends it through the [queue](./queues) instead.

## Transports <Status issue="170" />

The planned transports are smtp (through `nodemailer`), ses (through `@aws-sdk/client-sesv2`), log and array. Mail is built on the [driver manager](./services#the-driver-manager).

The mailer is bound in the container with a `MAILER` token (see [Dependency injection › Tokens](./dependency-injection#tokens)), and it is configured by a typed `app/config/mail.ts` (see [Configuration](./configuration)).

## Testing <Status issue="170" />

`Mail.fake()` replaces the mailer in tests. `assertSent` and `assertQueued` check which mailables were sent or queued. Their arguments are not specified yet.
