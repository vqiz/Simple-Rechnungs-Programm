// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Rechnix',
  tagline: 'Die einfache Rechnungsverwaltung',
  favicon: 'img/logo.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  url: 'https://rechnix.app', // Placeholder
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'Rechnix', // Usually your GitHub org/user name.
  projectName: 'rechnix', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'de',
    locales: ['de'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          routeBasePath: 'handbuch', // Serve docs at /handbuch
        },
        blog: false, // Disable blog for now
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Rechnix',
        logo: {
          alt: 'Rechnix Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Handbuch',
          },
          { to: '/download', label: 'Download', position: 'left' },
          {
            href: 'https://github.com/vqiz/Simple-Rechnungs-Programm',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Rechtliches',
            items: [
              {
                label: 'Haftungsausschluss',
                to: '/download#haftungsausschluss',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/vqiz/Simple-Rechnungs-Programm',
              },
            ],
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Dominic Bachl IT Solutions & Consulting. <br/> Wir übernehmen keine Haftung für die Nutzung dieser Software oder für entstandene Schäden. Nutzung auf eigene Gefahr.<br/>Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
