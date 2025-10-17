import { defineConfig, UserConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config


export default defineConfig({
  title: "Laratype",
  description: "A Laratype document site",
  rewrites: {
    'vi/:rest*': ':rest*'
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config

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
              items: [
                { text: 'Middleware', link: 'middleware' },
                { text: 'Request', link: 'request' },
                { text: 'Controller', link: 'controller' },
                { text: 'Model', link: 'model' },
              ]
            },
            {
              text: 'Console',
              base: '/getting-started/essentials/console/',
              items: [
                { text: 'Commands', link: 'commands' },
              ]
            },
            {
              text: 'Other',
              base: '/getting-started/essentials/other/',
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
      '/en/getting-started/': [
        {
          text: 'Introduction',
          base: '/en/getting-started/introduction/',
          items: [
            { text: 'Quicks Start', link: 'quick-start' },
            { text: 'Project Structure', link: 'project-structure' }
          ]
        },
        {
          text: 'Essentials',
          base: '/en/getting-started/essentials/',
          items: [
            {
              text: 'Http',
              base: '/en/getting-started/essentials/http/',
              items: [
                { text: 'Middleware', link: 'middleware' },
                { text: 'Request', link: 'request' },
                { text: 'Controller', link: 'controller' },
                { text: 'Model', link: 'model' },
              ]
            },
            {
              text: 'Console',
              base: '/en/getting-started/essentials/console/',
              items: [
                { text: 'Commands', link: 'commands' },
              ]
            },
            {
              text: 'Other',
              base: '/en/getting-started/essentials/other/',
              items: [
                { text: 'Service Providers', link: 'providers' },
              ]
            }
          ]
        },
        {
          text: 'Sauf',
          base: '/en/getting-started/sauf/',
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Core Commands', link: 'core' },
            { text: 'Generating Commands', link: 'generating' },
          ]
        }
      ],
      '/en/api/': [
        {
          text: 'Overview',
          link: '/en/api/introduction',
        },
        {
          text: 'API Reference',
          base: '/en/api/api-reference',
          items: [
            {
              text: '@laratype/auth (coming soon)',
              base: '/en/auth/',
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
              base: '/en/api/api-reference/http/',
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
        indexName: 'laratype',
      },
    },
  },
  locales: {
    root: {
      lang: 'vi-VN',
      label: 'Tiếng Việt',
      link: '/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Getting Started', link: '/getting-started/introduction/quick-start' },
          { text: 'API', link: '/api/introduction' },
        ],
      }
    },
    en: {
      lang: 'en-US',
      label: 'English',
      link: '/en',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en' },
          { text: 'Getting Started', link: '/en/getting-started/introduction/quick-start' },
          { text: 'API', link: '/en/api/introduction' },
        ],
      }
    }
  }
})
