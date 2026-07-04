const collections = '/reference/collections'

export const referenceSidebar = [
  {
    text: "Collections",
    link: `${collections}/README`,
    items: [
      { text: "Базові команди", link: `${collections}/basic-commands` },
      { text: "Файлова система", link: `${collections}/file-system` },
      { text: "Користувачі та групи", link: `${collections}/users` },
      { text: "Робота з текстом", link: `${collections}/text` },
      { text: "Архіви та стиснення", link: `${collections}/archives` },
      { text: "Менеджер пакетів (dnf)", link: `${collections}/packet-manager` },
      { text: "Інформація про систему та апаратне забезпечення", link: `${collections}/info-system` },
      { text: "Процеси", link: `${collections}/processes` },
      { text: "Система (systemd, cron, tmux, screen)", link: `${collections}/system` },
      { text: "Мережі", link: `${collections}/network` },
      { text: "Віддалений доступ", link: `${collections}/remote` },
      { text: "SQL", link: `${collections}/sql` },
      { text: "MySQL / Percona Server на Linux", link: `${collections}/mysql` },
      { text: "Повне порівняння найпоширеніших SQL-серверів", link: `${collections}/db-differents` },
      { text: "Порівняння синтаксису та команд SQL-серверів", link: `${collections}/db-syntax` },
      { text: "Загальна таблиця порівняння Apache в Debian vs RHEL", link: `${collections}/apache` },
      { text: "Конфігураційні файли Apache (RHEL)", link: `${collections}/apache-configs` },
      { text: "ВАЖЛИВІ КОНФІГУРАЦІЙНІ ФАЙЛИ", link: `${collections}/configs` },
      { text: "КОНФІГУРАЦІЙНІ ФАЙЛИ. МЕРЕЖА (розширено: routing, NAT, firewall)", link: `${collections}/network-configs` },
    ]
  }
]