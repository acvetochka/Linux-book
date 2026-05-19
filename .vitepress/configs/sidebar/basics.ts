export const basicsSidebar = [
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
    items: [
      { text: 'Вступ до Bash-скриптів', link: "/basics/shell-scripting/Вступ до Bash-скриптів" },
      { text: 'Змінні та типи даних', link: "/basics/shell-scripting/Змінні та типи даних у Bash" },
      { text: 'Антипатерни Bash', link: "/basics/shell-scripting/Антипатерни Bash" },
      { text: '', link: "/basics/shell-scripting/" },
      { text: '', link: "/basics/shell-scripting/" },
      { text: '', link: "/basics/shell-scripting/" },
      { text: '', link: "/basics/shell-scripting/" },
      { text: '', link: "/basics/shell-scripting/" },
      { text: '', link: "/basics/shell-scripting/" },
      { text: '', link: "/basics/shell-scripting/" },
      { text: '', link: "/basics/shell-scripting/" },
      { text: '', link: "/basics/shell-scripting/" },
    ]

  },

]