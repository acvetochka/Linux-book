# SQL Server на Linux — детальна довідка
## 1. Що таке SQL Server

`Microsoft SQL Server` — це комерційна реляційна система керування базами даних (Relational Database Management System, RDBMS), розроблена компанією Microsoft.

Починаючи з версії SQL Server 2017, сервер офіційно підтримує Linux.

SQL Server використовується для:

- корпоративних інформаційних систем;
- ERP та CRM;
- банківських систем;
- бізнес-аналітики (BI);
- Data Warehouse;
- веб-додатків;
- фінансових систем;
- державних інформаційних систем.

## 2. Основні редакції SQL Server
| Редакція   | Призначення                                 |
| ---------- | ------------------------------------------- |
| Express    | Безкоштовна, для невеликих проєктів         |
| Developer  | Безкоштовна, повний функціонал для розробки |
| Standard   | Для середнього бізнесу                      |
| Enterprise | Повний функціонал для великих компаній      |
| Evaluation | Тестова версія на 180 днів                  |


## 3. Архітектура SQL Server

Після запуску працює один основний процес:
```
sqlservr
│
├── SQL OS
├── Buffer Manager
├── Query Processor
├── Storage Engine
├── Lock Manager
├── Log Writer
├── Lazy Writer
└── Checkpoint
```
На Linux процес можна побачити:
```bash
ps aux | grep sqlservr
```

- `SQL OS`

  Внутрішній шар операційної системи SQL Server.

  Відповідає за:

  - керування потоками;
  - планування задач;
  - використання пам'яті;
  - взаємодію з Linux.

- `Query Processor`

  Обробляє SQL-запити.

  Етапи:
  ```
  SQL

  ↓

  Parser

  ↓

  Optimizer

  ↓

  Execution Plan

  ↓

  Executor
  ```
- `Storage Engine`

  Відповідає за:

  - читання файлів;
  - запис сторінок;
  - індекси;
  - блокування;
  - транзакції.

- `Buffer Manager`

  Керує кешем сторінок.

  Якщо потрібна сторінка вже є в пам'яті, диск не читається повторно.

- `Log Writer`

  Записує транзакції у журнал.

- `Lazy Writer`

  Очищає Buffer Pool.

- `Checkpoint`

  Періодично записує змінені сторінки на диск.

## 4. Основні файли бази

SQL Server використовує кілька типів файлів.

- `MDF`

  Основний файл бази.
  ```bash
  database.mdf
  ```

- `NDF`

  Додатковий файл.
  ```bash
  database.ndf
  ```

- `LDF`

  Журнал транзакцій.
  ```bash
  database.ldf
  ```

## 5. Каталоги Linux

За замовчуванням
```bash
/var/opt/mssql/
```

Основні директорії
```bash
/var/opt/mssql/

data/

log/

backup/

secrets/
```

- `data/` - Містить MDF/NDF/LDF.

- `log/` - Логи SQL Server.

- `backup/` - Рекомендоване місце резервних копій.

- `secrets/` - Ключі шифрування.

## 6. Встановлення

Ubuntu
```bash
curl https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -

sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list)"

sudo apt update

sudo apt install mssql-server
```

Після встановлення
```bash
sudo /opt/mssql/bin/mssql-conf setup
```
Потрібно:

- вибрати редакцію;
- погодитися з ліцензією;
- задати пароль адміністратора.

## 7. systemd

Запуск
```bash
sudo systemctl start mssql-server
```
Зупинка
```bash
sudo systemctl stop mssql-server
```
Перезапуск
```bash
sudo systemctl restart mssql-server
```
Автозапуск
```bash
sudo systemctl enable mssql-server
```
Перевірка
```bash
systemctl status mssql-server
```

## 8. Перевірка порту

За замовчуванням
> 1433

Перевірка
```bash
ss -tulnp | grep 1433
```

## 9. SQLCMD

Консольний клієнт SQL Server.

Підключення
```bash
sqlcmd -S localhost -U sa
```
Віддалене
```bash
sqlcmd -S 192.168.1.100 -U sa
```
Вийти
```sql
QUIT
```

## 10. Основні команди SQLCMD

Список баз
```sql
SELECT name
FROM sys.databases;
GO
```

Використати БД
```sql
USE Shop;
GO
```

