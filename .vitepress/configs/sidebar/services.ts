const databases = '/services/databases';
const webservices = '/services/webservices'

export const servicesSidebar = [
  { text: 'Сервіси', link: '/services' },
  {
    text: 'Databases',
    collapsed: true,
    link: '/services/databases/README.md',
    items: [
      { text: "Percona Server", link: `${databases}/percona` },
      { text: "MySQL", link: `${databases}/mysql` },
      { text: "Синтаксис SQL у MySQL", link: `${databases}/sql-in-mysql` },
      { text: "Конфігурація MySQL", link: `${databases}/mysql-config` },
      { text: "Користувачі і привілеї в MySQL", link: `${databases}/mysql-user` },
      { text: "Резервні копії (Backup) у MySQL", link: `${databases}/mysql-backup` },
      { text: "Коментарі в MySQL", link: `${databases}/mysql-comments` },
      { text: "MySQL без пароля root", link: `${databases}/mysql-without-pass` },
      { text: "Firewall для MySQL через iptables", link: `${databases}/mysql-firewall` },
      {
        text: "Утиліти MySQL", items: [
          {
            text: "Backup", collapsed: true, items: [
              { text: 'mysqldump', link: `${databases}/utilites/mysqldump` },
              { text: 'xtrabackup', link: `${databases}/utilites/xtrabackup` },
              { text: 'mysqlbinlog', link: `${databases}/utilites/mysqlbinlog` },
            ]
          },
          {
            text: "Administration", collapsed: true, items: [
              { text: 'mysql', link: `${databases}/utilites/admin/mysql` },
              { text: 'mysqladmin', link: `${databases}/utilites/admin/mysqladmin` },
            ]
          }
        ]
      },
      {
        text: "Важливі файли", collapsed: true, items: [
          { text: "xtrabackup_checkpoints", link: `${databases}/files/xtrabackup_checkpoints` },
          { text: "xtrabackup_binlog_info", link: `${databases}/files/xtrabackup_binlog_info` },
          { text: "xtrabackup_info", link: `${databases}/files/xtrabackup_info` },
          { text: "xtrabackup_logfile", link: `${databases}/files/xtrabackup_logfile` },
          { text: "xtrabackup_tablespaces", link: `${databases}/files/xtrabackup_tablespaces` },
          { text: "Додаткові важливі файли XtraBackup", link: `${databases}/files/Додаткові важливі файли XtraBackup` },
          { text: "binlog", link: `${databases}/files/binlog.md` }

        ]
      },
      { text: "PostgreSQL ", link: `${databases}/postgresql` }
    ]

  },
  {
    text: "Webservices", collapsed: true, items: [
      { text: "Apache HTTP Server (Apache httpd)", link: `${webservices}/apache` }
    ]
  },
  {
    text: "Колекції модуля", items: [
      {
        text: "Databases", collapsed: true, items: [
          { text: "SQL", link: '/reference/collections/sql' },
          { text: "MySQL / Percona Server на Linux", link: '/reference/collections/mysql' },

        ]
      },
      {
        text: "Webservers", collapsed: true, items: [
          { text: "Загальна таблиця порівняння Apache в Debian vs RHEL", link: "/reference/collections/apache" },
          { text: "Конфігураційні файли Apache (RHEL)", link: "/reference/collections/apache-configs" },

        ]
      }
    ]
  }

]