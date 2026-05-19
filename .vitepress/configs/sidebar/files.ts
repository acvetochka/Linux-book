export const filesSedebar = [
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
]