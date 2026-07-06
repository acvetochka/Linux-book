const fs = '/files/file-system';
const storage = '/files/storage';
const fmanagement = '/files/file-management';
const text = '/files/text-processing';

export const filesSedebar = [
  { text: "Файлова система та Storage", link: '/files' },
  {
    text: 'File System',
    collapsed: true,
    link: `${fs}/README.md`,
    items: [
      { text: "Файлова система", link: `${fs}/FileSystem` },
      { text: "Ієрархія Linux", link: `${fs}/LinuxHierarchy` },
      { text: "Концепція модульних конфігурацій", link: `${fs}/Концепція модульних конфігурацій` },
      { text: "Монтування файлової системи", link: `${fs}/Монтування файлової системи` },
      { text: "Inode", link: `${fs}/Inode` },
      { text: "Посилання", link: `${fs}/Links` },
      {
        text: "Утиліти", items: [
          { text: "fdisk", link: `${fs}/fdisk` },
          { text: "dubugfs", link: `${fs}/debugfs` },
        ]
      }
    ]

  },
  {
    text: 'Storage',
    collapsed: true,
    link: `${storage}/README.md`,
    items: [
      { text: "df", link: `${storage}/df` },
      { text: "du", link: `${storage}/du` },
      { text: "lsblk", link: `${storage}/lsblk` }
    ]
  },
  {
    text: 'File Management',
    collapsed: true,
    link: `${fmanagement}/README.md`,
    items: [
      { text: "Робота з файлами", link: `${fmanagement}/Робота з файлами` },
      { text: "Способи відображення файлів команд Linux", link: `${fmanagement}/Способи відображення файлів команд Linux` },
      {
        text: "Утиліти", items: [
          { text: "find", link: `${fmanagement}/find` },
          { text: "install", link: `${fmanagement}/install` },
          { text: "ls", link: `${fmanagement}/ls` }
        ]
      }
    ]


  },
  {
    text: 'Text Processing',
    collapsed: true,
    link: `${text}/README.md`,
    items: [
      {
        text: "Регулярні вирази",
        items: [
          { text: "Регулярні вирази", link: `${text}/Регулярні вирази` },
          { text: "BRE-ERE-PCRE", link: `${text}/BRE-ERE-PCRE` },
          { text: "POSIX", link: `${text}/POSIX` },
          { text: "Велика таблиця: grep / sed / awk + regex", link: `${text}/Велика таблиця-grep, sed, awk+ regex` },
        ],
      },
      {
        text: "Утиліти", items: [
          { text: "grep", link: `${text}/grep` },
          { text: "sed", link: `${text}/sed` },
          { text: "awk", link: `${text}/awk` },
          { text: "date", link: `${text}/date` },
          { text: "sort", link: `${text}/sort` }

        ]
      }

    ]
  }
]