Список таблиць
```sql
SELECT *
FROM INFORMATION_SCHEMA.TABLES;
GO
```

## 11. Створення бази
```sql
CREATE DATABASE Shop;
GO
```

## 12. Створення таблиці
```sql
CREATE TABLE Users
(
    Id INT IDENTITY PRIMARY KEY,
    Name NVARCHAR(100),
    Age INT
);
GO
```

## 13. CRUD

Insert
```sql
INSERT INTO Users(Name,Age)
VALUES ('John',25);
GO
```

Select
```sql
SELECT *
FROM Users;
GO
```

Update
```sql
UPDATE Users
SET Age=30
WHERE Id=1;
GO
```

Delete
```sql
DELETE
FROM Users
WHERE Id=1;
GO
```

## 14. Типи даних

Числа
```
TINYINT
SMALLINT
INT
BIGINT
DECIMAL
NUMERIC
FLOAT
REAL
```

Рядки
```
CHAR
VARCHAR
NCHAR
NVARCHAR
TEXT (застарілий)
```

Дата
```
DATE
TIME
DATETIME
DATETIME2
DATETIMEOFFSET
SMALLDATETIME
```

Інші
```
BIT
UNIQUEIDENTIFIER
XML
VARBINARY
```

## 15. Індекси

Створення
```sql
CREATE INDEX IX_Name
ON Users(Name);
GO
```

Унікальний
```sql
CREATE UNIQUE INDEX IX_Email
ON Users(Email);
GO
```

Clustered
```sql
CREATE CLUSTERED INDEX IX_Id
ON Users(Id);
GO
```
Nonclustered
```sql
CREATE NONCLUSTERED INDEX IX_Name
ON Users(Name);
GO
```

## 16. Транзакції
```sql
BEGIN TRANSACTION;

UPDATE Accounts
SET Balance=Balance-100
WHERE Id=1;

UPDATE Accounts
SET Balance=Balance+100
WHERE Id=2;

COMMIT;
```

Rollback
```sql
ROLLBACK;
```

## 17. Блокування

SQL Server використовує:

- Shared Lock
- Exclusive Lock
- Update Lock
- Intent Lock
- Schema Lock

## 18. Журнал транзакцій

Перед записом даних:
```
UPDATE

↓

Transaction Log

↓

COMMIT

↓

Data Files
```

Це забезпечує відновлення після збою.

## 19. Recovery Models

Simple
- журнал очищається автоматично.

Full
- можливість відновлення до конкретного моменту часу.

Bulk Logged
- оптимізований для масових операцій.

## 20. Backup

Повний
```sql
BACKUP DATABASE Shop
TO DISK='/var/opt/mssql/backup/shop.bak';
GO
```

Диференціальний
```sql
BACKUP DATABASE Shop
TO DISK='/var/opt/mssql/backup/shop_diff.bak'
WITH DIFFERENTIAL;
GO
```

Лог транзакцій
```sql
BACKUP LOG Shop
TO DISK='/var/opt/mssql/backup/shop_log.bak';
GO

```

## 21. Restore
```sql
RESTORE DATABASE Shop
FROM DISK='/var/opt/mssql/backup/shop.bak';
GO
```

## 22. Моніторинг

Список сесій
```sql
SELECT *
FROM sys.dm_exec_sessions;
GO
```

Активні запити
```sql
SELECT *
FROM sys.dm_exec_requests;
GO
```

Розмір БД
```sql
EXEC sp_spaceused;
GO
```

## 23. Логи

Linux
```bash
/var/opt/mssql/log/
```
або
```bash
journalctl -u mssql-server
```

## 24. Безпека

Підтримуються:

- SQL Authentication;
- Windows Authentication (через інтеграцію з доменом, якщо налаштовано);
- Transparent Data Encryption (TDE);
- Always Encrypted;
- Dynamic Data Masking;
- Row-Level Security;
- SSL/TLS.

## 25.  Корисні команди Linux

Процес
```bash
ps aux | grep sqlservr
```
Порт
```bash
ss -tulnp | grep 1433
```
Використання диска
```bash
du -sh /var/opt/mssql
```
Перегляд логів
```bash
journalctl -u mssql-server -f
```
Відкриті файли
```bash
lsof -p <PID>
```

