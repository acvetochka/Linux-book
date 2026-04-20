import { defineConfig } from 'vitepress'
import { withMermaid } from "vitepress-plugin-mermaid"

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    srcDir: "docs",

    title: "Linux Book",
    // description: "Linux Book",
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      outline: [2, 4],
      nav: [
        // { text: 'Home', link: '/' },
        { text: 'Основи Linux', link: '/basics' },
        { text: 'Файлова система та Storage', link: '/files' },
        { text: 'Система та процеси', link: '/system' },
        { text: 'Мережі', link: '/networking/README.md' },
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
              items: [
                { text: 'Вступ до Bash-скриптів', link: "/basics/shell-scripting/Вступ до Bash-скриптів" },
                { text: 'Змінні та типи даних', link: "/basics/shell-scripting/Змінні та типи даних" },
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

          ],
        '/files': [
          { text: "Файлова система та Storage", link: '/files' },
          {
            text: 'File System',
            collapsed: true,
            link: "/files/file-system/README.md",
            items: [
              { text: "Файлова система", link: "/files/file-system/FileSystem" },
              { text: "Ієрархія Linux", link: "/files/file-system/LinuxHierarchy" },
              { text: "Концепція модульних конфігурацій", link: "/files/file-system/Концепція модульних конфігурацій" },
              { text: "Монтування файлової системи", link: "/files/file-system/Монтування файлової системи" },
              { text: "Inode", link: "/files/file-system/Inode" },
              { text: "Посилання", link: "/files/file-system/Links" },
              {
                text: "Утиліти", items: [
                  { text: "fdisk", link: "/files/file-system/fdisk" },
                  { text: "dubugfs", link: "/files/file-system/debugfs" },
                ]
              }
            ]

          },
          {
            text: 'Storage',
            collapsed: true,
            link: "/files/storage/README.md",
            items: [
              { text: "df", link: "/files/storage/df" },
              { text: "du", link: "/files/storage/du" },
              { text: "lsblk", link: "/files/storage/lsblk" }
            ]
          },
          {
            text: 'File Management',
            collapsed: true,
            link: "/files/file-management/README.md",
            items: [
              { text: "Робота з файлами", link: "/files/file-management/Робота з файлами" },
              { text: "Способи відображення файлів команд Linux", link: "/files/file-management/Способи відображення файлів команд Linux" },
              {
                text: "Утиліти", items: [
                  { text: "find", link: "/files/file-management/find" },
                  { text: "install", link: "/files/file-management/install" },
                  { text: "ls", link: "/files/file-management/ls" }
                ]
              }
            ]


          },
          {
            text: 'Text Processing',
            collapsed: true,
            link: "/files/text-processing/README.md",
            items: [
              {
                text: "Регулярні вирази",
                items: [
                  { text: "Регулярні вирази", link: "/files/text-processing/Регулярні вирази" },
                  { text: "BRE-ERE-PCRE", link: "/files/text-processing/BRE-ERE-PCRE" },
                  { text: "POSIX", link: "/files/text-processing/POSIX" },
                  { text: "Велика таблиця: grep / sed / awk + regex", link: "/files/text-processing/Велика таблиця-grep, sed, awk+ regex" },
                ],
              },
              {
                text: "Утиліти", items: [
                  { text: "grep", link: "/files/text-processing/grep" },
                  { text: "sed", link: "/files/text-processing/sed" },
                  { text: "awk", link: "/files/text-processing/awk" },
                  { text: "date", link: "/files/text-processing/date" },
                  { text: "sort", link: "/files/text-processing/sort" }

                ]
              }

            ]
          }

        ],
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
          {
            text: "Networking",
            link: '/networking/README.md',
            collapsed: true,
            items: [
              { text: "Основи комп'ютерних мереж", link: "/networking/Основи компютерних мереж" },
              { text: "Налаштування та контроль мережі", link: "/networking/Налаштування та контроль мережі" },
              { text: "NetworkManager", link: "/networking/NetworkManager" },
              {
                text: "Протоколи мереж",
                link: "/networking/protocols/README",
                items: [
                  { text: "ARP", link: "/networking/protocols/ARP" },
                  { text: "IP", link: "/networking/protocols/IP" },
                  { text: "ICMP", link: "/networking/protocols/ICMP" },
                  { text: "TCP та UDP", link: "/networking/protocols/TCP and UDP" },
                  { text: "", link: "/networking/potocols/" },
                  { text: "", link: "/networking/potocols/" },
                  { text: "", link: "/networking/potocols/" },
                  { text: "", link: "/networking/potocols/" },
                  { text: "", link: "/networking/potocols/" },
                  { text: "", link: "/networking/potocols/" },
                  { text: "", link: "/networking/potocols/" },
                  { text: "", link: "/networking/potocols/" },
                  { text: "", link: "/networking/potocols/" },


                ]

              },
              {
                text: "Утиліти", items: [
                  { text: "ip", link: "/networking/ip" },
                  { text: "traceroute", link: "/networking/traceroute" },
                  { text: "ss", link: "/networking/ss" },
                  { text: "tcpdump", link: "/networking/tcpdump" },
                  { text: "nmcli", link: "/networking/nmcli" },
                  { text: "dig", link: "/networking/dig" },
                  { text: "lshw", link: "/networking/lshw" },
                  { text: "dmicode", link: "/networking/dmicode" }

                ]
              }
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
              { text: "Розділ 1: БАЗОВІ КОМАНДИ", link: "/reference/collections/basic-commands" },
              { text: "Розділ 2: ФАЙЛОВА СИСТЕМА", link: "/reference/collections/file-system" },
              { text: "Розділ 3: КОРИСТУВАЧІ ТА ГРУПИ", link: "/reference/collections/users" },
              { text: "Розділ 4: РОБОТА З ТЕКСТОМ", link: "/reference/collections/text" },
              { text: "Розділ 5: АРХІВИ ТА СТИСНЕННЯ", link: "/reference/collections/archives" },
              { text: "Розділ 6: МЕНЕДЖЕР ПАКЕТІВ (dnf)", link: "/reference/collections/packet-manager" },
              { text: "Розділ 7: ІНФОРМАЦІЯ ПРО СИСТЕМУ ТА АПАРАТНЕ ЗАБЕЗПЕЧЕННЯ", link: "/reference/collections/info-system" },
              { text: "Розділ 8: ПРОЦЕСИ", link: "/reference/collections/processes" },
              { text: "Розділ 9: СИСТЕМА (systemd, cron, tmux, screen)", link: "/reference/collections/system" },
              { text: "Розділ 10: МЕРЕЖІ", link: "/reference/collections/network" },
              { text: "Розділ 11: ВІДДАЛЕНИЙ ДОСТУП", link: "/reference/collections/remote" },

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
