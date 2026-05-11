# mysqlbinlog — докладна довідка

## Що таке mysqlbinlog

`mysqlbinlog` — це консольна утиліта MySQL для:

- читання binary logs (binlog)
- аналізу змін БД
- point-in-time recovery (PITR)
- replication recovery

## Що таке Binary Log (binlog)
📌 Binlog

Binary log — це журнал:
- всіх змін даних і структури БД.

✔️ Binlog містить
- INSERT
- UPDATE
- DELETE
- CREATE TABLE
- ALTER TABLE

❌ НЕ містить
- звичайні SELECT.

## Для чого потрібен binlog
| Використання       | Опис                           |
| ------------------ | ------------------------------ |
| Replication        | master → replica               |
| PITR               | restore до конкретного моменту |
| Audit              | аналіз змін                    |
| Incremental backup | backup змін                    |

## Де зберігаються binlog
Перевірка
```sql
SHOW VARIABLES LIKE 'log_bin';
```

Типово
```bash
/var/lib/mysql/mysql-bin.000001
```

## Увімкнення binlog
my.cnf
```ini
[mysqld]

log_bin = mysql-bin
server-id = 1
```

## Перезапуск
```bash
systemctl restart mysqld
```

## Перевірка binlog
```sql
SHOW BINARY LOGS;
```

🔹 Приклад
| Log_name         | File_size |
| ---------------- | --------- |
| mysql-bin.000001 | 120K      |
| mysql-bin.000002 | 87K       |


## Формати binlog
| Формат    | Опис         |
| --------- | ------------ |
| STATEMENT | SQL queries  |
| ROW       | row changes  |
| MIXED     | комбінований |

🔹 Перевірка
```sql
SHOW VARIABLES LIKE 'binlog_format';
```

🔹 STATEMENT
```sql
UPDATE users SET age=20 WHERE id=1;
```

👉 у binlog зберігається SQL-запит.

🔹 ROW

👉 зберігаються:
- зміни рядків

Наприклад
```
before: age=18
after: age=20
```

🔹 MIXED

👉 MySQL сам обирає формат.

## Що робить mysqlbinlog

Утиліта:

- читає binlog
- декодує binary format
- виводить SQL/events

## Базовий синтаксис
```bash
mysqlbinlog [options] binlog-file
```

## Перегляд binlog
```bash
mysqlbinlog mysql-bin.000001
```

🔹 Приклад output
```sql
CREATE TABLE users (...);

INSERT INTO users VALUES (1,'Anna');
```

## Читання кількох binlog
```bash
mysqlbinlog mysql-bin.000001 mysql-bin.000002
```

## Redirect у файл
```bash
mysqlbinlog mysql-bin.000001 > decoded.sql
```

## Restore через mysqlbinlog
📌 Один з головних сценаріїв
```bash
mysqlbinlog mysql-bin.000001 | mysql -u root -p
```

Що відбувається

👉 binlog replay:
- зміни повторно застосовуються

## Point In Time Recovery (PITR)
📌 Ідея

Restore:

- full backup
- binlog changes до конкретного моменту

🔹 Приклад сценарію
```
01:00 → full backup
13:00 → accidental DELETE
12:59 → restore target
```

### Restore workflow
1. Restore full backup
```bash
mysql < full.sql
```

2. Apply binlogs
```bash
mysqlbinlog mysql-bin.000001 \
| mysql -u root -p
```

🔹 Restore до конкретного часу  
`--stop-datetime`
```bash
mysqlbinlog \
--stop-datetime="2026-05-10 12:59:00" \
mysql-bin.000001 \
| mysql -u root -p
```

🔹 Restore з конкретного часу  
`--start-datetime`
```bash
mysqlbinlog \
--start-datetime="2026-05-10 10:00:00" \
mysql-bin.000001
```

### Restore по позиції  
📌 Binlog має позиції
```
at 120
at 450
at 980
```

🔹 Start position
```bash
mysqlbinlog \
--start-position=450 \
mysql-bin.000001
```

