# Синтаксис SQL у MySQL — правила і основи

## Загальна структура SQL-запиту

Будь-який запит у MySQL має приблизно таку форму:
```sql
SELECT column1, column2
FROM table_name
WHERE condition
GROUP BY column
HAVING condition
ORDER BY column
LIMIT n;
```
👉 Важливо:

- порядок ключових слів має значення
- не всі частини обов’язкові

## Базовий синтаксис команд
📦 CREATE TABLE
```sql
CREATE TABLE table_name (
  column1 datatype constraints,
  column2 datatype constraints
);
```
➕ INSERT
```sql
INSERT INTO table_name (column1, column2)
VALUES (value1, value2);
```
🔍 SELECT
```sql
SELECT column1, column2
FROM table_name
WHERE condition;
```
✏️ UPDATE
```sql
UPDATE table_name
SET column1 = value1
WHERE condition;
```
❌ DELETE
```sql
DELETE FROM table_name
WHERE condition;
```

## Правила синтаксису
1. 🔤 Регістр (Upper / Lower case)

    👉 У MySQL:

    - SQL ключові слова нечутливі до регістру
    - але назви таблиць можуть бути чутливі (особливо в Linux ⚠️)
    ```sql
    SELECT * FROM users;
    select * from users;
    ```
    ✔️ обидва працюють

    👉 Рекомендація:
    ```sql
    SELECT * FROM users;
    ```
    - ключові слова → UPPERCASE
    - таблиці/поля → lowercase

