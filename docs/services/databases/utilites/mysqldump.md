# mysqldump — докладна довідка

## Що таке mysqldump

`mysqldump` — це стандартна консольна утиліта MySQL для створення логічних резервних копій (logical backup).

## Що робить mysqldump

Утиліта:
- підключається до MySQL
- читає структуру і дані
- генерує SQL-файл

📌 Результат
```sql
CREATE TABLE ...
INSERT INTO ...
```

## Основні особливості
| Особливість   | Опис           |
| ------------- | -------------- |
| Тип backup    | Logical        |
| Формат        | SQL            |
| Hot backup    | частково       |
| Portable      | так            |
| Читабельність | висока         |
| Швидкість     | середня/низька |


## Де використовується

✔️ невеликі БД  
✔️ міграція  
✔️ backup окремих таблиць  
✔️ dev/test середовище  

## Базовий синтаксис
```bash
mysqldump [options] database [tables]
```

## Найпростіший backup
```bash
mysqldump -u root -p mydb > mydb.sql
```

📌 Що тут відбувається
| Частина   | Опис                   |
| --------- | ---------------------- |
| `-u root` | користувач             |
| `-p`      | запит пароля           |
| `mydb`    | база                   |
| `>`       | перенаправлення у файл |

🔹 Backup усіх БД
```bash
mysqldump -u root -p --all-databases > full.sql
```

🔹 Backup конкретної таблиці
```bash
mysqldump -u root -p mydb users > users.sql
```

🔹 Backup кількох таблиць
```bash
mysqldump -u root -p mydb users orders > tables.sql
```

🔹 Відновлення backup
```bash
mysql -u root -p mydb < mydb.sql
```

🔹 Створення БД при restore
```bash
mysqldump --databases mydb > mydb.sql
```

📌 Різниця   
Без `--databases`
```sql
CREATE TABLE ...
```

З `--databases`
```sql
CREATE DATABASE ...
USE mydb;
CREATE TABLE ...
```

## Основні параметри mysqldump
| Параметр     | Опис            | Приклад           |
| ------------ | --------------- | ----------------- |
| `-u`         | користувач      | `-u root`         |
| `-p`         | пароль          | `-p`              |
| `-h`         | хост            | `-h 192.168.1.10` |
| `-P`         | порт            | `-P 3306`         |
| `--protocol` | тип підключення | `--protocol=tcp`  |


📦 Вибір БД/таблиць
| Параметр                  | Опис              |
| ------------------------- | ----------------- |
| `--all-databases`         | всі БД            |
| `--databases`             | перелік БД        |
| `--tables`                | таблиці           |
| `--ignore-table=db.table` | виключити таблицю |

Приклад
```bash
mysqldump -u root -p mydb \
--ignore-table=mydb.logs > backup.sql
```

📄 Формат dump
| Параметр            | Опис            |
| ------------------- | --------------- |
| `--no-data`         | лише структура  |
| `--no-create-info`  | лише дані       |
| `--extended-insert` | групові INSERT  |
| `--compact`         | компактний dump |

🔹 Лише структура
```bash
mysqldump --no-data mydb > schema.sql
```

🔹 Лише дані
```bash
mysqldump --no-create-info mydb > data.sql
```

🔹 extended-insert  
✔️ Увімкнений (default)
```sql
INSERT INTO users VALUES (...), (...), (...);
```

✔️ Переваги
- менший файл
- швидший restore

❌ Недолік
- гірше читається

## Консистентність backup
🔥 `--single-transaction`

📌 Один з найважливіших параметрів
```bash
mysqldump --single-transaction mydb > backup.sql
```
Що робить

👉 створює consistent snapshot для InnoDB.

✔️ Переваги
- hot backup
- без блокування таблиць

⚠️ Працює лише з InnoDB

## Блокування таблиць
`--lock-tables`
```bash
mysqldump --lock-tables mydb > backup.sql
```
Що робить

👉 блокує таблиці на запис.

❌ Недоліки
- downtime для write operations

`--lock-all-tables`
```bash
mysqldump --lock-all-tables
```

👉 глобальний lock.

## Реплікація
🔹 `--master-data`
```bash
mysqldump --master-data=2 mydb > backup.sql
```
Що додає
```sql
CHANGE MASTER TO ...
```
Використовується для:
- replication setup
- PITR

## Binary logs
`--flush-logs`
```bash
mysqldump --flush-logs
```
👉 ротація binlog перед backup.

## Продуктивність
🔹 `--quick`
```bash
mysqldump --quick
```
Що робить

👉 читає рядки поступово, а не все в RAM.

✔️ Дуже важливо для великих БД

🔹 `--compress`
```bash
mysqldump --compress
```
👉 стиснення трафіку між client/server.

🔹 Стиснення backup
gzip
```bash
mysqldump mydb | gzip > mydb.sql.gz
```

Restore
```bash
gunzip < mydb.sql.gz | mysql mydb
```

🔹 Character set
```bash
mysqldump --default-character-set=utf8mb4
```

## Backup користувачів і прав
⚠️ mysqldump НЕ backup-ить users автоматично

Backup users
```bash
mysqldump mysql user db tables_priv > grants.sql
```

## Автоматизація
cron
```bash
0 2 * * * mysqldump -u root -pPASSWORD mydb > /backup/mydb.sql
```

⚠️ Небезпечно
```bash
-pPASSWORD
```
пароль видно в process list.

🔹 Краще через ~/.my.cnf
```ini
[client]
user=root
password=secret
```

## Типовий production backup
```bash
mysqldump \
--single-transaction \
--quick \
--routines \
--triggers \
--events \
mydb > mydb.sql
```

## Додаткові об'єкти
| Параметр     | Опис                        |
| ------------ | --------------------------- |
| `--routines` | stored procedures/functions |
| `--triggers` | triggers                    |
| `--events`   | events                      |

## Restore process
1. Створити БД
    ```sql
    CREATE DATABASE mydb;
    ```

2. Restore
    ```bash
    mysql -u root -p mydb < mydb.sql
    ```

## Перевірка dump
Перегляд
```bash
less mydb.sql
```

Перевірка CREATE TABLE
```bash
grep "CREATE TABLE" mydb.sql
```

## Часті помилки
| Проблема        | Причина          |
| --------------- | ---------------- |
| Access denied   | немає прав       |
| Lost connection | великий dump     |
| Table locked    | MyISAM           |
| Corrupted chars | charset mismatch |


## ✔️ Переваги mysqldump

 - простий  
 - portable  
 - читається   
 - універсальний  

## ❌ Недоліки mysqldump

 - повільний  
 - великий CPU usage  
 - великий restore time
 - не підходить для very large DB

## Best Practices

✔️ використовувати --single-transaction  
✔️ стискати dump  
✔️ тестувати restore  
✔️ backup routines/triggers  
✔️ використовувати utf8mb4  

## Коли використовувати mysqldump
| Сценарій      | Підходить |
| ------------- | --------- |
| Маленькі БД   | ✔️         |
| Міграція      | ✔️         |
| Dev/Test      | ✔️         |
| Very large DB | ❌         |

## Висновок

👉 mysqldump:

- створює logical backup
- генерує SQL dump
- простий і універсальний
- найкраще підходить для невеликих і середніх БД

👉 Найважливіший параметр:

`--single-transaction`

для consistent hot backup InnoDB.