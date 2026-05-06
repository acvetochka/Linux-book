# SQL 

SQL поділяється на 4 основні групи:

| Категорія | Що робить       |
| --------- | --------------- |
| DDL       | структура БД    |
| DML       | робота з даними |
| DCL       | права доступу   |
| TCL       | транзакції      |


## DDL (Data Definition Language) — структура БД
| Команда                   | Опис                                  | Приклад                                                       |
| ------------------------- | ------------------------------------- | ------------------------------------------------------------- |
| `CREATE DATABASE`         | Створює нову базу даних               | `CREATE DATABASE mydb;`                                       |
| `DROP DATABASE`           | Видаляє базу даних                    | `DROP DATABASE mydb;`                                         |
| `USE`                     | Вибір бази даних                      | `USE mydb;`                                                   |
| `CREATE TABLE`            | Створює таблицю                       | `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100));` |
| `DROP TABLE`              | Видаляє таблицю                       | `DROP TABLE users;`                                           |
| `ALTER TABLE ADD`         | Додає колонку                         | `ALTER TABLE users ADD age INT;`                              |
| `ALTER TABLE DROP COLUMN` | Видаляє колонку                       | `ALTER TABLE users DROP COLUMN age;`                          |
| `ALTER TABLE MODIFY`      | Змінює тип колонки                    | `ALTER TABLE users MODIFY name VARCHAR(200);`                 |
| `TRUNCATE TABLE`          | Очищає таблицю (швидко, без rollback) | `TRUNCATE TABLE users;`                                       |

## DML (Data Manipulation Language) — робота з даними
| Команда       | Опис           | Приклад                                     |
| ------------- | -------------- | ------------------------------------------- |
| `SELECT`      | Отримує дані   | `SELECT * FROM users;`                      |
| `INSERT INTO` | Додає записи   | `INSERT INTO users (name) VALUES ('Anna');` |
| `UPDATE`      | Оновлює записи | `UPDATE users SET name='Maria' WHERE id=1;` |
| `DELETE`      | Видаляє записи | `DELETE FROM users WHERE id=1;`             |

### 🔍 DML — розширення SELECT
| Конструкція | Опис              | Приклад                               |
| ----------- | ----------------- | ------------------------------------- |
| `WHERE`     | Фільтрація        | `SELECT * FROM users WHERE age > 18;` |
| `AND / OR`  | Логічні умови     | `WHERE age > 18 AND name='Anna';`     |
| `LIKE`      | Пошук за шаблоном | `WHERE name LIKE 'A%';`               |
| `IN`        | Перелік значень   | `WHERE id IN (1,2,3);`                |
| `BETWEEN`   | Діапазон          | `WHERE age BETWEEN 18 AND 30;`        |
| `ORDER BY`  | Сортування        | `ORDER BY age DESC;`                  |
| `LIMIT`     | Обмеження рядків  | `LIMIT 10;`                           |

### 🔗 JOIN
| Тип          | Опис                     | Приклад                                           |
| ------------ | ------------------------ | ------------------------------------------------- |
| `INNER JOIN` | Тільки співпадаючі рядки | `SELECT * FROM u JOIN o ON u.id=o.user_id;`       |
| `LEFT JOIN`  | Всі зліва + співпадіння  | `SELECT * FROM u LEFT JOIN o ON u.id=o.user_id;`  |
| `RIGHT JOIN` | Всі справа + співпадіння | `SELECT * FROM u RIGHT JOIN o ON u.id=o.user_id;` |

### 📊 Агрегація
| Функція   | Опис             | Приклад                           |
| --------- | ---------------- | --------------------------------- |
| `COUNT()` | Кількість рядків | `SELECT COUNT(*) FROM users;`     |
| `SUM()`   | Сума             | `SELECT SUM(balance) FROM users;` |
| `AVG()`   | Середнє          | `SELECT AVG(age) FROM users;`     |
| `MAX()`   | Максимум         | `SELECT MAX(age) FROM users;`     |
| `MIN()`   | Мінімум          | `SELECT MIN(age) FROM users;`     |

### 📦 GROUP BY / HAVING
| Конструкція | Опис                    | Приклад                                         |
| ----------- | ----------------------- | ----------------------------------------------- |
| `GROUP BY`  | Групує дані             | `SELECT age, COUNT(*) FROM users GROUP BY age;` |
| `HAVING`    | Фільтр після групування | `HAVING COUNT(*) > 1;`                          |

### 🔁 Підзапити
| Тип      | Опис                   | Приклад                                                         |
| -------- | ---------------------- | --------------------------------------------------------------- |
| Subquery | Запит всередині запиту | `SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);` |

## DCL (Data Control Language) — доступ
| Команда            | Опис                | Приклад                                                  |
| ------------------ | ------------------- | -------------------------------------------------------- |
| `CREATE USER`      | Створює користувача | `CREATE USER 'user1'@'localhost' IDENTIFIED BY 'pass';`  |
| `GRANT`            | Дає права           | `GRANT ALL PRIVILEGES ON mydb.* TO 'user1'@'localhost';` |
| `REVOKE`           | Забирає права       | `REVOKE SELECT ON mydb.* FROM 'user1'@'localhost';`      |
| `FLUSH PRIVILEGES` | Оновлює права       | `FLUSH PRIVILEGES;`                                      |

## TCL (Transaction Control Language) — транзакції
| Команда             | Опис               | Приклад              |
| ------------------- | ------------------ | -------------------- |
| `START TRANSACTION` | Початок транзакції | `START TRANSACTION;` |
| `COMMIT`            | Зберігає зміни     | `COMMIT;`            |
| `ROLLBACK`          | Скасовує зміни     | `ROLLBACK;`          |
| `SAVEPOINT`         | Точка відкату      | `SAVEPOINT sp1;`     |

## Додатково
### 📐 Constraints
| Тип           | Опис             | Приклад                                      |
| ------------- | ---------------- | -------------------------------------------- |
| `PRIMARY KEY` | Унікальний ключ  | `id INT PRIMARY KEY`                         |
| `FOREIGN KEY` | Зв’язок таблиць  | `FOREIGN KEY (user_id) REFERENCES users(id)` |
| `UNIQUE`      | Унікальність     | `email VARCHAR(100) UNIQUE`                  |
| `NOT NULL`    | Обов’язкове поле | `name VARCHAR(100) NOT NULL`                 |

### 🧠 Типи даних
| Тип          | Опис         | Приклад             |
| ------------ | ------------ | ------------------- |
| `INT`        | Цілі числа   | `age INT`           |
| `VARCHAR(n)` | Рядок        | `name VARCHAR(100)` |
| `TEXT`       | Довгий текст | `description TEXT`  |
| `DATE`       | Дата         | `DATE`              |
| `TIMESTAMP`  | Дата+час     | `TIMESTAMP`         |
| `BOOLEAN`    | Логічний тип | `BOOLEAN`           |

🔥 Висновок

👉 Якщо коротко:

- DDL → структура
- DML → дані
- DCL → доступ
- TCL → транзакції