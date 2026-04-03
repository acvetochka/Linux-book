# sed <!-- omit in toc -->

## 1. Що таке sed

`sed` — це потоковий редактор тексту, який:
- читає вхід рядок за рядком
- застосовує команди
- виводить результат (за замовчуванням)

👉 працює без відкриття файлу “як редактор”, а як конвеєр

## 2. Загальний синтаксис
```bash
sed [OPTIONS] 'SCRIPT' file
```
або:
```bash
command | sed 'SCRIPT'
```

## 3. Як працює sed (дуже важливо)

Для кожного рядка:
1. читає рядок → pattern space
2. застосовує команди
3. виводить (якщо не вимкнено)

## 4. Важливі поняття
| Термін        | Значення                  |
| ------------- | ------------------------- |
| pattern space | поточний рядок            |
| hold space    | буфер (додаткова пам’ять) |

## 5. Опції sed
Вхідний файл (example.txt)

Будемо використовувати один файл для всіх прикладів:
```
1  apple
2  banana
3  apple pie
4  cherry
5  apple
```

### 5.1. -n і команда p
📌 Команда
```bash
sed -n 'p' example.txt
```
🔍 Що відбувається
- `-n` → вимикає автоматичний вивід
- `p` → команда "print" (надрукувати рядок)

👉 sed читає КОЖЕН рядок і:
- не виводить його автоматично
- але команда p каже: "виведи"

✅ Результат
```
1  apple
2  banana
3  apple pie
4  cherry
5  apple
```

🧠 Висновок

👉 без -n:
```bash
sed 'p'
```
виведе кожен рядок 2 рази ❗

📌 Приклад
```bash
sed 'p' example.txt
```
👉 результат:
```
1  apple
1  apple
2  banana
2  banana
...
```

### 5.2. s — заміна
📌 Команда
```bash
sed 's/apple/orange/' example.txt
```

🔍 Що відбувається

👉 у кожному рядку:
- шукає перше входження apple
- замінює на orange

✅ Результат
```
1  orange
2  banana
3  orange pie
4  cherry
5  orange
```

❗ Важливо

👉 тільки перше входження в рядку

**З `g` - всі входження**
```bash
sed 's/apple/orange/g' example.txt
```
👉 якщо було б:
```
apple apple
```
👉 стало б:
```
orange orange
```

🔸 Флаги
| Флаг   | Значення      |
| ------ | ------------- |
| g      | всі входження |
| i      | ignore case   |
| p      | надрукувати   |
| w file | запис у файл  |

Далі докладніше про використання флагів s

📄 Вхідний файл (example.txt)
```
foo foo
Foo foo
path=/home/user
no match here
```

- Загальний вигляд `s///`
  ```bash
  sed 's/ЩО_ШУКАЄМО/НА_ЩО_ЗАМІНИТИ/ФЛАГИ'
  ```

- Флаг `g` — всі входження  
  📌 Команда
  ```bash
  sed 's/foo/bar/g' example.txt
  ```
  🔍 Що відбувається

  👉 у кожному рядку:
  - шукає foo
  - замінює ВСІ входження

  ✅ Результат
  ```
  bar bar
  Foo bar
  path=/home/user
  no match here
  ```

  ❗ Без g
  ```bash
  sed 's/foo/bar/' example.txt
  ```
  👉 результат:
  ```
  bar foo
  Foo bar
  path=/home/user
  no match here
  ```
  ✔️ тільки перше входження

