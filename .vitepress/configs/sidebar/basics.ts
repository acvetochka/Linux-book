const fundamentals = '/basics/fundamentals';
const environment = '/basics/environment';
const shell = '/basics/shell';
const scripting = '/basics/shell-scripting';

export const basicsSidebar = [
  { text: 'Основи Linux', link: '/basics' },
  {
    text: 'Fundamentals',
    collapsed: true,
    link: `${fundamentals}/README.md`,
    items: [
      { text: 'Структура Linux', link: `${fundamentals}/Linux-structure` },
      { text: 'Сімейства дистрибутивів', link: `${fundamentals}/Сімейства дистрибутивів` }
    ]
  },
  {
    text: "Environment",
    collapsed: true,
    link: `${environment}/README.md`,
    items: [
      { text: 'WSL', link: `${environment}/WSL` },
      { text: 'Налаштування SSH-proxy', link: `${environment}/Налаштування SSH-proxy` }
    ]
  },
  {
    text: "Shell",
    link: `${shell}/README.md`,
    collapsed: true,
    items: [
      { text: 'Стандартні потоки', link: `${shell}/Standard Streams` },
      { text: 'Оператори та символи', link: `${shell}/Оператори та символи` },
      { text: 'Зміна Bash-промпту', link: `${shell}/Change Bash-prompt` },
      { text: 'history', link: `${shell}/history` }
    ]
  },
  {
    text: "Shell Scripting",
    link: `${scripting}/README.md`,
    collapsed: true,
    items: [
      { text: 'Вступ до Bash-скриптів', link: `${scripting}/Вступ до Bash-скриптів` },
      { text: 'Змінні та типи даних', link: `${scripting}/Змінні та типи даних у Bash` },
      { text: 'Антипатерни Bash', link: `${scripting}/Антипатерни Bash` },
      { text: '', link: `${scripting}/` },
      { text: '', link: `${scripting}/` },
      { text: '', link: `${scripting}/` },
      { text: '', link: `${scripting}/` },
      { text: '', link: `${scripting}/` },
      { text: '', link: `${scripting}/` },
    ]

  },

]