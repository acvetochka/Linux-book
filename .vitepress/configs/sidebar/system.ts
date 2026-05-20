export const systemSidebar = [
  { text: "Система та процеси", link: "/system" },
  {
    text: "Процеси",
    collapsed: true,
    link: '/system/processes/README.md',
    items: [
      { text: "1. Основи процесів", link: "/system/processes/1. Основи процесів" },
      { text: "2. Типи процесів у Linux", link: "/system/processes/2. Типи процесів у Linux" },
      { text: "3. Життєвий цикл процесу в Linux", link: "/system/processes/3. Життєвий цикл процесу в Linux" },
      { text: "Статуси процесів у Linux", link: "/system/processes/Statuses" }
    ]
  },
  {
    text: "Система",
    link: '/system/system/README.md',
    collapsed: true,
    items: [
      {
        text: "systemd", items: [
          { text: "systemd", link: "/system/system/systemd" },
          { text: "Unit-файли", link: "/system/system/Unit-файли" },
          { text: "Типи unit-файлів", link: "/system/system/Типи unit-файлів" }
        ]
      },
      {
        text: "Мультиплексори", items: [
          { text: "screen", link: "/system/system/screen" },
          { text: "tmux", link: "/system/system/tmux" }

        ]
      },
      {
        text: "Плануваальники задач", items: [
          { text: "cron", link: "/system/system/cron" },
          { text: "at", link: "/system/system/at" }
        ]
      }
    ]
  }
]