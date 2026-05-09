# Коментарі в MySQL — докладна довідка

## Що таке коментарі

Коментарі в MySQL — це текст, який:

- ігнорується SQL-парсером
- використовується для пояснень
- документування коду
- тимчасового вимкнення частини SQL
- сумісності між версіями MySQL

## Для чого використовуються коментарі

✔️ пояснення SQL-коду  
✔️ документація  
✔️ debugging  
✔️ тимчасове вимкнення SQL  
✔️ version-specific code  
✔️ hints/optimization  

## Типи коментарів у MySQL

MySQL підтримує:

| Тип              | Синтаксис       |
| ---------------- | --------------- |
| Однорядковий     | `-- comment`    |
| Однорядковий     | `# comment`     |
| Багаторядковий   | `/* comment */` |
| Version-specific | `/*! ... */`    |


### 1. `--` Однорядковий коментар
Синтаксис
```sql
-- comment
```

⚠️ Важливий нюанс MySQL

Після `--` ОБОВ'ЯЗКОВО:

- пробіл
- tab
- newline

✔️ Правильно
```sql
-- це коментар
SELECT * FROM users;
```
❌ Неправильно
```sql
--comment
```

Чому

MySQL може сприйняти це як оператор.

### 2. `#` Коментар
Синтаксис
```bash
# comment
```

✔️ Особливості
- MySQL-specific
- працює як shell-style comment

Приклад
```bash
# Backup users table
SELECT * FROM users;
```

⚠️ Важливо

`#` може НЕ підтримуватись:

- іншими СУБД
- деякими SQL tools

### 3. `/* ... */` Багаторядковий коментар
Синтаксис
```sql
/* comment */
```

🔹 Однорядковий варіант
```sql
SELECT /* test */ * FROM users;
```

🔹 Багаторядковий варіант
```sql
/*
  Multi-line comment
  for documentation
*/
SELECT * FROM users;
```

✔️ Переваги
- стандарт SQL
- portable
- можна коментувати великі блоки

🔹 Коментування SQL-коду
```sql
/*
SELECT * FROM users;
DELETE FROM users;
*/
```

⚠️ Вкладені коментарі
- MySQL НЕ підтримує nested comments.

❌ Неправильно
```sql
/*
   comment
   /* nested */
*/
```

## Version-Specific Comments (ДУЖЕ ВАЖЛИВО 🔥)
📌 Що це таке

Спеціальні коментарі:
```sql
/*! SQL */
```

Особливість

👉 для MySQL це НЕ просто коментар.

🔹 Як це працює

Інші SQL-системи:
- ігнорують

MySQL:
- виконує код всередині

🔹 Приклад
```sql
/*! SELECT * FROM users */;
```

Для MySQL

👉 виконається:
```sql
SELECT * FROM users;
```

Для PostgreSQL

👉 буде звичайним коментарем.

🔹 Для чого використовується

✔️ сумісність  
✔️ dump-файли  
✔️ підтримка різних версій MySQL  

🔹 Version-specific syntax  
Синтаксис
```sql
/*!version SQL */
```

🔹 Приклад
```sql
/*!80000 ALTER TABLE users ADD COLUMN age INT */;
```

📌 Що означає 80000

👉 MySQL version:
- 8.0.0

🔹 Як MySQL це читає
| Версія MySQL | Виконання |
| ------------ | --------- |
| 8.0.0+       | ✔️         |
| нижче 8.0.0  | ❌         |

🔹 Формат version number
```
major minor patch
```

Приклади
| Версія | Код     |
| ------ | ------- |
| 5.7.0  | `50700` |
| 8.0.0  | `80000` |
| 8.4.1  | `80401` |

🔹 Реальний приклад з mysqldump

У dump-файлах часто є:
```sql
/*!40101 SET NAMES utf8 */;
```

Що це означає

👉 виконати лише якщо:
- MySQL >= 4.1.1

🔹 Ще приклади
```sql
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40111 SET SQL_NOTES=0 */;
```

🔹 Навіщо mysqldump це робить

👉 щоб:

- dump працював на старих версіях
- не ламався на інших СУБД

## Optimizer Hints

MySQL також використовує коментарі для optimizer hints.

🔹 Старий синтаксис
```sql
SELECT /*! STRAIGHT_JOIN */ *
FROM users;
```

🔹 Новий синтаксис (MySQL 8)
```sql
SELECT /*+ MAX_EXECUTION_TIME(1000) */ *
FROM users;
```

📌 Що це

Підказки optimizer-у:
- як виконувати запит

## Коментарі у CREATE TABLE
COMMENT для таблиці
```sql
CREATE TABLE users (
  id INT
) COMMENT='Users table';
```

🔹 COMMENT для колонок
```sql
CREATE TABLE users (
  id INT COMMENT 'User ID',
  name VARCHAR(100) COMMENT 'User name'
);
```

🔹 Перегляд comments
```sql
SHOW FULL COLUMNS FROM users;
```

🔹 INFORMATION_SCHEMA
```sql
SELECT COLUMN_NAME, COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME='users';
```

## Часті помилки
| Помилка                        | Причина           |
| ------------------------------ | ----------------- |
| `--comment`                    | немає пробілу     |
| nested comments                | не підтримуються  |
| `#` в іншій СУБД               | може не працювати |
| version comment не виконується | версія замала     |

## Best Practices

✔️ використовувати `/* ... */` для portability  
✔️ `--` для коротких пояснень  
✔️ version-comments у dump/scripts  
✔️ COMMENT для документації схем  

## Порівняння типів коментарів
| Тип      | Portable | Multi-line | MySQL-specific |
| -------- | -------- | ---------- | -------------- |
| `-- `    | ✔️        | ❌          | ❌              |
| `#`      | ❌        | ❌          | ✔️              |
| `/* */`  | ✔️        | ✔️          | ❌              |
| `/*! */` | ❌        | ✔️          | ✔️              |


## Висновок

👉 MySQL підтримує:

- стандартні SQL-коментарі
- MySQL-specific comments
- version-specific execution

👉 Найважливіша особливість:
```sql
/*! version SQL */
```
👉 це:

- коментар для інших СУБД
- але executable code для MySQL.