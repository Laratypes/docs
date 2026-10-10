---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Laratype"
  text: "Type-safe REST APIs, contract first"
  tagline: Laravel's ergonomics with a DI container and types carried from the route to the frontend client.
  image:
    src: /assets/logo.png
    alt: Laratype Logo
  actions:
    - theme: brand
      text: Read the v1 guide
      link: /guide/
    - theme: alt
      text: 0.5.4 docs (npm)
      link: /v0.5/

features:
  - title: One contract per endpoint
    details: The same object drives validation, handler types, the typed frontend client and OpenAPI.
  - title: Constructor injection
    details: Classes get their dependencies through the constructor. Decorators are not required.
  - title: Familiar from Laravel
    details: Route files, FormRequest, Resources, Policies, facades and sauf make commands.
---
