import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "docs",

  title: "Linux Book",
  // description: "Linux Book",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Fundamentals',
        collapsed: true,
        link: "/fundamentals/README.md",
        items: [
          { text: 'Структура Linux', link: '/fundamentals/Linux-structure' },
          { text: 'Сімейства дистрибутивів', link: '/fundamentals/Сімейства дистрибутивів' }
        ]
      },
      {
        text: "Environment",
        collapsed: true,
        link: "/environment/README.md",
        items: [
          { text: 'WSL', link: '/environment/WSL' },
          { text: 'Налаштування SSH-proxy', link: '/environment/Налаштування SSH-proxy' }
        ]
      },
      {
        text: "Shell",
        link: "/shell/README.md",
        collapsed: true,
        items: [
          { text: 'Стандартні потоки', link: '/shell/Standard Streams' },
          { text: 'Оператори та символи', link: '/shell/Оператори та символи' },
          { text: 'Зміна Bash-промпту', link: '/shell/Change Bash-prompt' },
          { text: 'history', link: '/shell/history' }
        ]
      },
      {
        text: "Shell Scripting",
        link: '/shell-scripting/README.md',
        collapsed: true,
        items: []

      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/acvetochka/Linux-book' }
    ]
  }
})
