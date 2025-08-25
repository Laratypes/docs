import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Laratype",
  description: "A Laratype document site",
  rewrites: {
    'vi/:rest*': ':rest*'
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        base: '/introduction/',
        items: [
          { text: 'Quicks Start', link: 'quick-start' },
          { text: 'Project Structure', link: 'project-structure' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Laratypes/Laratype' }
    ]
  },
  locales: {
    root: {
      lang: 'vi-VN',
      label: 'Tiếng Việt',
      link: '/'
    },
    vi: {
      lang: 'en-US',
      label: 'English',
      link: '/en'
    }
  }
})
