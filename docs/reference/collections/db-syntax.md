# Порівняння синтаксису та команд SQL-серверів

## Порівняння синтаксису SQL

| Операція           | PostgreSQL         | SQL Server   | MySQL        | Oracle                                         |
| ------------------ | ------------------ | ------------ | ------------ | ---------------------------------------------- |
| Завершення команди | `;`                | `;` або `GO` | `;`          | `;`                                            |
| Перемикання БД     | `\c dbname` (psql) | `USE dbname` | `USE dbname` | Немає (підключення до потрібної БД при логіні) |
| Коментар           | `--` `/* */`       | `--` `/* */` | `--` `/* */` | `--` `/* */`                                   |


## Створення бази даних
| СУБД       | Команда                                                                |
| ---------- | ---------------------------------------------------------------------- |
| PostgreSQL | `CREATE DATABASE shop;`                                                |
| SQL Server | `CREATE DATABASE Shop;` + `GO`                                         |
| MySQL      | `CREATE DATABASE shop;`                                                |
| Oracle     | Зазвичай БД створює DBA. Користувачі працюють із Tablespace та Schema. |

PostgreSQL
```sql
CREATE DATABASE shop;
```
SQL Server
```sql
CREATE DATABASE Shop;
GO
```
MySQL
```sql
CREATE DATABASE shop;
```
Oracle
```sql
CREATE TABLESPACE shop
DATAFILE 'shop.dbf'
SIZE 100M;
```

> [!NOTE]
> Примітка: в Oracle поняття "створити базу даних" відрізняється від інших СКБД. Зазвичай адміністратор створює одну БД, а користувачі працюють із Tablespace та Schema.

## Використання бази
| СУБД       | Команда                                                                          |
| ---------- | -------------------------------------------------------------------------------- |
| PostgreSQL | `\c shop`                                                                        |
| SQL Server | `USE Shop;` + `GO`                                                               |
| MySQL      | `USE shop;`                                                                      |
| Oracle     | Не підтримується. Потрібно підключатися до потрібної Schema під час авторизації. |

PostgreSQL
```sql
\c shop
```
SQL Server
```sql
USE Shop;
GO
```
MySQL
```sql
USE shop;
```

Oracle
```sql
sqlplus user/password@database
```

## AUTO_INCREMENT

| PostgreSQL | SQL Server    | MySQL          | Oracle                |
| ---------- | ------------- | -------------- | --------------------- |
| SERIAL     | IDENTITY(1,1) | AUTO_INCREMENT | IDENTITY або SEQUENCE |


Приклад

PostgreSQL
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT
);
```
SQL Server
```sql
CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100)
);
```

MySQL
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);
```

Oracle
```sql
CREATE TABLE users (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR2(100)
);
```


## Тип логічного значення
| PostgreSQL | SQL Server | MySQL             | Oracle        |
| ---------- | ---------- | ----------------- | ------------- |
| BOOLEAN    | BIT        | BOOLEAN (TINYINT) | Немає BOOLEAN |

## Отримати N рядків
| PostgreSQL | SQL Server | MySQL | Oracle      |
| ---------- | ---------- | ----- | ----------- |
| LIMIT      | TOP        | LIMIT | FETCH FIRST |

PostgreSQL
```sql
SELECT *
FROM users
LIMIT 10;
```

SQL Server
```sql
SELECT TOP 10 *
FROM Users;
```

MySQL
```sql
SELECT *
FROM users
LIMIT 10;
```

Oracle
```sql
SELECT *
FROM users
FETCH FIRST 10 ROWS ONLY;
```

## OFFSET
| PostgreSQL       | SQL Server   | MySQL              | Oracle       |
| ---------------- | ------------ | ------------------ | ------------ |
| LIMIT ... OFFSET | OFFSET FETCH | LIMIT offset,count | OFFSET FETCH |

