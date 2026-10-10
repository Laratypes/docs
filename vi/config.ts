import { defineAdditionalConfig } from "vitepress";
import { versionNav } from "../.vitepress/versions";

export default defineAdditionalConfig({
  themeConfig: {
    nav: [
      { text: 'Home', link: '/vi/' },
      { text: 'Getting Started', link: '/vi/getting-started/introduction/quick-start' },
      { text: 'API', link: '/vi/api/introduction' },
      versionNav('vi'),
    ],
    sidebar: {
      // v1 "next" section (#210). DOC6 (#211) adds groups as pages land.
      '/vi/next/': [
        { text: 'Tổng quan', link: '/vi/next/' },
      ],
      '/vi/getting-started/': [
        {
          text: 'Introduction',
          base: '/vi/getting-started/introduction/',
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
          ]
        },
      ],
    },
  }
});