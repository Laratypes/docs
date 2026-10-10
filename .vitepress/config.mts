import { defineConfig, UserConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { versionNav } from './versions'

// https://vitepress.dev/reference/site-config


export default defineConfig({
  title: "Laratype",
  description: "A Laratype document site",
  rewrites: {
    'en/:rest*': ':rest*'
  },
  // Repo docs are not pages
  srcExclude: ['AGENTS.md'],
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
      // v1 guide (#210). DOC6 (#211) adds groups as pages land.
      '/guide/': [
        {
          text: 'Getting Started',
          base: '/guide/',
          items: [
            { text: 'Overview', link: '' },
            { text: 'Introduction', link: 'introduction' },
            { text: 'Your First Endpoint', link: 'first-endpoint' },
          ]
        },
        {
          text: 'Core Concepts',
          base: '/guide/',
          items: [
            { text: 'Contracts', link: 'contracts' },
            { text: 'Dependency Injection', link: 'dependency-injection' },
            { text: 'Service Providers', link: 'service-providers' },
            { text: 'Configuration', link: 'configuration' },
          ]
        },
        {
          text: 'HTTP',
          base: '/guide/',
          items: [
            { text: 'Routing', link: 'routing' },
            { text: 'Controllers', link: 'controllers' },
            { text: 'Model Binding', link: 'model-binding' },
            { text: 'Middleware', link: 'middleware' },
            { text: 'Validation', link: 'validation' },
          ]
        },
      ],
      '/v0.5/getting-started/': [
        {
          text: 'Introduction',
          base: '/v0.5/getting-started/introduction/',
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
              base: '/v0.5/getting-started/essentials/http/',
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
              base: '/v0.5/getting-started/essentials/security/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Authentication', link: 'authentication' },
                { text: 'Authorization', link: 'authorization' },
              ]
            },
            {
              text: 'Database',
              base: '/v0.5/getting-started/essentials/database/',
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
              base: '/v0.5/getting-started/essentials/console/',
              collapsed: true,
              items: [
                { text: 'Commands', link: 'commands' },
              ]
            },
            {
              text: 'Other',
              base: '/v0.5/getting-started/essentials/other/',
              collapsed: true,
              items: [
                { text: 'Service Providers', link: 'providers' },
              ]
            }
          ]
        },
        {
          text: 'Sauf',
          base: '/v0.5/getting-started/sauf/',
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Core Commands', link: 'core' },
            { text: 'Generating Commands', link: 'generating' },
          ]
        },
        {
          text: 'Deployment',
          base: '/v0.5/getting-started/deployment/',
          items: [
            { text: 'Building the application', link: 'build' },
            { text: 'Using Docker', link: 'docker' },
            { text: 'Deploy to EDGE', link: 'edge' },
          ]
        }
      ],
      '/v0.5/api/': [
        {
          text: 'Overview',
          link: '/v0.5/api/introduction',
        },
        {
          text: 'API Reference',
          base: '/v0.5/api/api-reference',
          items: [
            {
              text: '@laratype/http',
              base: '/v0.5/api/api-reference/http/',
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
      { text: 'Guide', link: '/guide/' },
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
