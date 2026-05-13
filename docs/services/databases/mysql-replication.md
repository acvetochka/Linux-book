# Реплікація MySQL — повна довідка

## Що таке реплікація MySQL

`Реплікація MySQL` — це механізм копіювання даних та змін з одного сервера MySQL на інші сервери в реальному часі або майже в реальному часі.

Сервер, який передає зміни, називається:
- Source (раніше Master)

Сервер, який отримує зміни:
- Replica (раніше Slave)

## Для чого використовується реплікація
1. Відмовостійкість (High Availability)

    Якщо основний сервер виходить з ладу — можна переключитись на репліку.

2. Балансування навантаження
      - запис → Source
      - читання → Replica

    Наприклад:

    - вебсайт читає дані з реплік
    - записує на головний сервер
3. Резервне копіювання без навантаження

    Бекапи можна робити з репліки.

4. Географічний розподіл

    Репліки можуть знаходитись в інших датацентрах або країнах.

5. Аналітика

    OLAP / BI / звіти можна запускати на репліках.

6. Міграції та оновлення

    Можна:

      - оновлювати MySQL без простою
      - переносити сервери
      - змінювати архітектуру

## Як працює реплікація
Основний принцип
1. Source записує всі зміни у:
    - Binary Log (binlog)
2. Replica читає ці зміни.
3. Replica відтворює SQL-команди локально.

## Основні компоненти реплікації
### 1. Binary Log

Файли:
```bash
mysql-bin.000001
mysql-bin.000002
```
Містять:

- INSERT
- UPDATE
- DELETE
- DDL

### 2. Relay Log

На Replica:
```bash
relay-bin.000001
```
Тимчасове сховище подій з Source.

### 3. I/O Thread

Replica:

- підключається до Source
- читає binlog
- записує relay log

### 4. SQL Thread

Replica:

- читає relay log
- виконує події

## Типи реплікації
### 1. Asynchronous (стандартна)

Source не чекає Replica.

Плюси
- швидко
- мало навантаження

Мінуси
- можливі втрати даних при падінні

### 2. Semi-synchronous

Source чекає підтвердження хоча б від однієї Replica.

Плюси
- менше шансів втрати даних

Мінуси
- повільніше

3. Group Replication

Кластерна реплікація MySQL.

Використовується для:

- HA
- failover
- multi-primary

## Формати Binary Log
### 1. STATEMENT

Записується SQL:
```sql
UPDATE users SET age=20;
```

Мінуси
- недетерміновані функції
- проблеми з NOW(), RAND()

### 2. ROW (рекомендовано)

Записуються зміни рядків.

Плюси
- надійніше

Мінуси
- більший binlog

### 3. MIXED

Комбінація.

## Архітектури реплікації
### 1. Source → Replica
```bash
Source
 ├── Replica1
 ├── Replica2
 └── Replica3
 ```
2. Cascading Replication
```bash
Source
   │
Replica1
   │
Replica2
```

3. Circular Replication
```bash
A → B → C → A
```

Небезпечно без UUID-фільтрації.

4. Multi-source Replication

Одна Replica отримує дані з кількох Source.

## Необхідні файли конфігурації Linux

Debian/Ubuntu
```bash
/etc/mysql/my.cnf
/etc/mysql/mysql.conf.d/mysqld.cnf
```

RHEL/CentOS
```bash
/etc/my.cnf
```

## Основні параметри реплікації
### На Source
```ini
[mysqld]
server-id=1
log_bin=mysql-bin
binlog_format=ROW
```

### На Replica
```ini
[mysqld]
server-id=2
relay_log=relay-bin
read_only=ON
```

### Пояснення параметрів
- `server-id`  
    Унікальний ID сервера.  
    Обов'язково різний.

- `log_bin`  
    Включає binary log.

- `binlog_format`  
    Формат binlog:
    - ROW
    - STATEMENT
    - MIXED

- `relay_log`  
  Файли relay log.

- `read_only`  
  Забороняє записи користувачам.

- `super_read_only`  
    Навіть SUPER не може писати.

- `sync_binlog`  
    Синхронізація binlog на диск.
    ```ini
    sync_binlog=1
    ```

- `expire_logs_days`  
    Видалення старих binlog.

- `binlog_expire_logs_seconds`  
    Сучасний аналог.

## Покрокове налаштування реплікації
### КРОК 1 — Налаштування Source

Редагування конфігу 
1. Debian
    ```bash
    sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
    ```

2. RedHat (RHEL/CentOS)  
    Варіант 1 — через /etc/my.cnf
    ```bash
    sudo nano /etc/my.cnf
    ```

    Варіант 2 — окремий файл (краще)

    Наприклад:
    ```bash
    sudo nano /etc/my.cnf.d/replication.cnf
    ```

