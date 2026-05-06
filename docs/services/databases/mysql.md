# MySQL — докладна довідка

## Що таке MySQL

`MySQL` — це реляційна СУБД (RDBMS), яка працює за моделлю клієнт–сервер.

👉 Основні задачі:

- зберігання даних
- обробка SQL-запитів
- керування доступом

## Архітектура MySQL
Основні компоненти:
1. MySQL Server (mysqld)
- основний демон
- обробляє запити
2. SQL Layer
- парсинг запитів
- оптимізація
- кешування
3. Storage Engines
- фізичне зберігання даних

👉 Найважливіший:
> InnoDB (за замовчуванням)

## Принцип роботи
> Client → (socket/TCP) → mysqld → SQL Layer → Storage Engine → Disk

## Встановлення
🟥 RedHat (RHEL / Rocky / Alma)
```bash
sudo dnf install mysql-server
sudo systemctl enable mysqld
sudo systemctl start mysqld
```

🟦 Debian / Ubuntu
```bash
sudo apt update
sudo apt install mysql-server
```

## Сервіс (systemd)
| Дистрибутив | Сервіс   |
| ----------- | -------- |
| RedHat      | `mysqld` |
| Debian      | `mysql`  |

```bash
systemctl status mysqld
```

## Початкове налаштування
```bash
sudo mysql_secure_installation
```
👉 Що робить:

- пароль root
- видаляє test DB
- забороняє remote root

## Підключення
```sql
mysql -u root -p
```

## Основні концепції
📦 База даних
```sql
CREATE DATABASE mydb;
USE mydb;
```

📋 Таблиця
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100)
);
```

## CRUD операції
➕ INSERT
```sql
INSERT INTO users (name, email)
VALUES ('Anna', 'anna@mail.com');
```

🔍 SELECT
```sql
SELECT * FROM users;
```

✏️ UPDATE
```sql
UPDATE users SET name='Maria' WHERE id=1;
```

❌ DELETE
```sql
DELETE FROM users WHERE id=1;
```

🔹 WHERE + оператори
```sql
SELECT * FROM users WHERE id > 5;
```
Оператори:

- `=`
- `!=`
- `> <`
- `LIKE`
- `IN`
- `BETWEEN`


## JOIN
```sql
SELECT u.name, o.total
FROM users u
JOIN orders o ON u.id = o.user_id;
```
Типи:

- INNER
- LEFT
- RIGHT

## Індекси
```sql
CREATE INDEX idx_email ON users(email);
```
👉 Прискорюють SELECT

## Користувачі і права
➕ Створення користувача
```sql
CREATE USER 'user1'@'localhost' IDENTIFIED BY 'pass';
```
🔐 Права
```sql
GRANT ALL PRIVILEGES ON mydb.* TO 'user1'@'localhost';
FLUSH PRIVILEGES;
```

## Конфігурація (my.cnf)
📁 Шляхи
| RedHat        | Debian              |
| ------------- | ------------------- |
| `/etc/my.cnf` | `/etc/mysql/my.cnf` |

⚡ Основні параметри
```ini
[mysqld]
bind-address = 0.0.0.0
max_connections = 200
innodb_buffer_pool_size = 1G
```

## Логи
| Тип       | Файл                  |
| --------- | --------------------- |
| error log | `/var/log/mysqld.log` |
| slow log  | налаштовується        |

```ini
Slow query log
slow_query_log = 1
long_query_time = 2
```

## Мережа
Порт:
```bash
3306
```

Відкрити порт (RedHat)
```bash
firewall-cmd --add-service=mysql --permanent
firewall-cmd --reload
```

## Перевірка
```bash
ss -tulnp | grep 3306
```

## Бекапи
mysqldump
```bash
mysqldump -u root -p mydb > backup.sql
```

Відновлення
```bash
mysql -u root -p mydb < backup.sql
```

## Реплікація
- master → replica
- binlog
- GTID

## Часті проблеми
❌ Не підключається
- порт закритий
- bind-address

❌ Access denied
- неправильні права

❌ Не стартує
- помилка в my.cnf

## Коли використовувати MySQL

✔️ Web-проекти  
✔️ CRUD-додатки  
✔️ API  

## Порівняння
- MySQL → стандарт
- Percona → оптимізований
- MariaDB → альтернативний форк

## Висновок

👉 MySQL = база для:

- backend
- DevOps
- системного адміністрування