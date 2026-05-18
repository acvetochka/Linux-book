# Утиліта mysqladmin — адміністрування MySQL сервера

`mysqladmin` — це консольна утиліта для швидкого адміністрування MySQL / Percona / MariaDB сервера без входу в інтерактивний mysql shell.

Вона використовується для:

- перевірки доступності сервера
- моніторингу
- перегляду статусу
- керування сервером
- зміни пароля
- reload / flush
- shutdown
- роботи в automation та monitoring

Працює з:

- MySQL
- Percona Server
- MariaDB

## 1. Встановлення
Debian / Ubuntu
```bash
sudo apt install mysql-client
```

RHEL / Rocky / AlmaLinux
```bash
sudo dnf install mysql
```

## 2. Перевірка версії
```bash
mysqladmin --version
```
або:
```bash
mysqladmin -V
```

## 3. Основний синтаксис
```bash
mysqladmin [OPTIONS] command
```

## 4. Підключення
Локально
```bash
mysqladmin -u root -p status
```

Віддалений сервер
```bash
mysqladmin -h 192.168.1.10 -u admin -p status
```

Через порт
```bash
mysqladmin -h 192.168.1.10 -P 3306 -u admin -p status
```

Через socket
```bash
mysqladmin -S /var/run/mysqld/mysqld.sock -u root -p status
```

## 5. Найважливіші команди mysqladmin
| Команда           | Призначення             |
| ----------------- | ----------------------- |
| `ping`            | перевірка доступності   |
| `status`          | короткий статус         |
| `processlist`     | процеси                 |
| `variables`       | server variables        |
| `extended-status` | статусні counters       |
| `shutdown`        | зупинка сервера         |
| `reload`          | reload privilege tables |
| `flush-*`         | очищення кешів          |
| `create`          | створення БД            |
| `drop`            | видалення БД            |
| `password`        | зміна пароля            |

## 6. Перевірка доступності сервера (ping)
Основна перевірка
```bash
mysqladmin ping
```
Результат:
```
mysqld is alive
```

З логіном
```bash
mysqladmin -u root -p ping
```

## 7. Для чого використовують ping

Дуже популярно у:

- monitoring
- healthcheck
- Docker
- Kubernetes
- automation
- load balancers

Docker healthcheck
```dockerfile
HEALTHCHECK CMD mysqladmin ping -h localhost
```

## 8. Команда status
Короткий статус сервера
```bash
mysqladmin status
```
Приклад:
```bash
Uptime: 86400
Threads: 2
Questions: 15234
Slow queries: 0
Opens: 231
Flush tables: 1
Open tables: 64
Queries per second avg: 0.176
```

## 9. Що означають поля status
| Поле                     | Значення              |
| ------------------------ | --------------------- |
| `Uptime`                 | час роботи сервера    |
| `Threads`                | активні потоки        |
| `Questions`              | кількість SQL-запитів |
| `Slow queries`           | повільні запити       |
| `Open tables`            | відкриті таблиці      |
| `Queries per second avg` | середній QPS          |

## 10. Команда `processlist`
Перегляд процесів
```bash
mysqladmin processlist
```

Повний список
```bash
mysqladmin -v processlist
```

Аналог SQL
```sql
SHOW PROCESSLIST;
```

## 11. Перегляд server variables
Variables
```bash
mysqladmin variables
```

Конкретна змінна
```bash
mysqladmin variables | grep max_connections
```

## 12. Extended status
Дуже важлива команда DBA
```bash
mysqladmin extended-status
```
Показує:

- counters
- statistics
- server metrics

Приклад
```
| Threads_connected | 5 |
| Questions         | 15421 |
| Uptime            | 86400 |
```

## 13. Extended-status + grep
Активні connections
```bash
mysqladmin extended-status | grep Threads_connected
```

Slow queries
```bash
mysqladmin extended-status | grep Slow_queries
```

Uptime
```bash
mysqladmin extended-status | grep Uptime
```

## 14. Циклічний моніторинг (-i)
Оновлення кожні 2 секунди
```bash
mysqladmin -i 2 status
```

Monitoring connections
```bash
mysqladmin -i 1 extended-status \
| grep Threads_connected
```

## 15. Sleep між перевірками

Опція:
```bash
-i seconds
```

## 16. Count (-c)
Виконати 5 разів
```bash
mysqladmin -i 2 -c 5 status
```

## 17. Create database
Створення БД
```bash
mysqladmin create employees
```

З логіном
```bash
mysqladmin -u root -p create employees
```

## 18. Drop database
Видалення БД
```bash
mysqladmin -u root -p drop employees
```

Без підтвердження
```bash
mysqladmin -u root -p --force drop employees
```
⚠ Небезпечно.

## 19. Shutdown сервера
Зупинка mysqld
```bash
mysqladmin -u root -p shutdown
```

## 20. Коли використовують shutdown
- automation
- maintenance
- backup procedures
- failover scripts

