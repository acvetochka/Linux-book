# Шпаргалка: MySQL / Percona Server на Linux (RedHat / Rocky / AlmaLinux / CentOS)

## 1. Встановлення Percona Server
Додавання репозиторію Percona
```bash
sudo dnf install -y https://repo.percona.com/yum/percona-release-latest.noarch.rpm
```

Увімкнення репозиторію PS-8.0
```bash
sudo percona-release setup ps80
```

Встановлення Percona Server
```bash
sudo dnf install -y percona-server-server
```

Запуск сервера
```bash
sudo systemctl enable mysqld
sudo systemctl start mysqld
```

Перевірка статусу
```bash
sudo systemctl status mysqld
```

Перегляд тимчасового root пароля
```bash
sudo grep 'temporary password' /var/log/mysqld.log
```

Початкове налаштування
```bash
sudo mysql_secure_installation
```

## 2. Основні команди MySQL
Підключення
```bash
mysql -u root -p
```

Версія сервера
```sql
SELECT VERSION();
```

Список БД
```sql
SHOW DATABASES;
```

Список користувачів
```sql
SELECT user,host FROM mysql.user;
```

Вертикальний вивід
```sql
SELECT * FROM mysql.user\G
```

## 3. Основні файли та директорії
| Файл/Папка                   | Призначення       |
| ---------------------------- | ----------------- |
| `/etc/my.cnf`                | Головний конфіг   |
| `/etc/my.cnf.d/`             | Додаткові конфіги |
| `/var/lib/mysql/`            | Дані БД           |
| `/var/log/mysqld.log`        | Лог MySQL         |
| `/var/lib/mysql/mysql-bin.*` | Binlog            |
| `/var/lib/mysql/auto.cnf`    | UUID сервера      |


## 4. Основне налаштування сервера
Редагування конфігу
```bash
sudo nano /etc/my.cnf
```

Базовий конфіг
```ini
[mysqld]

bind-address = 0.0.0.0

max_connections = 200

innodb_buffer_pool_size = 4G

log_error = /var/log/mysqld.log

slow_query_log = ON
slow_query_log_file = /var/log/mysql-slow.log
long_query_time = 2
```

## 5. Налаштування Binlog
Увімкнення binlog
```ini
[mysqld]

server-id = 1

log_bin = mysql-bin

binlog_format = ROW

expire_logs_days = 7
```

Перезапуск
```bash
sudo systemctl restart mysqld
```

Перевірка
```sql
SHOW VARIABLES LIKE 'log_bin';
SHOW MASTER STATUS;
```

## 6. Створення користувачів та привілеїв
Створення користувача
```sql
CREATE USER 'admin'@'%' IDENTIFIED BY 'StrongPassword!';
```

Надання всіх привілеїв
```sql
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;
```

Доступ лише до однієї БД
```sql
GRANT ALL PRIVILEGES ON shop.* TO 'shopuser'@'%';
```

Реплікаційний користувач
```sql
CREATE USER 'repl'@'%' IDENTIFIED BY 'ReplPassword!';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
```


(MySQL 8 також підтримує:
```sql
GRANT REPLICATION REPLICA ON *.* TO 'repl'@'%';
```
)

Оновлення привілеїв
```sql
FLUSH PRIVILEGES;
```