2. 📛 Імена (naming rules)

    ✔️ дозволено:

    - users
    - user_data
    - order_items

    ❌ небажано:

    - User
    - select
    - table

    👉 якщо треба:
    ```sql
    SELECT * FROM `order`;
    ```
    (бектики `)

3. 🧱 Розділення команд (`;`)

    👉 `;` — це кінець SQL-запиту
    ```sql
    SELECT * FROM users;
    SELECT * FROM orders;
    ```
    👉 Без `;`:

    - у CLI запит не виконається
    - у коді (Node.js, Python) — залежить від драйвера

4. 📏 Форматування (best practice)

    ❌ погано:
    ```sql
    SELECT * FROM users WHERE age>18;
    ```
    ✔️ добре:
    ```sql
    SELECT *
    FROM users
    WHERE age > 18;
    ```

5. 🧩 Коментарі
    ```sql
    -- однорядковий коментар

    # теж працює в MySQL

    /* багаторядковий
      коментар */
    ```
6. 🔗 Об'єднання запитів  
    UNION
    ```sql
    SELECT name FROM users
    UNION
    SELECT name FROM admins;
    ```

    👉 видаляє дублікати

    UNION ALL
    ```sql
    SELECT name FROM users
    UNION ALL
    SELECT name FROM admins;
    ```
    👉 залишає дублікати (швидше)

7. 🔄 Псевдоніми (alias)
   ```sql
    SELECT name AS username
    FROM users;
    ```
    або:
    ```sql
    SELECT u.name
    FROM users u;
    ```
8. 🔠 Лапки
    | Тип       | Використання        |
    | --------- | ------------------- |
    | `' '`     | рядки               |
    | `" "`     | (іноді) рядки       |
    | `` ` ` `` | імена таблиць/полів |
    ```sql
    SELECT * FROM users WHERE name = 'Anna';
    ```

9. ⚠️ NULL
    ```sql
    SELECT * FROM users WHERE email IS NULL;
    ```
    ❌ НЕ працює:
    ```sql
    WHERE email = NULL
    ```

## Виконання кількох запитів
```sql
SELECT * FROM users;
SELECT * FROM orders;
```
👉 У CLI:
- виконуються послідовно

👉 У коді:
- часто потрібно дозволити multi-queries

## Відміна запиту (дуже важливо ⚠️)
 1. У MySQL CLI  

    Якщо ще НЕ виконаний:
    ```
    Ctrl + C
    ```
    👉 очищає поточний запит

    або
    ```sql
    \c
    ```

    👉 очищає поточний (незавершений) запит у буфері клієнта

 2. Якщо запит вже виконується

    В іншому терміналі:
    ```sql
    SHOW PROCESSLIST;
    ```
    Знайти Id і:
    ```bash
    KILL 123;
    ```
 3. В транзакції
    ```sql
    ROLLBACK;
    ```
    👉 скасовує всі зміни

## Особливості MySQL
⚡ 1. AUTO_INCREMENT
```sql
id INT AUTO_INCREMENT PRIMARY KEY
```
⚡ 2. LIMIT
```sql
SELECT * FROM users LIMIT 10;
```
⚡ 3. IF NOT EXISTS
```sql
CREATE TABLE IF NOT EXISTS users (...);
```

## Типовий порядок виконання (логічний)

👉 MySQL виконує не зверху вниз:

1. FROM
2. JOIN
3. WHERE
4. GROUP BY
5. HAVING
6. SELECT
7. ORDER BY
8. LIMIT


## Класифікація SQL

👉 SQL поділяється на 4 основні групи:

| Категорія | Що робить       |
| --------- | --------------- |
| DDL       | структура БД    |
| DML       | робота з даними |
| DCL       | права доступу   |
| TCL       | транзакції      |

### 1. DDL — структура бази
📦 Бази даних
```sql
CREATE DATABASE mydb;
DROP DATABASE mydb;
```

📋 Таблиці
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

✏️ Зміна таблиці
```sql
ALTER TABLE users ADD age INT;
ALTER TABLE users DROP COLUMN age;
```

❌ Видалення
```sql
DROP TABLE users;
```

### 2. DML — робота з даними
➕ INSERT
```sql
INSERT INTO users (name, email)
VALUES ('Anna', 'anna@mail.com');
```

🔍 SELECT (основа всього)
```sql
SELECT name, email FROM users;
SELECT * FROM users;
```

✏️ UPDATE
```sql
UPDATE users
SET name = 'Maria'
WHERE id = 1;
```

❌ DELETE
```sql
DELETE FROM users WHERE id = 1;
```
---
#### WHERE — фільтрація
```sql
SELECT * FROM users WHERE age > 18;
```

Оператори:
```sql
=, !=, >, <, >=, <=
```

Логіка
```sql
WHERE age > 18 AND name = 'Anna'
WHERE age > 18 OR name = 'Anna'
```

LIKE
```sql
WHERE name LIKE 'A%'
```

IN
```sql
WHERE id IN (1,2,3)
```

BETWEEN
```sql
WHERE age BETWEEN 18 AND 30
```

---
#### Сортування і обмеження
```sql
ORDER BY age DESC;
LIMIT 10;
```

---
#### Агрегація
```sql
SELECT COUNT(*), AVG(age), MAX(age) FROM users;
```

GROUP BY
```sql
SELECT age, COUNT(*)
FROM users
GROUP BY age;
```

HAVING
```sql
SELECT age, COUNT(*)
FROM users
GROUP BY age
HAVING COUNT(*) > 1;
```
---

#### JOIN (дуже важливо 🔥)
INNER JOIN
```sql
SELECT u.name, o.total
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

LEFT JOIN
```sql
SELECT u.name, o.total
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

RIGHT JOIN
```sql
SELECT u.name, o.total
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```
---

#### Підзапити
```sql
SELECT name
FROM users
WHERE id IN (
  SELECT user_id FROM orders
);
```

---
#### Індекси
```sql
CREATE INDEX idx_name ON users(name);
```
---


#### Обмеження (constraints)
```sql
PRIMARY KEY
FOREIGN KEY
UNIQUE
NOT NULL
```

Приклад:
```sql
CREATE TABLE orders (
  id INT PRIMARY KEY,
  user_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 3. DCL — права
```sql
GRANT SELECT ON mydb.* TO 'user';
REVOKE SELECT ON mydb.* FROM 'user';
```
```sql
CREATE USER 'user1'@'localhost' IDENTIFIED BY 'pass';

GRANT ALL PRIVILEGES ON mydb.* TO 'user1'@'localhost';

REVOKE SELECT ON mydb.* FROM 'user1'@'localhost';

FLUSH PRIVILEGES;
```

### 4. TCL — транзакції
```sql
START TRANSACTION;

UPDATE users SET balance = balance - 100 WHERE id = 1;
UPDATE users SET balance = balance + 100 WHERE id = 2;

COMMIT;
```

ROLLBACK
```sql
ROLLBACK;
```

## Типи даних
🔢 Числа
```sql
INT, BIGINT, DECIMAL
```
🔤 Текст
```sql
VARCHAR, TEXT
```
📅 Дата
```sql
DATE, DATETIME, TIMESTAMP
```
🧠 Boolean
```sql
BOOLEAN (TINYINT)
```

## View (представлення)
```sql
CREATE VIEW user_view AS
SELECT name FROM users;
```

`View` (представлення) — це віртуальна таблиця, яка створюється на основі SQL-запиту.

👉 Вона не зберігає дані, а лише зберігає запит.

🧠 Як це працює
```sql
CREATE VIEW user_names AS
SELECT name FROM users;
```
Тепер:
```sql
SELECT * FROM user_names;
```
👉 фактично виконується:
```sql
SELECT name FROM users;
```

🎯 Для чого використовується

 1. Спрощення складних запитів
    ```sql
    SELECT u.name, o.total
    FROM users u
    JOIN orders o ON u.id = o.user_id;
    ```
    👉 можна заховати у View і використовувати як таблицю

2. Безпека

    👉 можна дати доступ до View, але не до таблиці 

3. Абстракція

    👉 змінюється структура таблиці — View залишається тим самим

⚠️ Важливо
- дані не копіюються
- кожен SELECT → виконує запит заново
- іноді не можна робити INSERT/UPDATE через View

🧩 Простими словами

👉 View = “збережений SELECT як таблиця”

## Stored Procedures

```sql
DELIMITER //
CREATE PROCEDURE GetUsers()
BEGIN
  SELECT * FROM users;
END //

DELIMITER ;
```

`Stored Procedure` — це збережений SQL-скрипт, який виконується на сервері.

🧠 Як це працює
```sql
CREATE PROCEDURE GetUsers()
BEGIN
  SELECT * FROM users;
END;
```
Виклик:
```sql
CALL GetUsers();
``` 

🎯 Для чого використовується
1. Повторне використання

    👉 не писати той самий SQL багато разів

2. Логіка на стороні БД
    ```sql
    IF ... THEN ...
    ```
    👉 можна писати умови, цикли

3. Продуктивність

    👉 виконується на сервері → менше мережевого трафіку

4. Безпека

    👉 можна дати доступ до процедури, а не до таблиць

⚠️ Важливо
- складніше дебажити
- прив’язка до конкретної БД (MySQL)
- не всі люблять використовувати (часто логіку переносять у backend)

🧩 Простими словами

👉 Stored Procedure = “функція всередині бази”

## Тригери

`Trigger` (тригер) — це автоматична дія, яка виконується при зміні даних.

```sql
CREATE TRIGGER before_insert_user
BEFORE INSERT ON users
FOR EACH ROW
SET NEW.created_at = NOW();
```

👉 кожен раз при INSERT:
> автоматично ставиться дата

🎯 Для чого використовується
1. Автоматизація
   - дата створення
   - логування

2. Валідація

    👉 перевірка даних перед записом

3. Аудит

    👉 запис змін у лог-таблицю

🔄 Типи тригерів
| Тип           | Коли виконується |
| ------------- | ---------------- |
| BEFORE INSERT | перед вставкою   |
| AFTER INSERT  | після            |
| BEFORE UPDATE | перед оновленням |
| AFTER DELETE  | після видалення  |

⚠️ Важливо
- виконуються автоматично (іноді “магія” 😄)
- можуть ускладнювати дебаг
- можуть впливати на продуктивність

🧩 Простими словами

👉 Trigger = “автоматична реакція БД на зміну”

## Нормалізація
`1NF` — атомарність  
`2NF` — залежність від PK  
`3NF` — без транзитивних залежностей  

`Нормалізація` — це процес правильного розбиття даних на таблиці, щоб:

- не було дублювання
- не було помилок
- структура була логічною

🎯 Для чого потрібно
1. Уникнення дублювання

    ❌ погано:

    | user | email  |
    | ---- | ------ |
    | Anna | a@mail |
    | Anna | a@mail |

2. Узгодженість даних

    👉 змінив в одному місці — змінилось всюди

3. Логічна структура

    👉 дані розбиті по сутностях

### Нормальні форми  

#### 1️⃣ Перша нормальна форма (1NF)

👉 всі поля атомарні

❌:
```
phones: 123,456
```
✔️:
- окремі записи

#### 2️⃣ Друга нормальна форма (2NF)

👉 всі поля залежать від PRIMARY KEY

#### 3️⃣ Третя нормальна форма (3NF)

👉 немає залежностей між неключовими полями

🧠 Приклад

❌ одна таблиця:
```
users(id, name, city_name)
```
✔️ нормалізовано:
```
users(id, name, city_id)
cities(id, city_name)
```

⚠️ Важливо

👉 іноді роблять денормалізацію (для швидкості)

Простими словами

👉 Нормалізація = “розкласти дані правильно, без дублювання”

## Коротке порівняння
| Що               | Що це                     |
| ---------------- | ------------------------- |
| View             | віртуальна таблиця        |
| Stored Procedure | функція в БД              |
| Trigger          | автоматична дія           |
| Нормалізація     | правильна структура даних |


## Часті помилки

❌ забули `WHERE`:
```sql
UPDATE users SET name='test';
```

❌ неправильний NULL:
```sql
WHERE email = NULL
```

❌ немає `;` у CLI

## Висновок

👉 SQL у MySQL:

- має строгий порядок
- нечутливий до регістру (але Linux — ні)
- використовує ; як завершення
- підтримує об’єднання запитів і транзакції