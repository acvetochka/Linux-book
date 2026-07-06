const users = '/users/users';
const permissions = '/users/permissions';

// export const servicesSidebar = [
//   { text: 'Сервіси', link: '/services' },
//   {
//     text: 'Databases',
//     collapsed: true,
//     link: '/services/databases/README.md',
//     items: [
//       { text: "Percona Server", link: `${databases}/percona` },
//       { text: "MySQL", link: `${databases}/mysql` },
//       { text: "Синтаксис SQL у MySQL", link: `${databases}/sql-in-mysql` },
//       { text: "Конфігурація MySQL", link: `${databases}/mysql-config` },
//       { text: "Користувачі і привілеї в MySQL", link: `${databases}/mysql-user` },
//       { text: "Резервні копії (Backup) у MySQL", link: `${databases}/mysql-backup` },
//       { text: "Коментарі в MySQL", link: `${databases}/mysql-comments` },
//       { text: "MySQL без пароля root", link: `${databases}/mysql-without-pass` },
//       { text: "Firewall для MySQL через iptables", link: `${databases}/mysql-firewall` },
//     ]
//   }]

export const usersSidebar = [
  {
    text: "Users", link: "",
    collapsed: true,
    items: [
      { text: 'USERS (КОРИСТУВАЧІ ТА ГРУПИ)', link: `${users}/users-and-groups` }
    ]
  },
  {
    text: "Permissions", link: "",
    collapsed: true,
    items: [
      { text: "", link: `${permissions}/` }
    ]
  }
]