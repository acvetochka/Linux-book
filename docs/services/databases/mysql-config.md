# Конфігурація MySQL — докладна довідка

## Що таке конфігурація MySQL
Конфігурація MySQL — це набір параметрів, які визначають:
- як працює сервер
- скільки пам’яті використовує
- які мережеві підключення дозволені
- де зберігаються дані та логи
- як працює InnoDB
- безпеку і продуктивність

## Основні конфігураційні файли
🟥 RedHat / Rocky / AlmaLinux
| Файл             | Призначення       |
| ---------------- | ----------------- |
| `/etc/my.cnf`    | головний конфіг   |
| `/etc/my.cnf.d/` | додаткові конфіги |

🟦 Debian / Ubuntu
| Файл                       | Призначення       |
| -------------------------- | ----------------- |
| `/etc/mysql/my.cnf`        | головний конфіг   |
| `/etc/mysql/conf.d/`       | додаткові конфіги |
| `/etc/mysql/mysql.conf.d/` | конфіги mysqld    |


## Як MySQL читає конфіги
Порядок важливий ⚠️
```bash
/etc/my.cnf
/etc/my.cnf.d/*.cnf
~/.my.cnf
```
👉 пізніші параметри можуть перезаписувати попередні.

## Структура конфіг-файлу
```ini
[mysqld]
port=3306
bind-address=0.0.0.0

[client]
port=3306
```

📌 Секції
| Секція        | Для кого  |
| ------------- | --------- |
| `[mysqld]`    | сервер    |
| `[client]`    | клієнт    |
| `[mysql]`     | mysql CLI |
| `[mysqldump]` | mysqldump |


## Основні параметри сервера

🌐 Мережа  
🔸 port
```ini
port = 3306
```
👉 порт MySQL

🔸 bind-address
```ini
bind-address = 127.0.0.1
```
✔️ Що означає
| Значення    | Результат       |
| ----------- | --------------- |
| `127.0.0.1` | тільки локально |
| `0.0.0.0`   | усі інтерфейси  |


⚠️ Важливо
```ini
bind-address = 0.0.0.0
```
без firewall/security = небезпечно ⚠️

👥 Підключення  
🔸 max_connections
```ini
max_connections = 200
```
👉 максимальна кількість клієнтів.

🔸 wait_timeout
```ini
wait_timeout = 600
```
👉 через скільки секунд неактивне з'єднання закриється.

💾 InnoDB (найважливіше 🔥)

🔸 innodb_buffer_pool_size
```ini
innodb_buffer_pool_size = 1G
```
👉 головний параметр продуктивності.

Що це таке  
MySQL кешує:
- таблиці
- індекси
- дані  
в RAM.

📌 Рекомендація  
| Сервер              | Значення   |
| ------------------- | ---------- |
| dedicated DB server | 60–80% RAM |
| shared server       | менше      |


🔸 innodb_log_file_size
```ini
innodb_log_file_size = 256M
```
👉 розмір redo log.

Більше значення:
- краще для write-heavy
- але довше recovery

🔸 innodb_flush_log_at_trx_commit
```ini
innodb_flush_log_at_trx_commit = 1
```
Значення
| Значення | Безпека     | Швидкість  |
| -------- | ----------- | ---------- |
| 1        | максимальна | повільніше |
| 2        | менша       | швидше     |


📊 Логування

🔸 log_error
```ini
log_error = /var/log/mysqld.log
```
👉 головний лог помилок.

🔸 slow_query_log
```ini
slow_query_log = 1
```

🔸 long_query_time
```ini
long_query_time = 2
```
👉 запити довше 2 сек → slow log.

🔸 slow_query_log_file
```ini
slow_query_log_file = /var/log/mysql-slow.log
```

🔐 Безпека

🔸 local_infile
```ini
local_infile = 0
```
👉 вимикає небезпечний LOAD DATA LOCAL.

🔸 skip_name_resolve
```ini
skip_name_resolve = 1
```
Що дає
👉 MySQL не робить DNS lookup → швидше логін.

⚠️ Але

Користувачів треба створювати:
```sql
'user'@'192.168.1.%'
```

а не:
```sql
'user'@'hostname'
```

## Кодування
🔸 character-set-server
```ini
character-set-server = utf8mb4
```

🔸 collation-server
```ini
collation-server = utf8mb4_unicode_ci
```

📌 Чому utf8mb4
👉 підтримує:
- emoji
- всі unicode символи


## Тимчасові файли
🔸 tmp_table_size
```ini
tmp_table_size = 64M
```

🔸 max_heap_table_size
```ini
max_heap_table_size = 64M
```

## Таблиці і кеш
🔸 table_open_cache
```ini
table_open_cache = 2000
```

## Packet size
🔸 max_allowed_packet
```ini
max_allowed_packet = 64M
```

📌 Для чого  
👉 великі:
- BLOB
- імпорти
- дампи

## Реплікація

🔸 server-id
```ini
server-id = 1
```

🔸 log_bin
```ini
log_bin = mysql-bin
```

## Приклад базового production-конфігу
```ini
[mysqld]

bind-address = 0.0.0.0
port = 3306

max_connections = 200

innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M

slow_query_log = 1
long_query_time = 2

character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci

max_allowed_packet = 64M
```

## Перевірка конфігурації
Показати параметри

```sql
SHOW VARIABLES;
```

Конкретний параметр
```sql
SHOW VARIABLES LIKE 'max_connections';
```

## Зміна параметрів
Тимчасово
```sql
SET GLOBAL max_connections = 300;
```
👉 до перезапуску сервера.

Постійно
```ini
max_connections = 300
```
у `my.cnf` + restart.

## Перезапуск
🟥 RedHat
```bash
systemctl restart mysqld
```

🟦 Debian
```bash
systemctl restart mysql
```

## Перевірка помилок
```bash
journalctl -u mysqld
```

## Часті помилки
| Проблема                | Причина               |
| ----------------------- | --------------------- |
| сервер не стартує       | помилка в my.cnf      |
| remote access не працює | bind-address/firewall |
| slow queries            | немає індексів        |
| Too many connections    | max_connections       |


## Best Practices
✔️ використовувати utf8mb4  
✔️ вмикати slow query log  
✔️ налаштовувати InnoDB  
✔️ не відкривати 3306 у світ без потреби  
✔️ робити backup перед змінами  

### Висновок
👉 Конфігурація MySQL = баланс між:
- продуктивністю
- безпекою
- пам’яттю
- навантаженням

👉 Найважливіші параметри:
- innodb_buffer_pool_size
- max_connections
- bind-address
- slow_query_log