## Дії з датою та часом
|                    | PostgreSQL   | SQL Server | MySQL      | Oracle         |
| ------------------ | ------------ | ---------- | ---------- | -------------- |
| Поточна дата       | CURRENT_DATE | GETDATE()  | CURDATE()  | SYSDATE        |
| Поточний час       | CURRENT_TIME | GETDATE()  | CURTIME()  | SYSDATE        |
| Поточний Timestamp | NOW()        | GETDATE()  | NOW()      | SYSTIMESTAMP   |
| Додавання днів     | `+ INTERVAL` | DATEADD    | DATE_ADD   | `+` число      |
| Різниця між датами | AGE()        | DATEDIFF() | DATEDIFF() | MONTHS_BETWEEN |


PostgreSQL
```sql
SELECT NOW() + INTERVAL '5 day';
```
SQL Server
```sql
SELECT DATEADD(day,5,GETDATE());
```
MySQL
```sql
SELECT DATE_ADD(NOW(),INTERVAL 5 DAY);
```
Oracle
```sql
SELECT SYSDATE+5
FROM dual;
```

## Конкатенація

| СУБД       | Оператор | Альтернативний варіант            |
| ---------- | -------- | --------------------------------- |
| PostgreSQL | `\|\|`   | `CONCAT()`                        |
| SQL Server | `+`      | `CONCAT()` (з SQL Server 2012)    |
| MySQL      |          | `CONCAT()`                        |
| Oracle     | `\|\|`   | `CONCAT()` (лише для двох рядків) |

PostgreSQL
```sql
SELECT 'Hello' || ' World';
```
або
```sql
SELECT CONCAT('Hello', ' World');
```

SQL Server
```sql
SELECT 'Hello' + ' World';
```
або
```sql
SELECT CONCAT('Hello', ' World');
```

MySQL
```sql
SELECT CONCAT('Hello', ' World');
```
> [!NOTE]
> Примітка: оператор `+` у MySQL не використовується для конкатенації. Він виконує арифметичне додавання.

Oracle
```sql
SELECT 'Hello' || ' World'
FROM dual;
```
або
```sql
SELECT CONCAT('Hello', ' World')
FROM dual;
```
> [!NOTE]
> Примітка: функція CONCAT() в Oracle приймає лише два аргументи, тоді як оператор || можна використовувати для з'єднання будь-якої кількості рядків.

## IF
| PostgreSQL | SQL Server | MySQL | Oracle |
| ---------- | ---------- | ----- | ------ |
| CASE       | IF         | IF    | CASE   |

## UPSERT
| PostgreSQL  | SQL Server | MySQL            | Oracle |
| ----------- | ---------- | ---------------- | ------ |
| ON CONFLICT | MERGE      | ON DUPLICATE KEY | MERGE  |


## Видалення таблиці

В усіх однаково
```sql
DROP TABLE users;
```

## Оновлення

В усіх практично однаково
```sql
UPDATE users
SET age=30
WHERE id=1;
```

## Видалення

В усіх однаково

```sql
DELETE
FROM users
WHERE id=1;
```

## Створення індексу

Практично однаково
```sql
CREATE INDEX idx_name
ON users(name);
```

## Створення користувача
PostgreSQL
```sql
CREATE USER admin
WITH PASSWORD '123456';
```

SQL Server
```sql
CREATE LOGIN admin
WITH PASSWORD='Password123!';
```

MySQL
```sql
CREATE USER 'admin'
IDENTIFIED BY '123456';
```

Oracle
```sql
CREATE USER admin
IDENTIFIED BY password;
```

## Надання прав
PostgreSQL
```sql
GRANT ALL PRIVILEGES
ON DATABASE shop
TO admin;
```

SQL Server
```sql
ALTER SERVER ROLE sysadmin
ADD MEMBER admin;
```

MySQL
```sql
GRANT ALL
ON shop.*
TO admin;
```

Oracle
```sql
GRANT CONNECT,
RESOURCE
TO admin;
```

