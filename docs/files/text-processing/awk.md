# awk

## 1. Що таке awk

`awk` — це мова обробки тексту, яка:
- читає файл рядок за рядком
- ділить рядок на поля
- дозволяє:
  - фільтрувати
  - обчислювати
  - форматувати

👉 на відміну від grep і sed, це повноцінна мова

## 2. Вхідний файл (data.txt)
```
1 John 25 Developer 3000
2 Anna 30 Designer 3500
3 Mike 22 Developer 2800
4 Sara 27 Manager 4000
5 Tom 35 Developer 3200
```
Колонки:

- `$1` → ID
- `$2` → ім’я
- `$3` → вік
- `$4` → професія
- `$5` → зарплата

## 3. Синтаксис
```bash
awk 'pattern { action }' file
```
🧠 Як це працює

Для кожного рядка:
- перевіряється pattern
- якщо true → виконується action

## 4. Вбудовані змінні
| Змінна   | Значення            |
| -------- | ------------------- |
| `$0`     | весь рядок          |
| `$1..$n` | поля                |
| `NF`     | кількість полів     |
| `NR`     | номер рядка         |
| `FNR`    | номер рядка в файлі |
| `FS`     | роздільник          |
| `OFS`    | роздільник виводу   |


## 5. Базові приклади
🔹 Вивести весь рядок
```bash
awk '{print $0}' data.txt
```
👉 результат = весь файл

🔹 Вивести перше поле
```bash
awk '{print $1}' data.txt
```

👉
```
1
2
3
4
5
```
🔹 Кілька полів
```bash
awk '{print $2, $4}'
```
👉
```
John Developer
Anna Designer
...
```

## 6. Умови (filter)
🔹 За значенням
```bash
awk '$3 > 25' data.txt
```
👉
```
2 Anna 30 Designer 3500
4 Sara 27 Manager 4000
5 Tom 35 Developer 3200
```

🔹 По тексту
```bash
awk '$4 == "Developer"'
```
👉 тільки розробники

## 7. Обчислення
🔹 Додати поле (підвищити зарплату на 10%)
```bash
awk '{print $2, $5 * 1.1}' data.txt
```
🔍 Що відбувається

Для кожного рядка:
1. `$2` → ім’я
2. `$5` * 1.1 → зарплата × 1.1

✅ Результат
```
John 3300
Anna 3850
Mike 3080
Sara 4400
Tom 3520
```
🧠 Чому так

👉 awk автоматично:
- бере $5
- множить
- виводить результат

🔹 Сума всіх зарплат
```bash
awk '{sum += $5} END {print sum}' data.txt
```
🔍 Що відбувається

По рядках:
| Рядок | $5   | sum   |
| ----- | ---- | ----- |
| 1     | 3000 | 3000  |
| 2     | 3500 | 6500  |
| 3     | 2800 | 9300  |
| 4     | 4000 | 13300 |
| 5     | 3200 | 16500 |


✅ Результат
```
16500
```

## 8. BEGIN і END
🔹 BEGIN
```bash
awk 'BEGIN {print "Start"} {print $2}' data.txt
```

🔍 Що відбувається
1. `BEGIN` → виконується до читання файлу
2. `{print $2}` → для кожного рядка

✅ Результат
```
Start
John
Anna
Mike
Sara
Tom
```

🔹 END
```bash
awk '{sum += $5} END {print "Total:", sum}' data.txt
```
🔍 Що відбувається
- спочатку рахує суму
- потім в END друкує

✅ Результат
```
Total: 16500
```

## 9. Роздільники
🔹 FS (Field Separator)
```bash
awk -F: '{print $1}' /etc/passwd
```
🔍 Що відбувається

👉 розділяє рядок по `:` замість пробілу

📄 Якщо рядок:
```
root:x:0:0:root:/root:/bin/bash
```

✅ Результат
```
root
```

🔹 OFS (Output Separator)
```bash
awk 'BEGIN {OFS=" | "} {print $1, $2}' data.txt
```

🔍 Що відбувається
- замість пробілу між полями → " | "

✅ Результат
```
1 | John
2 | Anna
3 | Mike
4 | Sara
5 | Tom
```

