import { defineAdditionalConfig } from "vitepress";

export default defineAdditionalConfig({
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/vi/getting-started/introduction/quick-start' },
      { text: 'API', link: '/vi/api/introduction' },
      { text: 'v0.5.3', link: 'https://github.com/Laratypes/Laratype' },
    ],
    sidebar: {
      '/vi/getting-started/': [
        {
          text: 'Introduction',
          base: '/vi/getting-started/introduction/',
          items: [
            { text: 'Quicks Start', link: 'quick-start' },
            { text: 'Project Structure', link: 'project-structure' }
          ]
        },
        {
          text: 'Essentials',
          items: [
            {
              text: 'Http',
              base: '/vi/getting-started/essentials/http/',
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
              base: '/vi/getting-started/essentials/security/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Authentication', link: 'authentication' },
                { text: 'Authorization', link: 'authorization' },
              ]
            },
            {
              text: 'Database',
              base: '/vi/getting-started/essentials/database/',
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
              base: '/vi/getting-started/essentials/console/',
              collapsed: true,
              items: [
                { text: 'Commands', link: 'commands' },
              ]
            },
            {
              text: 'Other',
              base: '/vi/getting-started/essentials/other/',
              collapsed: true,
              items: [
                { text: 'Service Providers', link: 'providers' },
              ]
            }
          ]
        },
        {
          text: 'Sauf',
          base: '/vi/getting-started/sauf/',
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Core Commands', link: 'core' },
            { text: 'Generating Commands', link: 'generating' },
          ]
        },
        {
          text: 'Deployment',
          base: '/vi/getting-started/deployment/',
          items: [
            { text: 'Building the application', link: 'build' },
            { text: 'Using Docker', link: 'docker' },
            { text: 'Deploy to EDGE', link: 'edge' },
          ]
        }
      ],
      '/vi/api/': [
        {
          text: 'Overview',
          link: '/vi/api/introduction',
        },
        {
          text: 'API Reference',
          base: '/vi/api/api-reference',
          items: [
            {
              text: '@laratype/auth (coming soon)',
              base: '/vi/api/api-reference/auth/',
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
              base: '/vi/api/api-reference/console/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Getting Started', link: 'getting-started' },
              ]
            },
            {
              text: '@laratype/database (coming soon)',
              base: '/vi/api/api-reference/database/',
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
              base: '/vi/api/api-reference/http/',
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
              base: '/vi/api/api-reference/log/',
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
              base: '/vi/api/api-reference/support/',
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
  }
});