# PostgreSQL на Linux — детальна довідка

## 1. Що таке PostgreSQL

`PostgreSQL` — це потужна об'єктно-реляційна система керування базами даних (Object-Relational Database Management System, ORDBMS) з відкритим вихідним кодом.

Вона використовується для:
- веб-додатків;
- корпоративних систем;
- фінансових сервісів;
- GIS-систем;
- аналітики;
- мікросервісної архітектури;
- зберігання великих обсягів даних.

PostgreSQL підтримує:

- SQL стандарт ANSI;
- ACID-транзакції;
- MVCC (Multi-Version Concurrency Control);
- JSON/JSONB;
- XML;
- Full Text Search;
- Stored Procedures;
- Triggers;
- Views;
- Materialized Views;
- Extensions.

## 2. Архітектура PostgreSQL

Після запуску працює кілька процесів.
```
postgres (master process)
│
├── background writer
├── checkpointer
├── wal writer
├── autovacuum launcher
├── logical replication launcher
└── backend process (для кожного клієнта окремий)
```

### Основні процеси
- `postmaster`

    Головний процес.

    Відповідає за:

    - запуск сервера;
    - відкриття сокетів;
    - створення дочірніх процесів;
    - моніторинг.

- `Backend process`

    Створюється для кожного нового підключення.

    Наприклад:
    ```
    Client 1
            \
            backend PID 5321

    Client 2
            \
            backend PID 5335

    Client 3
            \
            backend PID 5340
    ```

- `Background Writer`

    Періодично записує "брудні" сторінки пам'яті на диск.

- `Checkpointer`

    Створює контрольні точки (checkpoint).

- `WAL Writer`

  Записує журнали транзакцій.

- `Autovacuum`

  Очищає "мертві" записи.

## 3. Основні каталоги

У Linux дані PostgreSQL зазвичай знаходяться тут.

- Ubuntu/Debian
    ```bash
    /var/lib/postgresql/
    ```
- RHEL/CentOS
    ```bash
    /var/lib/pgsql/
    ```
Всередині:
```
base/
global/
pg_wal/
pg_stat/
pg_multixact/
pg_xact/
pg_tblspc/
```


- `base/`

    Тут знаходяться всі бази даних.
    ```
    base/
        16384/
        16385/
        16390/
    ```
    Кожна директорія — окрема БД.

- `global/`

  Системні таблиці.

- `pg_wal/`

  Write Ahead Log.

  Найважливіша директорія.

  Містить журнали транзакцій.

- `pg_xact/`

  Інформація про транзакції.

- `pg_tblspc/`

  Символічні посилання на tablespace.

## 4. Основні конфігураційні файли
```
postgresql.conf
pg_hba.conf
pg_ident.conf
```

- `postgresql.conf`

  Головний файл конфігурації.

  Наприклад:
  ```ini
  listen_addresses = '*'
  port = 5432
  max_connections = 100
  shared_buffers = 256MB
  work_mem = 4MB
  maintenance_work_mem = 64MB
  wal_level = replica
  ```

- `pg_hba.conf`

  Визначає правила авторизації.

  Наприклад
  ```
  local   all             postgres             peer

  host    all             all      127.0.0.1/32    md5

  host    all             all      ::1/128         md5

  host    mydb            appuser  192.168.1.0/24  scram-sha-256
  ```

- `pg_ident.conf`

  Мапінг Linux-користувачів на PostgreSQL.

## 5. Встановлення

- Ubuntu
  ```bash
  sudo apt update

  sudo apt install postgresql
  ```

- RHEL
  ```bash
  sudo dnf install postgresql-server
  ```

Перевірка
```bash
psql --version
```

6. Сервіс systemd

Запуск
```bash
sudo systemctl start postgresql
```
Зупинка
```bash
sudo systemctl stop postgresql
```
Перезапуск
```bash
sudo systemctl restart postgresql
```
Автозапуск
```bash
sudo systemctl enable postgresql
```
Перевірка
```bash
systemctl status postgresql
```

## 7. Користувач postgres

Після встановлення створюється системний користувач
```
postgres
```
Перехід
```bash
sudo -i -u postgres
```
або
```bash
sudo su - postgres
```

## 8. Підключення

Локально
```bash
psql
```
До конкретної БД
```bash
psql mydb
```
Від іншого користувача
```bash
psql -U myuser
```
Віддалено
```bash
psql -h 192.168.1.100 -U admin
```

## 9. Основні команди psql

Список баз
```psql
\l
```
Список таблиць
```psql
\dt
```
Опис таблиці
```
\d users
```
Перемикання БД
```
\c mydb
```
Вийти
```
\q
```
Список ролей
```
\du
```
Список схем
```
\dn
```

## 10. Створення користувача
```sql
CREATE USER testuser
WITH PASSWORD 'password';
```
Надати права
```sql
GRANT ALL PRIVILEGES
ON DATABASE mydb
TO testuser;
```

## 11. Створення бази
```sql
CREATE DATABASE shop;
```

## 12. Таблиці
```sql
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    name TEXT,
    age INTEGER
);
```

## 13. CRUD

Insert
```sql
INSERT INTO users(name, age)
VALUES ('John', 25);
```
Select
```sql
SELECT *
FROM users;
```
Update
```sql
UPDATE users
SET age=30
WHERE id=1;
```
Delete
```sql
DELETE
FROM users
WHERE id=1;
```

## 14. Типи даних

Числа
```
SMALLINT
INTEGER
BIGINT
NUMERIC
REAL
DOUBLE PRECISION
```