Додаємо:
```ini
[mysqld]
server-id=1
log_bin=mysql-bin
binlog_format=ROW
bind-address=0.0.0.0
```

Перезапуск
1. Debian
    ```bash
    sudo systemctl restart mysql
    ```

2. RedHat (RHEL/CentOS)  
    ```bash 
    sudo systemctl restart mysqld
    ```

### КРОК 2 — Створення користувача реплікації
```sql
CREATE USER 'repl'@'%' IDENTIFIED BY 'password';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;
```
У MySQL 8:
- `REPLICATION SLAVE` лишився для сумісності
- також використовується `REPLICATION REPLICA`

### КРОК 3 — Отримання координат binlog
```sql
SHOW MASTER STATUS;
```
Приклад:
```
File: mysql-bin.000003
Position: 157
```

### КРОК 4 — Створення дампу
Через mysqldump
```bash
mysqldump --all-databases --master-data=2 --single-transaction -u root -p > dump.sql
```

Важливі параметри
- `--master-data` - Додає координати binlog.

- `--single-transaction` - Консистентний дамп InnoDB.

### КРОК 5 — Копіювання дампу
```bash
scp dump.sql user@replica:/tmp/
```

### КРОК 6 — Налаштування Replica
Конфіг
```ini
[mysqld]
server-id=2
relay_log=relay-bin
read_only=ON
```

Перезапуск
```bash
sudo systemctl restart mysql
```
або 
```
sudo systemctl restart mysqld
```

### КРОК 7 — Імпорт дампу
```bash
mysql -u root -p < dump.sql
```

### КРОК 8 — Підключення Replica
MySQL 8+
```sql
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='192.168.1.10',
  SOURCE_USER='repl',
  SOURCE_PASSWORD='password',
  SOURCE_LOG_FILE='mysql-bin.000003',
  SOURCE_LOG_POS=157;
```

Старий синтаксис
```sql
CHANGE MASTER TO
```

КРОК 9 — Запуск реплікації
```sql
START REPLICA;
```

Старий варіант:
```sql
START SLAVE;
КРОК 10 — Перевірка
SHOW REPLICA STATUS\G
```
Ключові поля:
```ini
Replica_IO_Running: Yes
Replica_SQL_Running: Yes
Seconds_Behind_Source: 0
```

## Основні утиліти реплікації
### 1. mysqldump

Створення дампів.

### 2. mysqlbinlog

- Читання binary log.

    Приклад
    ```bash
    mysqlbinlog mysql-bin.000001
    ```

- Читання з позиції
    ```bash
    mysqlbinlog --start-position=100 mysql-bin.000001
    ```

- Віддалене читання
    ```bash
    mysqlbinlog --read-from-remote-server \
    --host=source \
    -u repl -p \
    mysql-bin.000001
  ```
### 3. mysql

SQL-клієнт.

### 4. mysqladmin

Моніторинг.

### 5. Percona XtraBackup

Гарячі бекапи для реплікації.

## Таблиці MySQL, пов'язані з реплікацією
### База mysql

- `mysql.slave_master_info` - Інформація про Source.

- `mysql.slave_relay_log_info` - Relay logs.

- `mysql.slave_worker_info` - Multi-threaded replication.

- `mysql.gtid_executed` - GTID транзакції.

### Performance Schema
- `performance_schema.replication_connection_status` - Статус I/O thread.

- `performance_schema.replication_applier_status` - SQL thread.

- `performance_schema.replication_group_members` - Group Replication.

## GTID реплікація
**Що таке GTID**

GTID = Global Transaction ID.

Кожна транзакція має унікальний ID.

**Переваги**
- простіше failover
- автоматичне позиціонування
- простіше адміністрування

**Увімкнення GTID**  
Source + Replica
```ini
gtid_mode=ON
enforce_gtid_consistency=ON
log_slave_updates=ON
```

**Підключення GTID**  
```sql
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='192.168.1.10',
  SOURCE_USER='repl',
  SOURCE_PASSWORD='password',
  SOURCE_AUTO_POSITION=1;
```

**Multi-threaded Replication**  
Увімкнення
```ini
replica_parallel_workers=4
```

## Напівсинхронна реплікація
Плагіни

- Source
    ```sql
    INSTALL PLUGIN rpl_semi_sync_source SONAME 'semisync_source.so';
    ```

- Replica
    ```sql
    INSTALL PLUGIN rpl_semi_sync_replica SONAME 'semisync_replica.so';
    ```

