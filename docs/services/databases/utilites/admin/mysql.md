# Утиліта mysql — клієнт командного рядка MySQL / Percona / MariaDB

`mysql` — це основна консольна утиліта для адміністрування та роботи з MySQL-серверами.

Через неї можна:

- підключатись до сервера
- виконувати SQL-запити
- адмініструвати користувачів
- працювати з реплікацією
- запускати скрипти
- експортувати результати
- аналізувати БД
- працювати з binlog
- тестувати доступність сервера

Працює з:

- MySQL
- Percona Server
- MariaDB

## 1. Встановлення клієнта
### Debian / Ubuntu
```bash
sudo apt update
sudo apt install mysql-client
```

Для Percona:
```bash
sudo apt install percona-server-client
```

### RHEL / CentOS / Rocky / AlmaLinux
MySQL client
```bash
sudo dnf install mysql
```
Percona client
```bash
sudo dnf install percona-server-client
```

## 2. Перевірка версії
```bash
mysql --version
```
або:
```bash
mysql -V
```
Приклад:
```
mysql  Ver 8.0.36 for Linux on x86_64
```

## 3. Підключення до MySQL
Підключення локально
```bash
mysql -u root -p
```
Після Enter:
```
Enter password:
```

Підключення до конкретної БД
```bash
mysql -u root -p employees
```

Підключення до віддаленого сервера
```bash
mysql -h 192.168.1.10 -u admin -p
```

Підключення через порт
```bash
mysql -h 192.168.1.10 -P 3306 -u admin -p
```

Підключення через socket
```bash
mysql -u root -p --socket=/var/run/mysqld/mysqld.sock
```

Підключення без пароля
```bash
mysql -u root
```

(тільки якщо налаштовано `auth_socket` або `unix_socket`)

## 4. Основні параметри mysql
| Параметр | Значення         |
| -------- | ---------------- |
| `-u`     | користувач       |
| `-p`     | пароль           |
| `-h`     | host             |
| `-P`     | порт             |
| `-S`     | socket           |
| `-D`     | база даних       |
| `-e`     | виконати команду |
| `-N`     | без назв колонок |
| `-B`     | batch mode       |
| `-s`     | silent           |
| `-t`     | табличний формат |
| `-v`     | verbose          |
| `--help` | допомога         |

## 5. Виконання SQL-команди без входу в shell
Перевірка серверу
```bash
mysql -u root -p -e "SELECT VERSION();"
```

Показати БД
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

Створення БД
```bash
mysql -u root -p -e "CREATE DATABASE shop;"
```

## 6. Робота в інтерактивному режимі

Вхід:
```bash
mysql -u root -p
```
Prompt:
```
mysql>
```

## 7. Основні SQL-команди адміністратора
Показати БД
```sql
SHOW DATABASES;
```

Вибрати БД
```sql
USE employees;
```

Показати таблиці
```sql
SHOW TABLES;
```

Показати структуру таблиці
```sql
DESCRIBE users;
```
або:
```sql
SHOW COLUMNS FROM users;
```

Показати CREATE TABLE
```sql
SHOW CREATE TABLE users\G
```

Показати CREATE DATABASE
```sql
SHOW CREATE DATABASE employees\G
```

## 8. Вертикальний вивід \G

Дуже важливо для адміністрування.

Звичайний формат
```sql
SELECT * FROM mysql.user;
```

Вертикальний формат
```sql
SELECT * FROM mysql.user\G
```

Корисно для:

- реплікації
- SHOW VARIABLES
- SHOW PROCESSLIST
- великих таблиць

## 9. Робота з користувачами
Створити користувача
```sql
CREATE USER 'admin'@'localhost'
IDENTIFIED BY 'StrongPass!';
```

Надати права
```sql
GRANT ALL PRIVILEGES
ON shop.*
TO 'admin'@'localhost';
```

Оновити привілеї
```sql
FLUSH PRIVILEGES;
```

Показати права
```sql
SHOW GRANTS FOR 'admin'@'localhost';
```

Видалити користувача
```sql
DROP USER 'admin'@'localhost';
```

## 10. Перегляд процесів
Список процесів
```sql
SHOW PROCESSLIST;
```
Детально
```sql
SHOW FULL PROCESSLIST;
```