🔹 Stop position
```bash
mysqlbinlog \
--stop-position=980 \
mysql-bin.000001
```

🔹 Навіщо position-based recovery

✔️ replication  
✔️ precise recovery 
✔️ debugging  
 
🔹 Base64 output

У ROW format можуть бути:
```
BINLOG '
abcd...
'
```

🔹 Decode rows  
`--base64-output`
```bash
mysqlbinlog --base64-output=DECODE-ROWS
```

## Verbose mode
```bash
mysqlbinlog -vv mysql-bin.000001
```

📌 Для чого

👉 показати row changes у readable form.

🔹 Приклад
```
### UPDATE users
### WHERE
###   id=1
### SET
###   age=20
```

## Remote binlog reading
🔹 Читання з сервера
```bash
mysqlbinlog \
--read-from-remote-server \
-h 192.168.1.10 \
-u repl \
-p \
mysql-bin.000001
```

🔹 Continuous streaming  
`--stop-never`
```bash
mysqlbinlog \
--read-from-remote-server \
--stop-never
```

📌 Використовується для:
- replication tools
- streaming

## Перевірка binlog events
`SHOW BINLOG EVENTS`
```sql
SHOW BINLOG EVENTS
IN 'mysql-bin.000001';
```

🔹 Rotate logs
```sql
FLUSH LOGS;
```

## Видалення старих binlog
⚠️ Обережно
```sql
PURGE BINARY LOGS
TO 'mysql-bin.000010';
```

🔹 Або по даті
```sql
PURGE BINARY LOGS
BEFORE '2026-05-01';
```

🔹 Автоматичне очищення
```ini
binlog_expire_logs_seconds = 604800
```

📌 604800 секунд

👉 7 днів.

## GTID і mysqlbinlog
🔹 GTID

Global Transaction ID.

🔹 Перевірка
```sql
SHOW VARIABLES LIKE 'gtid_mode';
```

🔹 Binlog encryption  
`binlog_encryption`
```ini
binlog_encryption = ON
```

## Інформація про binlog
🔹 Поточний binlog
```sql
SHOW MASTER STATUS;
```

🔹 Приклад
| File             | Position |
| ---------------- | -------- |
| mysql-bin.000005 | 1240     |


## Типові параметри mysqlbinlog
| Параметр                    | Опис              |
| --------------------------- | ----------------- |
| `--start-position`          | початкова позиція |
| `--stop-position`           | кінцева позиція   |
| `--start-datetime`          | початковий час    |
| `--stop-datetime`           | кінцевий час      |
| `--base64-output`           | decode rows       |
| `-v / -vv`                  | verbose           |
| `--read-from-remote-server` | читати з сервера  |
| `--stop-never`              | streaming mode    |

## Типові сценарії
| Сценарій             | mysqlbinlog |
| -------------------- | ----------- |
| PITR                 | ✔️           |
| Replication recovery | ✔️           |
| Audit changes        | ✔️           |
| Incremental backup   | ✔️           |


## Часті помилки
| Помилка            | Причина         |
| ------------------ | --------------- |
| binlog not found   | log_bin OFF     |
| corrupted replay   | wrong order     |
| duplicate entries  | repeated replay |
| cannot decode rows | no verbose mode |


## Best Practices

✔️ full backup + binlog  
✔️ зберігати binlog окремо  
✔️ тестувати PITR  
✔️ ROW format для reliability  
✔️ purge old logs safely  

## ✔️ Переваги mysqlbinlog

 - PITR
 - replication support
 - audit trail
 - incremental recovery

❌ Недоліки

 - складність
 - великі logs
 - потребує full backup

## Висновок

👉 mysqlbinlog:

- працює з binary logs
- використовується для PITR і replication
- дозволяє відновлювати БД до конкретного моменту

👉 Найважливіший сценарій:
```
FULL BACKUP
+
BINLOG REPLAY
=
POINT IN TIME RECOVERY
```