## Типові проблеми та їх вирішення
### 1. Replica_IO_Running = No
Причини
- мережа
- firewall
- неправильний пароль
- bind-address

Перевірка
```bash
telnet source 3306.
```


Перевірка порту
```bash
nc -zv source 3306
```
Приклад:
```bash
nc -zv 192.168.1.10 3306
```

**Результат**  
Успіх
```
Connection to 192.168.1.10 3306 port [tcp/mysql] succeeded!
```

Помилка
```
Connection refused
```
або
```
timed out
```

Пояснення параметрів
| Параметр | Значення                       |
| -------- | ------------------------------ |
| `-z`     | scan mode (без передачі даних) |
| `-v`     | verbose                        |

ss — локальна перевірка прослуховування порту

На самому MySQL-сервері:
```bash
ss -tulpn | grep 3306
```

Приклад
```
LISTEN 0 70 0.0.0.0:3306
```

Логи
```bash
sudo journalctl -u mysql
```

### 2. Replica_SQL_Running = No
Причини
 - конфлікт ключів
 - таблиця відсутня
 - різні дані

Перегляд помилки
```sql
SHOW REPLICA STATUS\G
```
Шукати:
```
Last_SQL_Error
```

### 3. Duplicate entry
```
Error 'Duplicate entry'  
```
Причина

Дані вже існують.

Варіант виправлення
```sql
STOP REPLICA;
SET GLOBAL sql_slave_skip_counter = 1;
START REPLICA;
```
У MySQL 8:
```sql
sql_replica_skip_counter
```

### 4. Relay log corrupted
Симптом  
```
Relay log read failure
```

Fix
```sql
STOP REPLICA;
RESET REPLICA;
```

Потім повторно налаштувати.

### 5. Binlog deleted
Симптом
```
Could not find first log file
```

Причина

Source видалив старі binlog.

Fix
- новий дамп
- перебудова репліки

### 6. GTID conflicts
Симптом
```
GTID already executed
```

Причина

Ручні зміни на Replica.

Fix
- не писати на Replica
- rebuild

### 7. Seconds_Behind_Source росте
Причини
- повільний диск
- великі транзакції
- мало worker threads

Оптимізація
```ini
replica_parallel_workers=8
```

### 8. Server-id conflict
Симптом
```
Fatal error: server-id conflicts
```

Fix

Унікальні `server-id`.

## Команди адміністрування
Зупинка
```sql
STOP REPLICA;
```

Запуск
```sql
START REPLICA;
```

Скидання
```sql
RESET REPLICA;
```
Повне очищення
```sql
RESET MASTER;
```

ОБЕРЕЖНО:
- видаляє всі binlog

Моніторинг
```sql
SHOW REPLICA STATUS
```
Основна команда.

SHOW BINARY LOGS
```sql
SHOW BINARY LOGS;
```

SHOW BINLOG EVENTS
```sql
SHOW BINLOG EVENTS;
```

## Безпека реплікації
Рекомендації
1. Не використовувати `%`  
        ```sql
        'repl'@'10.0.%'
        ```
2. TLS
        ```ini
        require_secure_transport=ON
        ```
3. Firewall

    Відкрити лише 3306 між серверами.

4. Окремий користувач

    Лише:

    - REPLICATION SLAVE
    - REPLICATION CLIENT

## Реплікація та InnoDB

Реплікація найкраще працює з:

- InnoDB
- ROW binlog

## Коли реплікація НЕ врятує

Реплікація:

- копіює DELETE
- копіює DROP TABLE
- копіює помилки користувача

Тому реплікація ≠ backup.

## Рекомендується
```ini
binlog_format=ROW
gtid_mode=ON
sync_binlog=1
innodb_flush_log_at_trx_commit=1
super_read_only=ON
```

## Корисні команди
Перевірка GTID
```sql
SHOW VARIABLES LIKE 'gtid%';
```
Перевірка binlog
```sql
SHOW VARIABLES LIKE 'log_bin';
```
Перевірка replica threads
```sql
SHOW REPLICA STATUS\G
```

## Висновок

Реплікація MySQL використовується для:

- відмовостійкості
- масштабування
- резервування
- аналітики
- кластеризації

Найкраща сучасна конфігурація:

- InnoDB
- ROW replication
- GTID
- Multi-threaded Replica
- Semi-sync або Group Replication для HA

Основні інструменти:

- mysqldump
- mysqlbinlog
- SHOW REPLICA STATUS
- Percona XtraBackup

Найчастіші проблеми:

- відставання репліки
- конфлікти даних
- видалені binlog
- relay log corruption
- GTID conflicts