Через Linux
```bash
mysqladmin processlist -u root -p
```

## 11. Завершення процесів
```sql
KILL 123;
```
де:
- 123 — ID процесу

## 12. Перегляд змінних сервера
Всі змінні
```sql
SHOW VARIABLES;
```

Вертикально
```sql
SHOW VARIABLES\G
```

Конкретна змінна
```sql
SHOW VARIABLES LIKE 'max_connections';
```

InnoDB
```sql
SHOW VARIABLES LIKE 'innodb%';
```

## 13. Перегляд статусу сервера
Загальний статус
```sql
SHOW STATUS;
```
Threads
```sql
SHOW STATUS LIKE 'Threads%';
```

Connections
```sql
SHOW STATUS LIKE 'Connections';
```

Uptime
```sql
SHOW STATUS LIKE 'Uptime';
```

## 14. Робота з реплікацією
**Source**
```sql
SHOW MASTER STATUS\G
```
Показує:

- binlog файл
- позицію

**Replica**

MySQL 8+
```sql
SHOW REPLICA STATUS\G
```

Старі версії
```sql
SHOW SLAVE STATUS\G
```

| Поле                    | Значення        |
| ----------------------- | --------------- |
| `Replica_IO_Running`    | стан IO thread  |
| `Replica_SQL_Running`   | стан SQL thread |
| `Seconds_Behind_Source` | затримка        |
| `Relay_Master_Log_File` | binlog source   |
| `Exec_Master_Log_Pos`   | позиція         |


## 15. Виконання SQL-файлів
Імпорт дампу
```sql
mysql -u root -p employees < backup.sql
```

Виконання SQL-файлу
```sql
mysql -u root -p < script.sql
```

Усередині mysql
```sql
SOURCE /home/user/script.sql;
```

## 16. Batch mode
Вивід без таблиць
```bash
mysql -u root -p -B -e "SELECT * FROM users;"
```

Без назв колонок
```bash
mysql -u root -p -N -e "SELECT user FROM mysql.user;"
```

Для shell-скриптів
```bash
USERS=$(mysql -N -s -e "SELECT COUNT(*) FROM users")
```

## 17. Silent mode
```bash
mysql -s -N -e "SELECT NOW();"
```

'Silent mode' — це режим “тихого” виводу, коли утиліта mysql прибирає зайву службову інформацію та робить результат більш зручним для:

- shell-скриптів
- automation
- cron
- monitoring
- parsing через `awk`, `grep`, `sed`

Silent mode:

- прибирає табличний формат
- прибирає зайві відступи
- мінімізує службовий текст
- робить output “плоским”

Найчастіше -s використовують разом з -N

**-N = skip column names**
```bash
mysql -s -N -e "SELECT user FROM mysql.user;"
```
Результат:
```
root
mysql.session
admin
```
Тут уже:
- немає назви колонки
- тільки “чисті” дані

**Практична різниця**
-  Без silent
    ```bash 
    mysql -e "SHOW DATABASES;"
    ```
    ```
    +--------------------+
    | Database           |
    +--------------------+
    | mysql              |
    | sys                |
    +--------------------+
    ```
- З `-s -N`
    ```bash
    mysql -s -N -e "SHOW DATABASES;"
    ```
    ```
    mysql
    sys
    ```

## 18. Вивід у файл
Redirect
```bash
mysql -u root -p -e "SELECT * FROM users;" > users.txt
```

CSV-подібний формат
```bash
mysql -B -e "SELECT * FROM users;" > users.tsv
```

Важлива різниця: -s vs -B
| Опція | Що робить                |
| ----- | ------------------------ |
| `-s`  | silent mode              |
| `-B`  | batch/tab-separated mode |
| `-N`  | без назв колонок         |


## 19. Використання pager
Через less
```sql
pager less -S;
```

Вимкнути
```sql
nopager;
```

## 20. History

Файл історії:
```bash
~/.mysql_history
```

## 21. Auto-complete
```bash
mysql --auto-rehash
```
Вимкнути:
```bash
mysql --skip-auto-rehash
```

## 22. Безпечне введення пароля
Небезпечно
```bash
mysql -u root -pMyPassword
```
Пароль видно:

- у history
- через ps aux

