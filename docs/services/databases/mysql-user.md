# Користувачі і привілеї в MySQL — докладна довідка

## Що таке користувач у MySQL

У MySQL користувач — це обліковий запис, через який:

- відбувається підключення до БД
- визначаються права доступу
- контролюється безпека

## Як MySQL ідентифікує користувача

У MySQL користувач =
```sql
'user'@'host'
```

📌 Приклади
| Користувач               | Що означає           |
| ------------------------ | -------------------- |
| `'admin'@'localhost'`    | тільки локально      |
| `'admin'@'192.168.1.10'` | лише з цього IP      |
| `'admin'@'%'`            | з будь-якого хоста ⚠️ |

## Важливо ⚠️
```sql
'user'@'localhost'
```
і
```sql
'user'@'%'
```
👉 це ДВА різні користувачі.

## Де зберігаються користувачі

У системній БД:
```sql
mysql
```
Таблиця:
```sql
mysql.user
```

## Перегляд користувачів

```sql
SELECT user, host FROM mysql.user;
```

## Створення користувача
Базовий синтаксис
```sql
CREATE USER 'user1'@'localhost'
IDENTIFIED BY 'StrongPassword';
```

Що означає IDENTIFIED BY
👉 задає пароль користувача.

## Створення користувача для мережі
```sql
CREATE USER 'app'@'192.168.1.%'
IDENTIFIED BY 'password';
```

✔️ `%`

👉 wildcard:
- будь-який IP

## Небезпечний варіант ⚠️
```sql
CREATE USER 'admin'@'%';
```
👉 дозволяє логін звідусіль.

## Видалення користувача
```sql
DROP USER 'user1'@'localhost';
```

## Зміна пароля
Сучасний спосіб
```sql
ALTER USER 'user1'@'localhost'
IDENTIFIED BY 'NewPassword';
```

## Блокування користувача
```sql
ALTER USER 'user1'@'localhost'
ACCOUNT LOCK;
```

## Розблокування
```sql
ALTER USER 'user1'@'localhost'
ACCOUNT UNLOCK;
```

## Привілеї (Privileges)
📌 Що це

Привілеї визначають:

- що користувач може робити
- з якими БД/таблицями

## Типи привілеїв
| Привілей       | Що дозволяє          |
| -------------- | -------------------- |
| SELECT         | читання              |
| INSERT         | додавання            |
| UPDATE         | зміна                |
| DELETE         | видалення            |
| CREATE         | створення            |
| DROP           | видалення таблиць/БД |
| ALTER          | зміна структури      |
| INDEX          | створення індексів   |
| ALL PRIVILEGES | всі права            |

## GRANT — видача прав
Синтаксис
```sql
GRANT privileges
ON database.table
TO 'user'@'host';
```

## Приклади
✔️ Тільки читання
```sql
GRANT SELECT
ON mydb.*
TO 'user1'@'localhost';
```

✔️ Читання + запис
```sql
GRANT SELECT, INSERT, UPDATE
ON mydb.*
TO 'user1'@'localhost';
```

✔️ Всі права на БД
```sql
GRANT ALL PRIVILEGES
ON mydb.*
TO 'admin'@'localhost';
```

✔️ Всі права на все ⚠️
```sql
GRANT ALL PRIVILEGES
ON *.*
TO 'root2'@'%';
```

## Рівні привілеїв
| Рівень   | Приклад      |
| -------- | ------------ |
| Global   | `*.*`        |
| Database | `mydb.*`     |
| Table    | `mydb.users` |
| Column   | окремі поля  |

## Привілеї на таблицю
```sql
GRANT SELECT
ON mydb.users
TO 'user1'@'localhost';
```

## Привілеї на колонки
```sql
GRANT SELECT(name, email)
ON mydb.users
TO 'user1'@'localhost';
```

## REVOKE — забрати права
```sql
REVOKE INSERT, UPDATE
ON mydb.*
FROM 'user1'@'localhost';
```

## SHOW GRANTS
Показати права
```sql
SHOW GRANTS FOR 'user1'@'localhost';
```

## FLUSH PRIVILEGES
```sql
FLUSH PRIVILEGES;
```

📌 Для чого

👉 перезавантажує таблиці привілеїв.

⚠️ Важливо

У сучасному MySQL після:
- CREATE USER
- GRANT

зазвичай НЕ потрібно.

## Root користувач
📌 root
```sql
'root'@'localhost'
```

✔️ Має:
- всі права
- повний контроль

⚠️ Best practice

❌ не використовувати root у додатках.

## Принцип найменших привілеїв

👉 користувач має отримувати:
- тільки ті права
- які реально потрібні

❌ Погано
```sql
GRANT ALL PRIVILEGES ON *.* TO 'app'@'%';
```

✔️ Добре
```sql
GRANT SELECT, INSERT, UPDATE
ON shop.orders
TO 'app'@'192.168.1.%';
```

## Ролі (Roles)
📌 Що це

Роль = набір привілеїв.

🔹  Створення ролі
```sql
CREATE ROLE 'readonly';
```
🔹 Видача прав ролі
```sql
GRANT SELECT
ON mydb.*
TO 'readonly';
```
🔹 Призначення ролі користувачу
```sql
GRANT 'readonly'
TO 'user1'@'localhost';
```

🔹 DEFAULT ROLE
```sql
SET DEFAULT ROLE 'readonly'
TO 'user1'@'localhost';
```

## Аутентифікація
MySQL підтримує:
| Метод                 | Опис             |
| --------------------- | ---------------- |
| mysql_native_password | старий           |
| caching_sha2_password | сучасний         |
| socket auth           | через Linux user |

## Перевірка plugin
```sql
SELECT user, host, plugin
FROM mysql.user;
```

## Remote access
1. bind-address
   ```ini
    bind-address = 0.0.0.0
    ```
2. Firewall
   ```bash
    firewall-cmd --add-service=mysql --permanent
    firewall-cmd --reload
    ```
3. Користувач
    ```sql
    CREATE USER 'app'@'%';
    ```

## Часті помилки
| Помилка                  | Причина               |
| ------------------------ | --------------------- |
| Access denied            | неправильний host     |
| Access denied            | немає прав            |
| Cannot connect           | bind-address/firewall |
| Login works locally only | `'user'@'localhost'`  |

## Типові схеми
🧩 Backend app
```sql
CREATE USER 'app'@'192.168.1.%'
IDENTIFIED BY 'pass';

GRANT SELECT, INSERT, UPDATE, DELETE
ON shop.*
TO 'app'@'192.168.1.%';
```

📊 Readonly analyst
```sql
GRANT SELECT
ON analytics.*
TO 'analyst'@'%';
```

## Best Practices

✔️ не використовувати root  
✔️ мінімальні привілеї  
✔️ складні паролі  
✔️ обмеження по host  
✔️ roles замість копіпасти GRANT  

## Висновок

👉 Система користувачів MySQL базується на:
```sql
'user'@'host'
```
👉 Привілеї:

- можуть бути дуже гнучкими
- видаються через GRANT
- забираються через REVOKE

👉 Головна ідея:

- безпека
- контроль доступу
- ізоляція користувачів