import { inv_trapezoid } from "mermaid/dist/rendering-util/rendering-elements/shapes/invertedTrapezoid.js";

export const servicesSidebar = [
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