// Version switcher for the v1 "next" section (Laratypes/Laratype#210).
// The /next/ and /vi/next/ routes always exist (noindex), but nothing links to them
// until DOC6 (#211) ships the first real v1 page. DOC6 flips this flag to true.
export const SHOW_V1_NEXT = false

const GITHUB = 'https://github.com/Laratypes/Laratype'

export const versionNav = (locale: 'en' | 'vi') => {
  if (!SHOW_V1_NEXT) {
    return { text: 'v0.5.4', link: GITHUB }
  }
  return locale === 'en'
    ? {
        text: 'v0.5.4',
        items: [
          { text: 'v0.5.4 (current)', link: '/' },
          { text: 'v1 (next, unreleased)', link: '/next/' },
        ],
      }
    : {
        text: 'v0.5.4',
        items: [
          { text: 'v0.5.4 (hiện tại)', link: '/vi/' },
          { text: 'v1 (next, chưa phát hành)', link: '/vi/next/' },
        ],
      }
}

/** Pages under the v1 "next" section (source paths, before rewrites). */
export const isNextPage = (relativePath: string) =>
  /^(en\/|vi\/)?next\//.test(relativePath.replace(/\\/g, '/'))