## Backup
| PostgreSQL | SQL Server      | MySQL     | Oracle |
| ---------- | --------------- | --------- | ------ |
| pg_dump    | BACKUP DATABASE | mysqldump | RMAN   |

## Restore
| PostgreSQL | SQL Server       | MySQL | Oracle |
| ---------- | ---------------- | ----- | ------ |
| psql       | RESTORE DATABASE | mysql | RMAN   |

## CLI-клієнти
| PostgreSQL | SQL Server | MySQL | Oracle  |
| ---------- | ---------- | ----- | ------- |
| psql       | sqlcmd     | mysql | sqlplus |

## Служби Linux
| PostgreSQL | SQL Server   | MySQL | Oracle |
| ---------- | ------------ | ----- | ------ |
| postgresql | mssql-server | mysql | oracle |

## Конфігураційні файли
| PostgreSQL      | SQL Server | MySQL  | Oracle                |
| --------------- | ---------- | ------ | --------------------- |
| postgresql.conf | mssql.conf | my.cnf | init.ora / spfile.ora |

## Каталоги даних
| PostgreSQL          | SQL Server     | MySQL          | Oracle              |
| ------------------- | -------------- | -------------- | ------------------- |
| /var/lib/postgresql | /var/opt/mssql | /var/lib/mysql | /u01/app/oracle/... |

## Найпоширеніші системні команди Linux
| Дія     | PostgreSQL                    | SQL Server                      | MySQL                    |
| ------- | ----------------------------- | ------------------------------- | ------------------------ |
| Запуск  | `systemctl start postgresql`  | `systemctl start mssql-server`  | `systemctl start mysql`  |
| Зупинка | `systemctl stop postgresql`   | `systemctl stop mssql-server`   | `systemctl stop mysql`   |
| Статус  | `systemctl status postgresql` | `systemctl status mssql-server` | `systemctl status mysql` |
| Логи    | `journalctl -u postgresql`    | `journalctl -u mssql-server`    | `journalctl -u mysql`    |
| Порт    | `ss -tulnp \| grep 5432`      | `ss -tulnp \| grep 1433`        | `ss -tulnp \| grep 3306` |

## Що найчастіше запитують на співбесідах

Якщо говорити про співбесіди на позиції Linux Administrator, DevOps або Backend Developer, то найважливіше знати такі відмінності між СКБД:

| Тема                  | PostgreSQL            | SQL Server                 | MySQL                     | Oracle                     |
| --------------------- | --------------------- | -------------------------- | ------------------------- | -------------------------- |
| Клієнтська консоль    | `psql`                | `sqlcmd`                   | `mysql`                   | `sqlplus`                  |
| Порт за замовчуванням | **5432**              | **1433**                   | **3306**                  | **1521**                   |
| Автоінкремент         | `SERIAL` / `IDENTITY` | `IDENTITY`                 | `AUTO_INCREMENT`          | `IDENTITY` або `SEQUENCE`  |
| Обмеження вибірки     | `LIMIT`               | `TOP` або `OFFSET … FETCH` | `LIMIT`                   | `FETCH FIRST`              |
| Поточна дата/час      | `NOW()`               | `GETDATE()`                | `NOW()`                   | `SYSDATE` / `SYSTIMESTAMP` |
| UPSERT                | `ON CONFLICT`         | `MERGE`                    | `ON DUPLICATE KEY UPDATE` | `MERGE`                    |
| Резервне копіювання   | `pg_dump`             | `BACKUP DATABASE`          | `mysqldump`               | `RMAN`                     |
| Конфігурація          | `postgresql.conf`     | `mssql.conf`               | `my.cnf`                  | `init.ora` / `spfile.ora`  |
| Служба Linux          | `postgresql`          | `mssql-server`             | `mysql`                   | `oracle`                   |


Саме ці відмінності найчастіше використовуються на практиці та є типовими питаннями під час технічних співбесід.