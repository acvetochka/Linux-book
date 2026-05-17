# Довідка: Binary Log (binlog) у MySQL

## Що таке Binary Log

`Binary Log (binlog)` — це журнал змін MySQL, у який записуються:

- зміни даних,
- DDL-команди,
- транзакції,
- metadata events.

## Основне призначення

Binary log використовується для:

| Призначення          | Опис                     |
| -------------------- | ------------------------ |
| Replication          | передача змін на replica |
| PITR                 | Point-In-Time Recovery   |
| Audit                | історія змін             |
| Recovery             | відновлення після backup |
| Incremental recovery | replay змін              |

## Де знаходиться

Зазвичай:
```
/var/lib/mysql/
```

## Приклади файлів
```
mysql-bin.000001
mysql-bin.000002
mysql-bin.000003
```

## Супутні файли
| Файл               | Призначення         |
| ------------------ | ------------------- |
| `mysql-bin.000001` | binlog data         |
| `binlog.index`     | список binlog files |

## Увімкнення binlog

Конфігурація
```ini
[mysqld]
server-id=1
log_bin=mysql-bin
binlog_format=ROW
```

## Параметри
- `server-id`

    Унікальний ID сервера.

    Потрібен:

    - replication,
    - binlog infrastructure.

- `log_bin`

    Увімкнення binary log.

- `binlog_format`

    Формат запису подій.

## Формати binlog
| Формат      | Опис                  |
| ----------- | --------------------- |
| `ROW`       | запис змінених рядків |
| `STATEMENT` | запис SQL-команд      |
| `MIXED`     | автоматичний вибір    |

- `ROW`

  Приклад
  ```sql
  UPDATE users SET age=20 WHERE id=1;
  ```
  У binlog:
  ```
  old/new row values
  ```

  ✅ Переваги

  - найнадійніший
  - replication-safe
  - deterministic

  ❌ Недоліки

  - більший розмір

- `STATEMENT`

    Записується SQL:
    ```sql
    UPDATE users SET age=20 WHERE id=1;
    ```

    ✅ Переваги

    - компактний

    ❌ Недоліки

    - nondeterministic queries
    - replication issues

- `MIXED`

  MySQL автоматично:

  - обирає STATEMENT,
  - або ROW.

## Перезапуск MySQL
```bash
sudo systemctl restart mysqld
```

Перевірка
```sql
SHOW VARIABLES LIKE 'log_bin';
```

Перевірка формату
```sql
SHOW VARIABLES LIKE 'binlog_format';
```

Список binlog files
```sql
SHOW BINARY LOGS;
```

Приклад
```sl
+------------------+-----------+
| Log_name         | File_size |
+------------------+-----------+
| mysql-bin.000001 | 186557    |
| mysql-bin.000002 |  89231    |
+------------------+-----------+
```

Поточний binlog
```sql
SHOW MASTER STATUS;
```

Приклад
```sql
File: mysql-bin.000001
Position: 183584
```

## Що таке Position

Position =
```
byte offset у binlog
```

Використовується для
- replication,
- mysqlbinlog replay,
- PITR.

## Структура binlog event

### Приклад:
```sql
# at 1377
#260513 20:40:02 server id 1 end_log_pos 1508
DROP TABLE `test`
```

**Поля**
| Поле               | Значення        |
| ------------------ | --------------- |
| `# at 1377`        | початок event   |
| `end_log_pos 1508` | кінець event    |
| timestamp          | час події       |
| server id          | ID MySQL server |

### Логіка Position
Event
```
starts at 1377
ends at 1508
```

Replay ДО event
```bash
--stop-position=1377
```

Replay ПІСЛЯ event
```bash
--start-position=1508
```

## Перегляд binlog
- Через mysqlbinlog
```bash
mysqlbinlog mysql-bin.000001
```

- Через less
```bash
mysqlbinlog mysql-bin.000001 | less
```

## Пошук подій
```bash
mysqlbinlog mysql-bin.000001 | grep "DROP TABLE"
```

Показати context
```bash
mysqlbinlog mysql-bin.000001 | grep -B 5 "DROP TABLE"
```

## Replay binlog
Повністю
```bash
mysqlbinlog mysql-bin.000001 | mysql -u root -p
```

За позиціями
```bash
mysqlbinlog \
--start-position=1508 \
--stop-position=1900 \
mysql-bin.000001 \
| mysql -u root -p
```

За часом
```bash
mysqlbinlog \
--start-datetime="2026-05-13 20:40:00" \
--stop-datetime="2026-05-13 20:50:00" \
mysql-bin.000001
```

## Point-In-Time Recovery (PITR)
**Логіка**
```
full backup + binlog replay
```

**Сценарій**
1. Full backup
    ```bash
    mysqldump world > world.sql
    ```
2. Дані змінюються

    INSERT / UPDATE / DELETE.

3. DROP TABLE
4. Restore backup
    ```bash
    mysql world < world.sql
    ```
5. Replay binlog ДО DROP
    ```bash
    mysqlbinlog \
    --stop-position=1377 \
    mysql-bin.000001 \
    | mysql world
    ```

**Важливе зауваження**

Restore:
```bash
mysql < dump.sql
```
теж потрапляє в binlog.

Щоб уникнути цього
```sql
SET sql_log_bin=0;
```
Або

Перед лабораторною:
```sql
RESET MASTER;
```

## `RESET MASTER`
Що робить
- видаляє всі binlog,
- створює новий clean log.

Приклад

До:
```
mysql-bin.000001
mysql-bin.000002
```
Після:
```
mysql-bin.000001
```

## `PURGE BINARY LOGS`

Видаляє старі logs.

Приклад
```sql
PURGE BINARY LOGS TO 'mysql-bin.000010';
```

## Автоматичне видалення
```ini
binlog_expire_logs_seconds=604800
```

## GTID у binlog
Що таке GTID
> Global Transaction ID

Приклад
```sql
SET @@SESSION.GTID_NEXT='uuid:123';
```

Використовується
- modern replication,
- failover,
- recovery.

## Важливі команди
| Команда              | Призначення           |
| -------------------- | --------------------- |
| `SHOW BINARY LOGS`   | список logs           |
| `SHOW MASTER STATUS` | поточний binlog       |
| `mysqlbinlog`        | читання logs          |
| `RESET MASTER`       | очистка logs          |
| `PURGE BINARY LOGS`  | видалення старих logs |


## Що потрапляє у binlog

✅ INSERT  
✅ UPDATE  
✅ DELETE  
✅ CREATE TABLE  
✅ ALTER TABLE 
✅ DROP TABLE  
✅ DROP DATABASE  
✅ TRUNCATE  

## Що не потрапляє

❌ SELECT 
❌ службові internal operations  
❌ деякі temporary operations  

## Основна логіка PITR
```
Backup = snapshot
Binlog = changes after snapshot
```

Разом:
> Point-In-Time Recovery