Правильно
```bash
mysql -u root -p
```

## 23. Файл конфігурації `.my.cnf`
Створення
```bash
nano ~/.my.cnf
```

Приклад
```ini
[client]
user=root
password=StrongPass
host=localhost
```

Права
```bash
chmod 600 ~/.my.cnf
```

## 24. Підключення через SSL
```bash
mysql \
--ssl-mode=REQUIRED \
-h db.example.com \
-u admin \
-p
```

## 25. Debugging підключення
Перевірка порту
```bash
ss -tulnp | grep 3306
```

Firewall  
iptables
```bash
sudo iptables -L -n
```

Перевірка доступності
```bash
mysqladmin ping -h 192.168.1.10 -u root -p
```

## 26. Корисні системні БД
| БД                   | Призначення          |
| -------------------- | -------------------- |
| `mysql`              | користувачі та права |
| `information_schema` | метадані             |
| `performance_schema` | продуктивність       |
| `sys`                | зручні views         |

	
## 27. information_schema
Таблиці БД
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema='employees';
```

Розмір БД
```sql
SELECT
table_schema,
ROUND(SUM(data_length+index_length)/1024/1024,2) AS MB
FROM information_schema.tables
GROUP BY table_schema;
```

## 28. Корисні команди mysql shell
| Команда        | Значення                |
| -------------- | ----------------------- |
| `\q`           | вихід                   |
| `exit`         | вихід                   |
| `quit`         | вихід                   |
| `\c`           | очистити поточний запит |
| `\G`           | вертикальний вивід      |
| `tee file.txt` | логувати в файл         |
| `notee`        | вимкнути лог            |

## 29. Логування сесії
```sql
tee session.log
```

Усе буде записуватись у файл.

30. Виконання команд Linux
```sql    
system ls
```
або:
```sql
\! ls
```

## 31. Вимір часу виконання
```sql
SELECT SLEEP(2);
```
Після запиту:
```
2 rows in set (2.00 sec)
```

## 32. Аналіз продуктивності
EXPLAIN
```sql
EXPLAIN SELECT * FROM users WHERE email='a@test.com';
```
EXPLAIN ANALYZE
```sql
EXPLAIN ANALYZE
SELECT * FROM users WHERE id=1;
```

## 33. Transaction management
Початок транзакції
```sql
START TRANSACTION;
Commit
COMMIT;
Rollback
ROLLBACK;
```

## 34. Кодування
Перевірка
```sql
SHOW VARIABLES LIKE 'character_set%';
```

UTF8MB4
```sql
SET NAMES utf8mb4;
```

## 35. Часті помилки
### Access denied
```
ERROR 1045 (28000)
```
Причини:

- неправильний пароль
- host не дозволений
- немає прав

### Can't connect
```
ERROR 2002
```
Причини:

- mysql daemon не працює
- неправильний socket
- firewall
- bind-address

## 36. Допомога
Вбудована допомога
```bash
mysql --help
```
Усередині mysql
```sql
help
```

По SQL-команді
```sql
help create user;
```

## 37. Практичний приклад адміністратора
Перевірити сервер
```bash
mysqladmin ping
```

Підключитись
```bash
mysql -u root -p
```

Перевірити реплікацію
```sql
SHOW REPLICA STATUS\G
```
Перевірити процеси
```sql
SHOW FULL PROCESSLIST;
```

Перевірити Connections
```sql
SHOW STATUS LIKE 'Threads_connected';
```

Перевірити InnoDB buffer pool
```sql
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
```

## 38. Найважливіші команди для співбесід
```sql
SHOW DATABASES;
SHOW TABLES;
SHOW PROCESSLIST;
SHOW FULL PROCESSLIST;
SHOW VARIABLES;
SHOW STATUS;
SHOW MASTER STATUS\G
SHOW REPLICA STATUS\G
SHOW GRANTS;
EXPLAIN
```

## 39. Часто використовувані комбінації
Моніторинг
```bash
watch -n 1 "mysql -e 'SHOW STATUS LIKE \"Threads_connected\";'"
```

Швидка перевірка репліки
```bash
mysql -e "SHOW REPLICA STATUS\G" | grep Running
```

Перевірка користувачів
```bash
mysql -e "SELECT user,host FROM mysql.user;"
```