Рядки
```
CHAR
VARCHAR
TEXT
```

Дата
```
DATE
TIME
TIMESTAMP
TIMESTAMPTZ
INTERVAL
```

Логічний
```
BOOLEAN
```

JSON
```
JSON
JSONB
```

UUID
```
UUID
```

Масив
```
INTEGER[]
TEXT[]
```

## 15. Індекси

Створення
```sql
CREATE INDEX idx_users_name
ON users(name);
```

Унікальний
```sql
CREATE UNIQUE INDEX
idx_email
ON users(email);
```

## 16. Транзакції
```sql
BEGIN;

UPDATE accounts
SET balance=balance-100
WHERE id=1;

UPDATE accounts
SET balance=balance+100
WHERE id=2;

COMMIT;
```
Скасування
```sql
ROLLBACK;
```

## 17. MVCC

PostgreSQL використовує Multi Version Concurrency Control.

Переваги:

- читання не блокує запис;
- запис не блокує читання;
- мінімум блокувань.

## 18. VACUUM

Після `UPDATE` або `DELETE` старі записи не видаляються фізично.

VACUUM:

- очищає "мертві" рядки;
- звільняє простір;
- оновлює статистику.

Команди:
```sql
VACUUM;
```
```sql
VACUUM ANALYZE;
```
```sql
VACUUM FULL;
```

## 19. ANALYZE

Оновлює статистику для оптимізатора запитів.
```sql
ANALYZE;
```

## 20. WAL

Write Ahead Logging.

Алгоритм:
```
UPDATE

↓

Запис у WAL

↓

COMMIT

↓

Запис даних
```
Якщо сервер аварійно вимкнеться:
```
Recovery

↓

читання WAL

↓

відновлення
```

## 21. Backup

Логічний
```bash
pg_dump mydb > backup.sql
```
Відновлення
```bash
psql mydb < backup.sql
```
Усі бази
```bash
pg_dumpall > all.sql
```

## 22. Моніторинг

Активні запити
```sql
SELECT *
FROM pg_stat_activity;
```
Блокування
```sql
SELECT *
FROM pg_locks;
```
Розмір БД
```sql
SELECT pg_size_pretty(
pg_database_size('mydb'));
```

## 23. Логи

Ubuntu
```bash
/var/log/postgresql/
```
або
```bash
journalctl -u postgresql
```

## 24. Безпека

Рекомендується:

- використовувати `scram-sha-256` замість `md5`;
- обмежити `listen_addresses` (наприклад, localhost або конкретні IP);
- налаштувати `pg_hba.conf` лише для довірених мереж;
- застосовувати `SSL/TLS` для віддалених підключень;
- використовувати ролі з мінімально необхідними правами (principle of least privilege);
- регулярно оновлювати PostgreSQL до підтримуваної версії.
  
## 25. Корисні команди Linux для PostgreSQL

Перевірити процеси:
```bash
ps aux | grep postgres
```
Прослуховування порту:
```bash
ss -tulnp | grep 5432
```
Використання диска:
```bash
du -sh /var/lib/postgresql
```
Перегляд журналу:
```bash
journalctl -u postgresql -f
```
Перевірка відкритих файлів процесу:
```bash
lsof -p <PID>
```

## 26. Типова структура використання
```
Клієнт (psql, pgAdmin, застосунок)
          │
          ▼
TCP 5432 / Unix Socket
          │
          ▼
Postmaster
          │
          ▼
Backend Process
          │
          ▼
Query Parser
          │
          ▼
Planner / Optimizer
          │
          ▼
Executor
          │
          ▼
Shared Buffers
          │
          ▼
WAL
          │
          ▼
Data Files (base/)
```

## 27. Найважливіші команди для адміністратора
| Завдання                | Команда                             |
| ----------------------- | ----------------------------------- |
| Перевірити версію       | `psql --version`                    |
| Підключитися            | `psql`                              |
| Список БД               | `\l`                                |
| Список таблиць          | `\dt`                               |
| Опис таблиці            | `\d table_name`                     |
| Вихід із `psql`         | `\q`                                |
| Запуск сервісу          | `sudo systemctl start postgresql`   |
| Перезапуск              | `sudo systemctl restart postgresql` |
| Статус                  | `systemctl status postgresql`       |
| Перегляд логів          | `journalctl -u postgresql`          |
| Резервне копіювання     | `pg_dump dbname > backup.sql`       |
| Відновлення             | `psql dbname < backup.sql`          |
| Перегляд активних сесій | `SELECT * FROM pg_stat_activity;`   |
| Перегляд блокувань      | `SELECT * FROM pg_locks;`           |


## 28. PostgreSQL у сучасній розробці

PostgreSQL є однією з найпопулярніших СКБД у сучасних Linux-середовищах. Вона широко використовується разом із фреймворками та інструментами, такими як Python + FastAPI, Django, Node.js + Express, NestJS, Java Spring Boot, Go, а також із ORM-бібліотеками на кшталт Prisma, SQLAlchemy та TypeORM. У контейнеризованих середовищах PostgreSQL часто запускають через Docker або Kubernetes, а для адміністрування використовують інструменти pgAdmin, Adminer або консольну утиліту `psql`.

Знання PostgreSQL на рівні встановлення, налаштування, резервного копіювання, оптимізації запитів, роботи з індексами, транзакціями, WAL, VACUUM та системою ролей є важливою компетенцією для Linux-адміністраторів, DevOps-інженерів, Backend-розробників і Database Administrator (DBA).