- Флаг `i` — ignore case  
  📌 Команда
  ```bash
  sed 's/foo/bar/i' example.txt
  ```
  🔍 Що відбувається

  👉 foo, Foo, FOO — всі підходять  
  👉 але замінюється тільки перше входження в рядку

  ✅ Результат
  ```
  bar foo
  bar foo
  path=/home/user
  no match here
  ```

  📌 З `gi`
  ```bash
  sed 's/foo/bar/gi'
  ````

  👉 результат:
  ```
  bar bar
  bar bar
  path=/home/user
  no match here
  ```

- Флаг `p` — друкувати тільки змінені  
  📌 Команда
  ```bash
  sed -n 's/foo/bar/p' example.txt
  ```
  🔍 Що відбувається
  - -n → вимикає авто-вивід
  - p → друкує тільки якщо була заміна

  ✅ Результат
  ```
  bar foo
  Foo bar
  ```
  👉 тільки рядки, де було foo

- Флаг `w file` — запис у файл  
  📌 Команда
  ```bash
  sed 's/foo/bar/w out.txt' example.txt
  ```
  🔍 Що відбувається

  👉 якщо рядок змінився:
  - записується у out.txt

  📄 stdout
  ```
  bar foo
  Foo bar
  path=/home/user
  no match here
  ```
  📄 out.txt
  ```
  bar foo
  Foo bar
  ```
- Заміна конкретного входження  
  📌 Команда
  ```bash
  sed 's/foo/bar/2' example.txt
  ```
  🔍 Що відбувається

  👉 замінює друге входження в рядку

  ✅ Результат
  ```
  foo bar
  Foo foo
  path=/home/user
  no match here
  ```
- Комбінація флагів  
  📌 Команда
  ```bash
  sed -n 's/foo/bar/gp' example.txt
  ```
  🔍 Що відбувається
  - g → всі входження
  - p → друкує тільки змінені
  
  ✅ Результат
  ```
  bar bar
  Foo bar
  ```

- Роздільник `/`  
  📌 Стандарт
  ```bash
  sed 's/foo/bar/'
  ```
  👉 / — розділяє:
  - що шукати
  - на що замінити
  - флаги

  ❗ Проблема
  ```bash
  sed 's//home/user//root/'
  ```
  👉 ❌ ламається (бо багато /)

  ✅ Рішення — інший роздільник  
  - 🔹 Варіант 1: `|`
    ```bash 
    sed 's|/home/user|/root|'
    ```
  - 🔹 Варіант 2: `#`
    ```bash
    sed 's#/home/user#/root#'
    ```
  - 🔹 Варіант 3: будь-який символ
    ```bash
    sed 's@foo@bar@'
    ```
  🧠 Як це працює

  👉 перший символ після s = роздільник
  ```
  s|A|B|
  s#A#B#
  s@A@B@
  ```
  📌 Приклад з файлом
  ```bash
  sed 's|/home/user|/root|' example.txt
  ```
  ✅ Результат
  ```
  foo foo
  Foo foo
  path=/root
  no match here
  ```
  ⚠️ Коли використовувати інший роздільник

  👉 коли є:

  - шляхи (/home/...)
  - URL
  - JSON

- Висновок по опції s
  🔹 Флаги s///
  | Флаг     | Що робить           |
  | -------- | ------------------- |
  | `g`      | всі входження       |
  | `i`      | ignore case         |
  | `p`      | друкує змінені      |
  | `w file` | запис у файл        |
  | `2`, `3` | конкретне входження |

  🔹 Роздільник

  ✔️ `/` — стандарт  
  ✔️ можна будь-який символ  
  ✔️ дуже важливо для шляхів  

### 5.3. d — видалення
📌 Команда
```bash
sed '/apple/d' example.txt
```
🔍 Що відбувається

👉 sed:
- знаходить рядки з apple
- видаляє їх (не виводить)

✅ Результат
```
2  banana
4  cherry
```

### 5.4. Адресація (номер рядка)
📌 Команда
```bash
sed '2p' example.txt
```

🔍 Що відбувається
- sed автоматично виводить всі рядки
- 2p → ще раз друкує 2-й рядок

✅ Результат
```
1  apple
2  banana
2  banana
3  apple pie
4  cherry
5  apple
```

📌 Правильний варіант
```bash
sed -n '2p' example.txt
```

✅ Результат
```
2  banana
```

🔹 Діапазон
```bash
sed -n '2,4p' example.txt
```

