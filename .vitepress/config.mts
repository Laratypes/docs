import { defineConfig, UserConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

// https://vitepress.dev/reference/site-config


export default defineConfig({
  title: "Laratype",
  description: "A Laratype document site",
  rewrites: {
    'en/:rest*': ':rest*'
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
      '/getting-started/': [
        {
          text: 'Introduction',
          base: '/getting-started/introduction/',
          items: [
            { text: 'Quicks Start', link: 'quick-start' },
            { text: 'Project Structure', link: 'project-structure' }
          ]
        },
        {
          text: 'Essentials',
          base: '/essentials/',
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
              text: '@laratype/auth (coming soon)',
              base: '/auth/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Getting Started', link: 'getting-started' },
                { text: 'Configuration', link: 'configuration' },
                { text: 'Authentication', link: 'authentication' },
                { text: 'Authorization', link: 'authorization' },
                { text: 'Password Hashing', link: 'password-hashing' },
                { text: 'Password Reset', link: 'password-reset' },
              ]
            },
            {
              text: '@laratype/console (coming soon)',
              base: '/console/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Getting Started', link: 'getting-started' },
              ]
            },
            {
              text: '@laratype/database (coming soon)',
              base: '/database/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Getting Started', link: 'getting-started' },
                { text: 'Configuration', link: 'configuration' },
                { text: 'Query Builder', link: 'query-builder' },
                { text: 'Eloquent ORM', link: 'eloquent' },
                { text: 'Migrations', link: 'migrations' },
                { text: 'Seeding', link: 'seeding' },
              ]
            },
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
            {
              text: '@laratype/log (coming soon)',
              base: '/log/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Getting Started', link: 'getting-started' },
                { text: 'Configuration', link: 'configuration' },
                { text: 'Usage', link: 'usage' },
              ]
            },
            {
              text: '@laratype/support (coming soon)',
              base: '/support/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Helpers', link: 'helpers' },
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
      { text: 'v0.5.4', link: 'https://github.com/Laratypes/Laratype' },
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
