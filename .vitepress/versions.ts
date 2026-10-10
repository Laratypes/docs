// Version dropdown (#210). v1 (in development) lives at / and /vi/; the 0.5.4 archive at /v0.5/ and /vi/v0.5/.
export const versionNav = (locale: 'en' | 'vi') =>
  locale === 'en'
    ? {
        text: 'v1 (in development)',
        items: [
          { text: 'v1 (in development)', link: '/' },
          { text: 'v0.5.4', link: '/v0.5/' },
        ],
      }
    : {
        text: 'v1 (đang phát triển)',
        items: [
          { text: 'v1 (đang phát triển)', link: '/vi/' },
          { text: 'v0.5.4', link: '/vi/v0.5/' },
        ],
      }

/** Routes of the 0.5.4 archive (after rewrites): /v0.5/... and /vi/v0.5/... */
export const isV05Path = (path: string) => /^\/(vi\/)?v0\.5(\/|$)/.test(path)