✅ Результат
```
banana
abc
foo foo
```
🔹 По regex
```bash
sed -n '/foo/p'
```
👉 тільки рядки з foo

🔹 Комбінація
```bash
sed -n '2,/foo/p'
```
👉 від рядка 2 до першого foo



### 5.5. a\ — додати ПІСЛЯ
📌 Команда
```bash
sed '2a\NEW LINE' example.txt
```

🔍 Що відбувається

👉 після 2-го рядка додається новий

✅ Результат
```
1  apple
2  banana
NEW LINE
3  apple pie
4  cherry
5  apple
```

### 5.6. i\ — додати ПЕРЕД
📌 Команда
```bash
sed '2i\NEW LINE' example.txt
```

🔍 Що відбувається

👉 перед 2-м рядком вставляється

✅ Результат
```
1  apple
NEW LINE
2  banana
3  apple pie
4  cherry
5  apple
```

### 5.7. c\ — замінити рядок
📌 Команда
```bash
sed '2c\REPLACED' example.txt
```

🔍 Що відбувається

👉 2-й рядок ПОВНІСТЮ замінюється

✅ Результат
```
1  apple
REPLACED
3  apple pie
4  cherry
5  apple
```

### 5.8. y — транслітерація
📌 Команда
```bash
sed 'y/abc/ABC/' example.txt
```
🔍 Що відбувається

👉 кожен символ:
- a → A
- b → B
- c → C

✅ Результат
```
1  Apple
2  BAnAnA
3  Apple pie
4  Cherry
5  Apple
```

### 5.9. = — номер рядка
📌 Команда
```bash
sed '=' example.txt
```

🔍 Що відбувається

👉 перед кожним рядком додається номер

✅ Результат
```
1
1  apple
2
2  banana
3
3  apple pie
...
```

### 5.10. q — вихід
📌 Команда
```bash
sed '3q' example.txt
```
🔍 Що відбувається

👉 sed:
- читає до 3 рядка
- зупиняється

✅ Результат
```
1  apple
2  banana
3  apple pie
```

### 5.11. Заперечення !
📌 Команда
```bash
sed '/apple/!d' example.txt
```
🔍 Що відбувається

👉 !d:
- видаляє все, що НЕ apple

✅ Результат
```
1  apple
3  apple pie
5  apple
```

### 5.12. Комбінація команд
📌 Команда
```bash
sed -n '/apple/p' example.txt
```
🔍 Що відбувається
- `-n` → не виводити все
- `/apple/` → тільки рядки з apple
- `p` → надрукувати їх

✅ Результат
```
1  apple
3  apple pie
5  apple
```

### 5.13. -e — кілька команд

Вхідний файл (example.txt)
```
apple apple
banana
abc
foo foo
line1
line2
```

📌 Команда
```bash
sed -e 's/a/A/' -e 's/b/B/' example.txt
```
🔍 Що відбувається

Для кожного рядка:
- `s/a/A/` → першу a → A
- `s/b/B/` → першу b → B

✅ Результат
```
Apple apple
Banana
ABc
foo foo
line1
line2
```

🧠 Важливо

👉 команди виконуються послідовно

### 5.14. -f — скрипт з файлу
📌 script.sed
```
s/a/A/
s/b/B/
```
📌 Команда
```bash
sed -f script.sed example.txt
```

✅ Результат
```
Apple apple
Banana
ABc
foo foo
line1
line2
```

🧠 Це те саме що -e, але з файлу

### 5.15. -i — редагування файлу
📌 Команда
```bash
sed -i 's/apple/orange/g' example.txt
```
🔍 Що відбувається

👉 файл перезаписується

📄 Було:
```
apple apple
banana
```
📄 Стало:
```
orange orange
banana
```

❗ Нічого не виводиться — змінюється файл

### 5.16. -i.bak — з бекапом
📌 Команда
```bash
sed -i.bak 's/apple/orange/g' example.txt
```
🔍 Що відбувається
- `example.txt` → змінений
- `example.txt.bak` → старий файл