| Змінна | Що означає                                                      |
| ------ | --------------------------------------------------------------- |
| `FS`   | **Field Separator** → як awk **читає (розбиває)** рядок         |
| `OFS`  | **Output Field Separator** → як awk **виводить (з’єднує)** поля |

##  10. Regex в awk
🔹 Пошук рядків
```bash
awk '/Developer/' data.txt
```
🔍 Що відбувається

👉 awk:
- бере рядок
- перевіряє regex /Developer/

✅ Результат
```
1 John 25 Developer 3000
3 Mike 22 Developer 2800
5 Tom 35 Developer 3200
```

🔹 Умова через поле
```bash
awk '$2 ~ /J/' data.txt
```
🔍 Що відбувається

👉 $2 (ім’я) містить J

✅ Результат
```
1 John 25 Developer 3000
```

🔹 NOT
```bash
awk '$2 !~ /J/' data.txt
```

✅ Результат
```
2 Anna 30 Designer 3500
3 Mike 22 Developer 2800
4 Sara 27 Manager 4000
5 Tom 35 Developer 3200
```

## 11. Керуючі конструкції
🔹 if
```bash
awk '{if ($3 > 25) print $2}' data.txt
```
🔍 Що відбувається

👉 якщо вік > 25 → друкує ім’я

✅ Результат
```
Anna
Sara
Tom
```

🔹 for
```bash
awk '{for (i=1; i<=NF; i++) print $i}' data.txt
```
🔍 Що відбувається

👉 для кожного рядка:
- перебирає всі поля
- друкує кожне окремо

✅ Результат (фрагмент)
```
1
John
25
Developer
3000
2
Anna
...
```

🔹 while
```bash
awk '{i=1; while(i<=NF){print $i; i++}}'
```
👉 те саме, але через while

## 12. Масиви
🔹 Підрахунок професій
```bash
awk '{count[$4]++} END {for (job in count) print job, count[job]}' data.txt
```

🔍 Що відбувається
| Рядок | $4        | count |
| ----- | --------- | ----- |
| 1     | Developer | 1     |
| 2     | Designer  | 1     |
| 3     | Developer | 2     |
| 4     | Manager   | 1     |
| 5     | Developer | 3     |


✅ Результат
```
Developer 3
Designer 1
Manager 1
```

## 13. Форматований вивід
🔹 printf
```bash
awk '{printf "%s earns %d\n", $2, $5}' data.txt
```

🔍 Що відбувається

👉 формат:
- `%s` → текст
- `%d` → число

✅ Результат
```
John earns 3000
Anna earns 3500
Mike earns 2800
Sara earns 4000
Tom earns 3200
```

## 14. Опції awk
🔹 -v змінна
```bash
awk -v limit=3000 '$5 > limit' data.txt
```
🔍 Що відбувається

👉 змінна limit = 3000

✅ Результат
```
2 Anna 30 Designer 3500
4 Sara 27 Manager 4000
5 Tom 35 Developer 3200
```

🔹 -f файл  
script.awk
```awk
{print $2}
```
```bash
awk -f script.awk data.txt
```

✅ Результат
```
John
Anna
Mike
Sara
Tom
```

## 15. Реальні приклади
🔹 Найбільша зарплата
```bash
awk 'max < $5 {max = $5} END {print max}' data.txt
```
🔍 Що відбувається

👉 кожен рядок:

якщо $5 більше → оновлює max

✅ Результат
```
4000
```

🔹 Середня зарплата
```bash
awk '{sum += $5} END {print sum/NR}' data.txt
```

🔍 Що відбувається
- sum = 16500
- NR = 5

✅ Результат
```
3300
```

## 16. Порівняння з grep/sed (на прикладі)
🔹 grep
```bash
grep Developer data.txt
```
👉 просто знаходить рядки

🔹 sed
```bash
sed 's/Developer/Dev/' data.txt
```
👉 змінює текст

🔹 awk
```bash
awk '$4=="Developer" {print $2, $5}' data.txt
```
🔍 Що відбувається

👉 якщо Developer → вивести ім’я + зарплату

✅ Результат
```
John 3000
Mike 2800
Tom 3200
```

## Фінальний висновок

👉 awk працює так:
- читає рядок
- ділить на поля
- виконує логіку
- виводить результат