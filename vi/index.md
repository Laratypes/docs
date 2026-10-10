---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Laratype"
  text: "REST API có type, bắt đầu từ contract"
  tagline: Cách viết quen thuộc của Laravel, thêm DI container và type đi suốt từ contract tới client frontend.
  image:
    src: /assets/logo.png
    alt: Laratype Logo
  actions:
    - theme: brand
      text: Đọc hướng dẫn v1
      link: /vi/guide/
    - theme: alt
      text: Tài liệu 0.5.4 (npm)
      link: /vi/v0.5/

features:
  - title: Mỗi endpoint một contract
    details: Cùng một object dùng cho validation, type của handler, client có type phía frontend và OpenAPI.
  - title: Inject qua constructor
    details: Class nhận dependency qua constructor, không bắt buộc decorator.
  - title: Quen thuộc như Laravel
    details: File route, FormRequest, Resource, Policy, facade và các lệnh sauf make.
---