## 7. Firewall
Відкрити порт MySQL
```bash
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

Перевірка
```bash
sudo firewall-cmd --list-all
```

## 8. SELinux
Тимчасово вимкнути
```bash
sudo setenforce 0
```

Постійно
```bash
sudo nano /etc/selinux/config
```
```ini
SELINUX=disabled
```

## 9. mysqldump — резервні копії
Встановлення (якщо клієнт відсутній)
```bash
sudo dnf install -y percona-server-client
```
Бекап усіх БД
```bash
mysqldump -u root -p --all-databases > all.sql
```

Бекап однієї БД
```bash
mysqldump -u root -p shop > shop.sql
```
Бекап зі структурами + даними + тригерами
```bash
mysqldump -u root -p \
--routines \
--triggers \
--events \
shop > shop_full.sql
```
Консистентний InnoDB backup
```bash
mysqldump -u root -p \
--single-transaction \
shop > shop.sql
```

Стиснення gzip
```bash
mysqldump -u root -p shop | gzip > shop.sql.gz
```

## 10. Відновлення mysqldump
Відновлення БД
```bash
mysql -u root -p shop < shop.sql
```

Відновлення всіх БД
```bash
mysql -u root -p < all.sql
```

Відновлення gzip
```bash
gunzip < shop.sql.gz | mysql -u root -p shop
```

## 11. Percona XtraBackup
Встановлення
```bash
sudo dnf install -y percona-xtrabackup-80
```

## 12. Повний backup XtraBackup
Створення
```bash
xtrabackup --backup \
--target-dir=/backup/full \
--user=root \
--password='PASSWORD'
```

## 13. Підготовка backup
Apply-log
```bash
xtrabackup --prepare \
--target-dir=/backup/full
```

## 14. Відновлення XtraBackup
Зупинка MySQL
```bash
sudo systemctl stop mysqld
```

Очистка datadir
```bash
sudo rm -rf /var/lib/mysql/*
```

Копіювання backup
```bash
xtrabackup --copy-back \
--target-dir=/backup/full
```

Права
```bash
sudo chown -R mysql:mysql /var/lib/mysql
```

Запуск
```bash
sudo systemctl start mysqld
```

## 15. Інкрементальні backup XtraBackup
Базовий backup
```bash
xtrabackup --backup \
--target-dir=/backup/base
```

Incremental
```bash
xtrabackup --backup \
--target-dir=/backup/inc1 \
--incremental-basedir=/backup/base
```

## 16. mysqlbinlog
Призначення
- Аналіз binlog
- Point-In-Time Recovery
- Реплікація
- Відновлення після помилок

##  17. Перегляд binlog
Список
```sql
SHOW BINARY LOGS;
```

Поточний binlog
```sql
SHOW MASTER STATUS;
```

Читання binlog
```bash
mysqlbinlog mysql-bin.000001
```

Декодування ROW events
```bash
mysqlbinlog --base64-output=DECODE-ROWS -vv mysql-bin.000001
```

## 18. Відновлення через mysqlbinlog
До певного часу
```bash
mysqlbinlog \
--stop-datetime="2026-05-17 15:00:00" \
mysql-bin.000001 | mysql -u root -p
```
Починаючи з позиції
```bash
mysqlbinlog \
--start-position=154 \
mysql-bin.000001 | mysql -u root -p
```

## 19. Реплікація MySQL
### SOURCE (MASTER)  
Конфіг
```ini
[mysqld]

server-id = 1

log_bin = mysql-bin

binlog_format = ROW

bind-address = 0.0.0.0
```
Перезапуск
```bash
sudo systemctl restart mysqld
```

Створення repl user
```sql
CREATE USER 'repl'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;
```

Початкова позиція
```sql
SHOW MASTER STATUS;
```
Приклад:
```
mysql-bin.000001
Position: 154
```

### REPLICA (SLAVE)
Конфіг
```ini
[mysqld]

server-id = 2

relay_log = mysql-relay-bin

read_only = ON
```

Перезапуск
```bash
sudo systemctl restart mysqld
```

Підключення до source  
MySQL 8+
```sql
CHANGE REPLICATION SOURCE TO
SOURCE_HOST='192.168.1.10',
SOURCE_USER='repl',
SOURCE_PASSWORD='password',
SOURCE_LOG_FILE='mysql-bin.000001',
SOURCE_LOG_POS=154;
```

Старий синтаксис
```sql
CHANGE MASTER TO
MASTER_HOST='192.168.1.10',
MASTER_USER='repl',
MASTER_PASSWORD='password',
MASTER_LOG_FILE='mysql-bin.000001',
MASTER_LOG_POS=154;
```

Запуск реплікації
```sql
START REPLICA;
```
Старий синтаксис:
```sql
START SLAVE;
```

Перевірка
```sql
SHOW REPLICA STATUS\G
```
Шукати:
```ini
Replica_IO_Running: Yes
Replica_SQL_Running: Yes
```

## 20. Створення replica через XtraBackup
На source
```bash
xtrabackup --backup \
--target-dir=/backup/full
```

Підготовка
```bash
xtrabackup --prepare \
--target-dir=/backup/full
```

Копіювання backup на replica
```bash
scp -r /backup/full root@replica:/backup/
```

Відновлення на replica
```bash
systemctl stop mysqld

rm -rf /var/lib/mysql/*

xtrabackup --copy-back \
--target-dir=/backup/full

chown -R mysql:mysql /var/lib/mysql

systemctl start mysqld
```

Автоматичні координати реплікації  
Перегляд
```bash
cat /backup/full/xtrabackup_binlog_info
```
Приклад:
```
mysql-bin.000003 4578
```

## 21. GTID реплікація
Source
```ini
gtid_mode = ON
enforce_gtid_consistency = ON
log_slave_updates = ON
```

Replica
```ini
gtid_mode = ON
enforce_gtid_consistency = ON
log_slave_updates = ON
```

Налаштування replica
```sql
CHANGE REPLICATION SOURCE TO
SOURCE_HOST='192.168.1.10',
SOURCE_USER='repl',
SOURCE_PASSWORD='password',
SOURCE_AUTO_POSITION=1;
```

## 22. Основні проблеми реплікації
### Replica_IO_Running = No
Причини
- firewall
- неправильний пароль
- bind-address
- MySQL не слухає 3306

Перевірка
```bash
ss -tulnp | grep 3306
```
```bash
telnet 192.168.1.10 3306
```

Або сучасніше:
```bash
nc -zv 192.168.1.10 3306
```
### Replica_SQL_Running = No
Перегляд помилки
```sql
SHOW REPLICA STATUS\G
```
Шукати:
```ini
Last_SQL_Error
```

### Duplicate entry
Пропуск помилки
```sql
STOP REPLICA;

SET GLOBAL sql_slave_skip_counter = 1;

START REPLICA;
```

### Fatal error 1236
Причини
- видалився binlog
- неправильна позиція

Рішення
> Перебудувати replica через backup.

### Different server UUIDs
Причина

Скопійовано `auto.cnf`

Рішення
```bash
rm -f /var/lib/mysql/auto.cnf
systemctl restart mysqld
```

### Access denied for repl
Причини
- неправильний host
- пароль
- firewall

Перевірка
```sql
SELECT user,host FROM mysql.user;
```

## 23. Корисні команди
Активні підключення
```sql
SHOW PROCESSLIST;
```
Розмір БД
```sql
SELECT table_schema,
ROUND(SUM(data_length+index_length)/1024/1024,2) AS MB
FROM information_schema.tables
GROUP BY table_schema;
```
Перевірка engine
```sql
SHOW TABLE STATUS;
```
InnoDB status
```sql
SHOW ENGINE INNODB STATUS\G
```

## 24. Systemctl
Перезапуск
```bash
sudo systemctl restart mysqld
```
Stop
```bash
sudo systemctl stop mysqld
```
Start
```bash
sudo systemctl start mysqld
```
Логи
```bash
journalctl -u mysqld -f
```

## 25. Важливі файли XtraBackup
| Файл                     | Значення              |
| ------------------------ | --------------------- |
| `xtrabackup_info`        | Інформація про backup |
| `xtrabackup_binlog_info` | binlog позиція        |
| `xtrabackup_checkpoints` | Тип backup            |
| `xtrabackup_logfile`     | redo log              |
| `xtrabackup_tablespaces` | tablespaces           |


## 26. Рекомендації
Для production
- використовувати InnoDB
- ROW binlog
- GTID
- XtraBackup
- окремий backup server
- регулярна перевірка restore

## 27. Швидка діагностика
MySQL не стартує
```bash
journalctl -xeu mysqld
```
Перевірка конфігу
```bash
mysqld --validate-config
```

Перевірка місця
```bash
df -h
```

Перевірка inode
```bash
df -i
```

## 28. Корисні утиліти
| Утиліта             | Призначення           |
| ------------------- | --------------------- |
| `mysqldump`         | логічний backup       |
| `mysqlpump`         | паралельний dump      |
| `mysqlbinlog`       | робота з binlog       |
| `xtrabackup`        | фізичний hot backup   |
| `percona-toolkit`   | адміністрування       |
| `pt-table-checksum` | перевірка replica     |
| `pt-table-sync`     | синхронізація replica |
| `mytop`             | моніторинг            |
| `mysqladmin`        | адміністрування       |