## 26. Типова схема роботи
```
Клієнт
 (sqlcmd, Azure Data Studio, застосунок)
          │
          ▼
TCP 1433
          │
          ▼
SQL Server Engine
          │
          ▼
Parser
          │
          ▼
Optimizer
          │
          ▼
Execution Plan
          │
          ▼
Storage Engine
          │
          ▼
Buffer Pool
          │
          ▼
Transaction Log
          │
          ▼
MDF / NDF
```

## 27. Корисні системні представлення (DMV)

Dynamic Management Views (DMV) дозволяють адміністратору аналізувати стан сервера.

Найпоширеніші:

| Представлення             | Призначення                  |
| ------------------------- | ---------------------------- |
| `sys.databases`           | Список баз даних             |
| `sys.tables`              | Таблиці поточної бази        |
| `sys.indexes`             | Індекси                      |
| `sys.dm_exec_sessions`    | Активні сесії                |
| `sys.dm_exec_requests`    | Виконувані запити            |
| `sys.dm_tran_locks`       | Поточні блокування           |
| `sys.dm_os_wait_stats`    | Статистика очікувань         |
| `sys.dm_exec_query_stats` | Статистика виконання запитів |

## 28. Збережені процедури, функції та тригери

Stored Procedure
```sql
CREATE PROCEDURE GetUsers
AS
BEGIN
    SELECT * FROM Users;
END;
GO
```
Виклик:
```sql
EXEC GetUsers;
GO
```

Function
```sql
CREATE FUNCTION dbo.GetAdultAge()
RETURNS INT
AS
BEGIN
    RETURN 18;
END;
GO
```

Trigger
```sql
CREATE TRIGGER trgUsersInsert
ON Users
AFTER INSERT
AS
BEGIN
    PRINT 'New user added';
END;
GO
```

## 29. Оптимізація продуктивності

Для покращення швидкодії рекомендується:

- використовувати індекси лише там, де вони дійсно потрібні;
- регулярно оновлювати статистику (UPDATE STATISTICS);
- перебудовувати або реорганізовувати фрагментовані індекси;
- аналізувати плани виконання запитів (Execution Plans);
- уникати SELECT * у продуктивних системах;
- використовувати параметризовані запити;
- контролювати використання пам'яті та процесора через DMV.

## 30. Найважливіші команди адміністратора
| Завдання                      | Команда                               |
| ----------------------------- | ------------------------------------- |
| Перевірити статус сервісу     | `systemctl status mssql-server`       |
| Запустити сервер              | `sudo systemctl start mssql-server`   |
| Перезапустити сервер          | `sudo systemctl restart mssql-server` |
| Підключитися                  | `sqlcmd -S localhost -U sa`           |
| Список баз даних              | `SELECT name FROM sys.databases;`     |
| Використати базу              | `USE DatabaseName;`                   |
| Створити базу                 | `CREATE DATABASE DatabaseName;`       |
| Створити резервну копію       | `BACKUP DATABASE ...`                 |
| Відновити базу                | `RESTORE DATABASE ...`                |
| Переглянути активні сесії     | `SELECT * FROM sys.dm_exec_sessions;` |
| Переглянути виконувані запити | `SELECT * FROM sys.dm_exec_requests;` |
| Переглянути блокування        | `SELECT * FROM sys.dm_tran_locks;`    |
| Переглянути логи              | `journalctl -u mssql-server`          |

## 31. SQL Server у сучасній інфраструктурі

SQL Server активно використовується в корпоративному середовищі та підтримує роботу на Linux, що робить його придатним для сучасних серверних інфраструктур. Він інтегрується з контейнерними технологіями (Docker, Kubernetes), підтримує високодоступні конфігурації (Always On Availability Groups), реплікацію, шифрування даних і засоби бізнес-аналітики. Для адміністрування застосовують Azure Data Studio, SQL Server Management Studio (SSMS) (на Windows) або консольний клієнт sqlcmd.

Для Linux-адміністраторів і DBA важливо вміти встановлювати та оновлювати SQL Server, керувати сервісом через systemd, виконувати резервне копіювання та відновлення, налаштовувати безпеку, аналізувати продуктивність за допомогою DMV та забезпечувати стабільну роботу сервера в корпоративному середовищі.