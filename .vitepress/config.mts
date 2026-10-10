import { defineConfig, UserConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { isNextPage, versionNav } from './versions'

// https://vitepress.dev/reference/site-config


export default defineConfig({
  title: "Laratype",
  description: "A Laratype document site",
  rewrites: {
    'en/:rest*': ':rest*'
  },
  // Repo docs and synced code snippets are not pages
  srcExclude: ['AGENTS.md', 'snippets/**'],
  // v1 "next" pages stay out of search engines and the Algolia crawler (#210)
  transformHead({ pageData }) {
    if (isNextPage(pageData.relativePath)) {
      return [['meta', { name: 'robots', content: 'noindex' }]]
    }
  },
  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        href: '/assets/logo.png'
      }
    ]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    editLink: {
      pattern: 'https://github.com/Laratypes/docs/edit/main/:path',
      text: 'Edit this page on GitHub'
    },
    logo: '/assets/logo.png',
    sidebar: {
      // v1 "next" section (#210). DOC6 (#211) adds groups as pages land.
      '/next/': [
        { text: 'Overview', link: '/next/' },
      ],
      '/getting-started/': [
        {
          text: 'Introduction',
          base: '/getting-started/introduction/',
          items: [
            { text: 'Quick Start', link: 'quick-start' },
            { text: 'Project Structure', link: 'project-structure' }
          ]
        },
        {
          text: 'Essentials',
          items: [
            {
              text: 'Http',
              base: '/getting-started/essentials/http/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Routing', link: 'routing' },
                { text: 'Middleware', link: 'middleware' },
                { text: 'Request', link: 'request' },
                { text: 'Controller', link: 'controller' },
              ]
            },
            {
              text: 'Security',
              base: '/getting-started/essentials/security/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Authentication', link: 'authentication' },
                { text: 'Authorization', link: 'authorization' },
              ]
            },
            {
              text: 'Database',
              base: '/getting-started/essentials/database/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Model', link: 'model' },
                { text: 'Seeding', link: 'seeding' },
                { text: 'Factory', link: 'factory' },
              ],
            },
            {
              text: 'Console',
              base: '/getting-started/essentials/console/',
              collapsed: true,
              items: [
                { text: 'Commands', link: 'commands' },
              ]
            },
            {
              text: 'Other',
              base: '/getting-started/essentials/other/',
              collapsed: true,
              items: [
                { text: 'Service Providers', link: 'providers' },
              ]
            }
          ]
        },
        {
          text: 'Sauf',
          base: '/getting-started/sauf/',
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Core Commands', link: 'core' },
            { text: 'Generating Commands', link: 'generating' },
          ]
        },
        {
          text: 'Deployment',
          base: '/getting-started/deployment/',
          items: [
            { text: 'Building the application', link: 'build' },
            { text: 'Using Docker', link: 'docker' },
            { text: 'Deploy to EDGE', link: 'edge' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'Overview',
          link: '/api/introduction',
        },
        {
          text: 'API Reference',
          base: '/api/api-reference',
          items: [
            {
              text: '@laratype/http',
              base: '/api/api-reference/http/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Routing', link: 'routing' },
                { text: 'Middleware', link: 'middleware' },
                { text: 'Request', link: 'request' },
                { text: 'Response', link: 'response' },
                { text: 'Controllers', link: 'controllers' },
              ]
            },
          ]
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Laratypes/Laratype' }
    ],
    search: {
      provider: 'algolia',
      options: {
        appId: process.env.ALGOLIA_APP_ID || '',
        apiKey: process.env.ALGOLIA_API_KEY || '',
        indexName: 'Laratype Documentation',
      },
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/introduction/quick-start' },
      { text: 'API', link: '/api/introduction' },
      versionNav('en'),
    ]
  },
  locales: {
    root: {
      lang: 'en-US',
      label: 'English',
      link: '/',
    },
    vi: {
      lang: 'vi-VN',
      label: 'Tiếng Việt',
      link: '/vi',
    },
  },
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    }
  },
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          'bunx': 'vscode-icons:file-type-bun',
          'pnpx': 'vscode-icons:file-type-pnpm',
          'npx': 'vscode-icons:file-type-npm',
        }
      })
    ]
  }
})