## 21. Reload
Reload privilege tables
```bash
mysqladmin reload
```

Аналог SQL
```sql
FLUSH PRIVILEGES;
```

## 22. Flush команди
Flush hosts
```bash
mysqladmin flush-hosts
```
Очищає host cache.

Flush logs
```bash
mysqladmin flush-logs
```

Flush tables
```bash
mysqladmin flush-tables
```

Flush status
```bash
mysqladmin flush-status
```
Скидає status counters.

## 23. Password
Зміна пароля
```bash
mysqladmin -u root -p password 'NewPass123'
```

## 24. Важливо про password

У MySQL 8:

- часто НЕ працює через:
    - caching_sha2_password
    - auth_socket
    - unix_socket

Сучасний спосіб:
```sql
ALTER USER 'root'@'localhost'
IDENTIFIED BY 'NewPass123';
```

## 25.  Debugging підключення
Перевірка порту
```bash
ss -tulnp | grep 3306
```

Перевірка firewall

iptables
```bash
sudo iptables -L -n
```

Перевірка socket
```bash
ls -l /var/run/mysqld/
```

## 26.  Silent mode
Тихий режим
```bash
mysqladmin -s status
```
Менше службового output.

## 27. Verbose mode
Детальний режим
```bash
mysqladmin -v processlist
```

## 28. Compression
Стиснення трафіку
```bash
mysqladmin --compress status
```
Корисно для:

- remote connections
- slow networks

## 29. SSL
SSL підключення
```bash
mysqladmin \
--ssl-mode=REQUIRED \
-h db.example.com \
-u admin \
-p status
```

## 30. Batch automation
Healthcheck script
```bash
#!/bin/bash

if mysqladmin ping >/dev/null 2>&1; then
    echo "MYSQL OK"
else
    echo "MYSQL DOWN"
fi
```

## 31. Monitoring Threads
Connected threads
```bash
mysqladmin extended-status \
| grep Threads_connected
```

Running threads
```bash
mysqladmin extended-status \
| grep Threads_running
```

## 32. Monitoring QPS
Questions counter
```bash
mysqladmin extended-status \
| grep Questions
```

## 33. Watching status live
Live monitoring
```bash
watch -n 1 "mysqladmin status"
```

Connections
```bash
watch -n 1 "
mysqladmin extended-status \
| grep Threads_connected
"
```

## 34. mysqladmin vs mysql
| mysqladmin      | mysql            |
| --------------- | ---------------- |
| адміністрування | SQL shell        |
| monitoring      | SQL queries      |
| ping/status     | SELECT/DDL/DML   |
| automation      | interactive work |
| lightweight     | full SQL client  |


## 35. mysqladmin vs mysqlshow
| Утиліта      | Призначення         |
| ------------ | ------------------- |
| `mysqladmin` | адміністрування     |
| `mysqlshow`  | перегляд БД/таблиць |

## 36. Найважливіші команди DBA
```bash
mysqladmin ping
mysqladmin status
mysqladmin processlist
mysqladmin variables
mysqladmin extended-status
mysqladmin shutdown
mysqladmin flush-logs
```

## 37. Найпопулярніші use-cases
Healthcheck
```bash
mysqladmin ping
```

Моніторинг connections
```bash
mysqladmin extended-status \
| grep Threads_connected
```

Перевірка uptime
```bash
mysqladmin status
```

Перевірка доступності replica
```bash
mysqladmin -h replica1 ping
```

## 38. Часті помилки
Access denied
```
Access denied for user
```
Причини:

- неправильний пароль
- auth plugin
- host restrictions

Can't connect
```
Can't connect to MySQL server
```
Причини:

- mysqld не запущений
- firewall
- socket error
- bind-address

## 39. Допомога
Вбудована допомога
```bash
mysqladmin --help
```

Коротка допомога
```bash
mysqladmin --verbose --help
```

## Головна різниця між mysql та mysqladmin
| Утиліта      | Основна роль            |
| ------------ | ----------------------- |
| `mysql`      | SQL-клієнт              |
| `mysqladmin` | адміністративна утиліта |

`mysql` — це повноцінний SQL shell

Через mysql ти:

- виконуєш будь-які SQL-запити
- працюєш з таблицями
- робиш SELECT/INSERT/UPDATE
- адмініструєш через SQL
- запускаєш скрипти

Фактично:
> “Я хочу працювати з SQL.”

Приклад
```bash
mysql -u root -p
```
Потім:
```sql
SELECT * FROM users;
CREATE USER 'admin'@'%';
SHOW PROCESSLIST;
SHOW REPLICA STATUS\G
```

`mysqladmin` — це lightweight admin utility

Через mysqladmin:

- швидко перевіряють сервер
- дивляться статус
- роблять healthcheck
- automation
- monitoring

Фактично:
> “Я хочу швидко адмініструвати сервер без SQL shell.”

Приклад
```bash
mysqladmin ping
```
або:
```bash
mysqladmin status
```