### 5.17. -E — ERE
📌 Команда
```bash
sed -E 's/a+/X/' example.txt
```
🔍 Що відбувається

👉 a+ = одна або більше a

📄 "banana" →
```
bXnana
```
(перша група a замінена)

### 5.18. l — показ спецсимволів
📌 Команда
```bash
sed -n 'l' example.txt
```
🔍 Що робить

👉 показує:
- `$` в кінці рядка
- `\t`, `\n` і т.д.

✅ Результат
```
apple apple$
banana$
abc$
foo foo$
line1$
line2$
```

### 5.19. Буфери (найскладніше)
**🔹 h — копія в hold**
```bash
sed 'h' example.txt
```
👉 кожен рядок копіюється в hold space  
👉 але НЕ видно (нічого не змінюється)

**🔹 H — додати в hold**
```bash
sed 'H' example.txt
```
👉 всі рядки накопичуються в hold  
(не видно без g/G)

**🔹 g — замінити pattern на hold**
```bash
sed '1h;2g' example.txt
```
🔍 Що відбувається
- рядок 1 → зберегли (h)
- рядок 2 → замінили на рядок 1

✅ Результат
```
apple apple
apple apple
abc
foo foo
line1
line2
```

**🔹 G — додати hold до рядка**
```bash
sed '1h;2G' example.txt
```

✅ Результат
```
apple apple
banana
apple apple
abc
foo foo
line1
line2
```
**🔹 x — swap**
```bash
sed '1h;2x' example.txt
```
👉 міняє місцями hold і pattern

### 5.20. Управління потоком
📌 Команда
```bash
sed ':a; s/foo/bar/; ta' example.txt
```

🔍 Що відбувається
- `:a` → мітка
- `s/foo/bar/` → заміна
- `t a` → якщо була заміна → повторити

👉 замінює всі foo навіть без g

📄 foo foo →
```
bar bar
```

### 5.21. Мультистрокові
**🔹 N**
```bash
sed 'N' example.txt
```

🔍 Що відбувається

👉 об'єднує рядки:
```bash
apple apple\nbanana
```

**🔹 P**

👉 друкує тільки перший рядок з pattern space

**🔹 D**

👉 видаляє частину до \n



## 6. Практичні приклади
🔹 Видалити пусті рядки
```bash
sed '/^$/d'
```
🔹 Видалити пробіли
```bash
sed 's/^ *//;s/ *$//'
```
🔹 Заміна IP
```bash
sed -E 's/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/IP/g'
```
🔹 Об'єднання рядків
```bash
sed ':a;N;$!ba;s/\n/ /g'
```

## 7. Важливі нюанси
### ❗ delimiter можна змінити
```bash
sed 's|/home|/root|'
```

### ❗ лапки
```bash
sed 's/$HOME/test/'
```
vs
```bash
sed "s/$HOME/test/"
```

### ❗ GNU vs POSIX  
-E vs -r

не всі sed однакові
> одна і та сама команда може працювати по-різному на різних системах

| Система | sed             |
| ------- | --------------- |
| Linux   | GNU sed         |
| macOS   | BSD sed         |
| BusyBox | мінімальний sed |


**📌 GNU sed (Linux)**
```bash
sed -r 's/a+/X/'
sed -E 's/a+/X/'
```
✔️ обидва працюють
✔️ означають: включити ERE

**📌 BSD sed (macOS)**
```bash
sed -E 's/a+/X/'
```
✔️ працює
```bash
sed -r 's/a+/X/'
```
❌ не працює

| Ключ | Де працює              |
| ---- | ---------------------- |
| `-E` | всюди (POSIX-сумісний) |
| `-r` | тільки GNU sed         |

✔️ для скриптів краще POSIX

## Висновок

`sed` — це:

✔️ потужний редактор  
✔️ працює потоково  
✔️ має:  
- адресацію
- команди
- буфери
- логіку