import { defineAdditionalConfig } from "vitepress";
import { versionNav } from "../.vitepress/versions";

export default defineAdditionalConfig({
  themeConfig: {
    nav: [
      { text: 'Home', link: '/vi/' },
      { text: 'Hướng dẫn', link: '/vi/guide/' },
      versionNav('vi'),
    ],
    sidebar: {
      // v1 guide (#210). DOC6 (#211) adds groups as pages land.
      '/vi/guide/': [
        {
          text: 'Bắt đầu',
          base: '/vi/guide/',
          items: [
            { text: 'Tổng quan', link: '' },
            { text: 'Giới thiệu', link: 'introduction' },
            { text: 'Endpoint đầu tiên', link: 'first-endpoint' },
          ]
        },
        {
          text: 'Khái niệm cốt lõi',
          base: '/vi/guide/',
          items: [
            { text: 'Contract', link: 'contracts' },
            { text: 'Dependency Injection', link: 'dependency-injection' },
            { text: 'Service Provider', link: 'service-providers' },
            { text: 'Cấu hình', link: 'configuration' },
          ]
        },
        {
          text: 'HTTP',
          base: '/vi/guide/',
          items: [
            { text: 'Routing', link: 'routing' },
            { text: 'Controller', link: 'controllers' },
            { text: 'Model binding', link: 'model-binding' },
            { text: 'Middleware', link: 'middleware' },
            { text: 'Validation', link: 'validation' },
            { text: 'Response', link: 'responses' },
            { text: 'Exception', link: 'exceptions' },
          ]
        },
        {
          text: 'Bảo mật',
          base: '/vi/guide/',
          items: [
            { text: 'Xác thực', link: 'authentication' },
            { text: 'Phân quyền', link: 'authorization' },
            { text: 'OAuth2 server', link: 'oauth2' },
          ]
        },
        {
          text: 'Frontend',
          base: '/vi/guide/',
          items: [
            { text: 'Client', link: 'client' },
          ]
        },
      ],
      '/vi/v0.5/getting-started/': [
        {
          text: 'Introduction',
          base: '/vi/v0.5/getting-started/introduction/',
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
              base: '/vi/v0.5/getting-started/essentials/http/',
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
              base: '/vi/v0.5/getting-started/essentials/security/',
              collapsed: true,
              items: [
                { text: 'Introduction', link: 'introduction' },
                { text: 'Authentication', link: 'authentication' },
                { text: 'Authorization', link: 'authorization' },
              ]
            },
            {
              text: 'Database',
              base: '/vi/v0.5/getting-started/essentials/database/',
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
              base: '/vi/v0.5/getting-started/essentials/console/',
              collapsed: true,
              items: [
                { text: 'Commands', link: 'commands' },
              ]
            },
            {
              text: 'Other',
              base: '/vi/v0.5/getting-started/essentials/other/',
              collapsed: true,
              items: [
                { text: 'Service Providers', link: 'providers' },
              ]
            }
          ]
        },
        {
          text: 'Sauf',
          base: '/vi/v0.5/getting-started/sauf/',
          items: [
            { text: 'Introduction', link: 'introduction' },
            { text: 'Core Commands', link: 'core' },
            { text: 'Generating Commands', link: 'generating' },
          ]
        },
        {
          text: 'Deployment',
          base: '/vi/v0.5/getting-started/deployment/',
          items: [
            { text: 'Building the application', link: 'build' },
            { text: 'Using Docker', link: 'docker' },
            { text: 'Deploy to EDGE', link: 'edge' },
          ]
        }
      ],
      '/vi/v0.5/api/': [
        {
          text: 'Overview',
          link: '/vi/v0.5/api/introduction',
        },
        {
          text: 'API Reference',
          base: '/vi/v0.5/api/api-reference',
          items: [
            {
              text: '@laratype/http',
              base: '/vi/v0.5/api/api-reference/http/',
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