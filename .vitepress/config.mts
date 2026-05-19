import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid"

import { nav } from './configs/nav'
import { basicsSidebar } from './configs/sidebar/basics'
import { filesSedebar } from './configs/sidebar/files'

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    srcDir: "docs",

    title: "Linux Book",
    // description: "Linux Book",
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      outline: [2, 4],
      nav,
      // nav: [
      //   // { text: 'Home', link: '/' },
      //   { text: 'Основи Linux', link: '/basics' },
      //   { text: 'Файлова система та Storage', link: '/files' },
      //   { text: 'Система та процеси', link: '/system' },
      //   { text: 'Мережі', link: '/networking/README.md' },
      //   { text: 'Сервіси', link: '/services' },
      //   { text: 'Troubleshooting', link: '/performance/README.md' }
      // ],

      sidebar: {
        '/basics': basicsSidebar,
        '/files': filesSedebar,
        '/system/': [
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
        ],
        '/networking/': [
          { text: "Networking", link: '/networking/README.md' },
          // items: [
          { text: "Основи комп'ютерних мереж", link: "/networking/Основи компютерних мереж" },
          { text: "Налаштування та контроль мережі", link: "/networking/Налаштування та контроль мережі" },
          { text: "NetworkManager", link: "/networking/NetworkManager" },
          { text: "Linux як роутер", link: "/networking/Linux як роутер" },
          {
            text: "Протоколи мереж",
            collapsed: true,
            link: "/networking/protocols/README",
            items: [
              { text: "ARP", link: "/networking/protocols/ARP" },
              { text: "IP", link: "/networking/protocols/IP" },
              { text: "ICMP", link: "/networking/protocols/ICMP" },
              { text: "TCP та UDP", link: "/networking/protocols/TCP and UDP" },
              { text: "DNS", link: "/networking/protocols/DNS" },
              { text: "HTTP/HTTPS", link: "/networking/protocols/HTTP-HTTPS" },
              { text: "", link: "/networking/protocols/" },
              { text: "", link: "/networking/protocols/" },
              { text: "", link: "/networking/protocols/" },
              { text: "", link: "/networking/protocols/" },
              { text: "", link: "/networking/protocols/" },
              { text: "", link: "/networking/protocols/" },
              { text: "", link: "/networking/protocols/" },


            ]

          },
          {
            text: "Firewall", items: [
              { text: "iptables", link: "/networking/firewall/iptables" }
            ]

          },
          {
            text: "Утиліти",
            collapsed: true,
            items: [
              { text: "ip", link: "/networking/ip" },
              { text: "traceroute", link: "/networking/traceroute" },
              { text: "ss", link: "/networking/ss" },
              { text: "tcpdump", link: "/networking/tcpdump" },
              { text: "nmcli", link: "/networking/nmcli" },
              { text: "dig", link: "/networking/dig" },
              { text: "lshw", link: "/networking/lshw" },
              { text: "dmicode", link: "/networking/dmicode" },
              { text: "nmap", link: "/networking/nmap" },
              { text: "nc", link: "/networking/nc" }

            ]
          }
        ],
        '/services/': [
          { text: 'Сервіси', link: '/services' },
          {
            text: 'Databases',
            collapsed: true,
            link: '/services/databases/README.md',
            items: [
              { text: "Percona Server", link: '/services/databases/percona' },
              { text: "MySQL", link: '/services/databases/mysql' },
              { text: "Синтаксис SQL у MySQL", link: '/services/databases/sql-in-mysql' },
              { text: "Конфігурація MySQL", link: '/services/databases/mysql-config' },
              { text: "Користувачі і привілеї в MySQL", link: '/services/databases/mysql-user' },
              { text: "Резервні копії (Backup) у MySQL", link: '/services/databases/mysql-backup' },
              { text: "Коментарі в MySQL", link: '/services/databases/mysql-comments' },
              { text: "MySQL без пароля root", link: '/services/databases/mysql-without-pass' },
              { text: "Firewall для MySQL через iptables", link: '/services/databases/mysql-firewall' },
              {
                text: "Утиліти MySQL", items: [
                  {
                    text: "Backup", collapsed: true, items: [
                      { text: 'mysqldump', link: '/services/databases/utilites/mysqldump' },
                      { text: 'xtrabackup', link: '/services/databases/utilites/xtrabackup' },
                      { text: 'mysqlbinlog', link: '/services/databases/utilites/mysqlbinlog' },
                    ]
                  },
                  {
                    text: "Administration", collapsed: true, items: [
                      { text: 'mysql', link: '/services/databases/utilites/admin/mysql' },
                      { text: 'mysqladmin', link: '/services/databases/utilites/admin/mysqladmin' },
                    ]
                  }
                ]
              },
              {
                text: "Важливі файли", collapsed: true, items: [
                  { text: "xtrabackup_checkpoints", link: "/services/databases/files/xtrabackup_checkpoints" },
                  { text: "xtrabackup_binlog_info", link: "/services/databases/files/xtrabackup_binlog_info" },
                  { text: "xtrabackup_info", link: "/services/databases/files/xtrabackup_info" },
                  { text: "xtrabackup_logfile", link: "/services/databases/files/xtrabackup_logfile" },
                  { text: "xtrabackup_tablespaces", link: "/services/databases/files/xtrabackup_tablespaces" },
                  { text: "Додаткові важливі файли XtraBackup", link: "/services/databases/files/Додаткові важливі файли XtraBackup" },
                  { text: "binlog", link: "/services/databases/files/binlog.md" }

                ]
              }
            ]

          },
          {
            text: "Webservices", collapsed: true, items: [
              { text: "Apache HTTP Server (Apache httpd)", link: "/services/webservices/apache" }
            ]
          }

        ],
        '/performance/': [
          {
            text: "Performance",
            link: '/performance/README.md',
            collapsed: true,
            items: [
              { text: "Траблшутінг швидкодії", link: '/performance/Troubleshooting' },
              { text: "Траблшутінг по рівням", link: '/performance/Troubleshooting by levels' },
              { text: "OOM killer", link: '/performance/OOM killer' },
              {
                text: "Utilites", items: [
                  { text: "sar", link: '/performance/sar' }
                ]
              }
            ]
          }
        ],
        '/reference/': [
          {
            text: "Collections",
            link: "/reference/collections/README",
            items: [
              { text: "Базові команди", link: "/reference/collections/basic-commands" },
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
              { text: "Загальна таблиця порівняння Apache в Debian vs RHEL", link: "/reference/collections/apache" },
              { text: "ВАЖЛИВІ КОНФІГУРАЦІЙНІ ФАЙЛИ", link: "/reference/collections/configs" },
              { text: "КОНФІГУРАЦІЙНІ ФАЙЛИ. МЕРЕЖА (розширено: routing, NAT, firewall)", link: "/reference/collections/network-configs" }
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
  }))
