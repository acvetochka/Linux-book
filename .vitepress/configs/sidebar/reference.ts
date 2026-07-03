const collections = '/reference/collections'

export const referenceSidebar = [
  {
    text: "Collections",
    link: "/reference/collections/README",
    items: [
      { text: "Базові команди", link: `${collections}/basic-commands` },
      { text: "Файлова система", link: "/reference/collections/file-system" },
      { text: "Користувачі та групи", link: "/reference/collections/users" },
      { text: "Робота з текстом", link: "/reference/collections/text" },
      { text: "Архіви та стиснення", link: "/reference/collections/archives" },
      { text: "Менеджер пакетів (dnf)", link: "/reference/collections/packet-manager" },
      { text: "Інформація про систему та апаратне забезпечення", link: "/reference/collections/info-system" },
      { text: "Процеси", link: "/reference/collections/processes" },
      { text: "Система (systemd, cron, tmux, screen)", link: "/reference/collections/system" },
      { text: "Мережі", link: "/reference/collections/network" },
      { text: "Віддалений доступ", link: "/reference/collections/remote" },
      { text: "SQL", link: '/reference/collections/sql' },
      { text: "MySQL / Percona Server на Linux", link: '/reference/collections/mysql' },
      { text: "Повне порівняння найпоширеніших SQL-серверів", link: `/db-differents` },
      { text: "Загальна таблиця порівняння Apache в Debian vs RHEL", link: "/reference/collections/apache" },
      { text: "Конфігураційні файли Apache (RHEL)", link: "/reference/collections/apache-configs" },
      { text: "ВАЖЛИВІ КОНФІГУРАЦІЙНІ ФАЙЛИ", link: "/reference/collections/configs" },
      { text: "КОНФІГУРАЦІЙНІ ФАЙЛИ. МЕРЕЖА (розширено: routing, NAT, firewall)", link: "/reference/collections/network-configs" },
    ]
  }
]