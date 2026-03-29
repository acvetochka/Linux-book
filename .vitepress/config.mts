import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "docs",

  title: "Linux Book",
  // description: "Linux Book",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      // { text: 'Home', link: '/' },
      { text: 'Основи Linux', link: '/basics' },
      { text: 'Troubleshooting', link: '/performance/README.md' }
    ],

    sidebar: {
      '/basics':
        [
          { text: 'Основи Linux', link: '/basics' },
          {
            text: 'Fundamentals',
            collapsed: true,
            link: "/basics/fundamentals/README.md",
            items: [
              { text: 'Структура Linux', link: '/basics/fundamentals/Linux-structure' },
              { text: 'Сімейства дистрибутивів', link: '/basics/fundamentals/Сімейства дистрибутивів' }
            ]
          },
          {
            text: "Environment",
            collapsed: true,
            link: "/basics/environment/README.md",
            items: [
              { text: 'WSL', link: '/basics/environment/WSL' },
              { text: 'Налаштування SSH-proxy', link: '/basics/environment/Налаштування SSH-proxy' }
            ]
          },
          {
            text: "Shell",
            link: "/basics/shell/README.md",
            collapsed: true,
            items: [
              { text: 'Стандартні потоки', link: '/basics/shell/Standard Streams' },
              { text: 'Оператори та символи', link: '/basics/shell/Оператори та символи' },
              { text: 'Зміна Bash-промпту', link: '/basics/shell/Change Bash-prompt' },
              { text: 'history', link: '/basics/shell/history' }
            ]
          },
          {
            text: "Shell Scripting",
            link: '/basics/shell-scripting/README.md',
            collapsed: true,
            items: []

          },

        ],
      '/performance/': [
        {
          text: "Performance",
          link: '/performance/README.md',
          collapsed: true,
          items: [
            { text: "Траблшутінг швидкодії", link: '/performance/Troubleshooting' },
            { text: "Траблшутінг по рівням", link: '/performance/Troubleshooting by levels' },
            { text: "OOM killer", link: '/performance/OOM killer' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/acvetochka/Linux-book' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Released under CC BY 4.0 License',
      copyright: '© 2026 <a href="https://www.kuznietsova.org" target="_blank" rel="noopener">Alona Kuznietsova</a>'
    }
  }
})
