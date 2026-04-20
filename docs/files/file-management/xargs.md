find + xargs
📌 🔗 xargs — передача результатів як аргументів

👉 Проблема:

find з -exec повільний (запускає команду для кожного файлу)

👉 Рішення:

xargs збирає список і виконує команду один раз або пакетами
📌 Базове використання
Команда	Для чого використовується	Приклад	Що зробить
find . -name "*.txt" | xargs rm	видалення файлів	команда	видалить всі .txt
find . -name "*.log" | xargs ls -l	передача в ls	команда	покаже список
find . -type f | xargs wc -l	підрахунок рядків	команда	кількість рядків
📌 ВАЖЛИВО ⚠️ (пробіли в іменах!)

👉 Неправильно:

find . -name "*.txt" | xargs rm

👉 Якщо є пробіли → буде ламатись

✅ Безпечний варіант (правильний)
Команда	Для чого використовується	Приклад	Що зробить
find . -name "*.txt" -print0 | xargs -0 rm	безпечне видалення	команда	коректно з пробілами
find . -type f -print0 | xargs -0 ls -l	безпечний ls	команда	працює з будь-якими іменами

📌 Ключі:

-print0 → розділення NULL
xargs -0 → читає NULL
📌 Пакетна обробка
Команда	Для чого використовується	Приклад	Що зробить
xargs -n 1	по одному файлу	... | xargs -n 1 echo	кожен окремо
xargs -n 10	по 10 файлів	... | xargs -n 10 rm	групами
xargs -P 4	паралельно	... | xargs -P 4 gzip	4 процеси
📌 Передача в складні команди
Команда	Для чого використовується	Приклад	Що зробить
xargs -I {}	placeholder	find . -name "*.log" | xargs -I {} mv {} {}.bak	перейменує
xargs -I {}	складні операції	... | xargs -I {} sh -c 'echo {}'	виконає shell
📌 Порівняння: -exec vs xargs
Варіант	Плюси	Мінуси
find -exec	безпечний	повільний
xargs	швидкий	треба враховувати пробіли
📌 Коли що використовувати

👉 Використовуй -exec якщо:

важлива безпека
мало файлів

👉 Використовуй xargs якщо:

багато файлів
потрібна швидкість
масова обробка
🔥 Практичні приклади (дуже корисно)
Задача	Команда
Видалити всі .log	find . -name "*.log" -print0 | xargs -0 rm
Стиснути всі .txt	find . -name "*.txt" -print0 | xargs -0 gzip
Порахувати рядки	find . -type f -print0 | xargs -0 wc -l
Знайти великі файли і видалити	find . -size +100M -print0 | xargs -0 rm
✅ Підсумок

xargs — це:

прискорення find
пакетна обробка
основа для automation / scripting


📌 Як працює xargs (суть)

👉 xargs бере дані зі stdin і:
➡️ перетворює їх у аргументи для команди

📌 Приклади НЕ з find
🔹 1. Звичайний текст
echo "file1 file2 file3" | xargs rm

👉 Еквівалент:

rm file1 file2 file3
🔹 2. Список рядків
echo -e "one\ntwo\nthree" | xargs echo

👉 Виведе:

one two three
🔹 3. Через ls
ls | xargs wc -l

👉 Порахує рядки у всіх файлах

⚠️ Але:

небезпечно (через пробіли)
краще:
ls -1 | xargs -d '\n' wc -l
🔹 4. З grep
grep -rl "error" . | xargs rm

👉 Видалить файли з "error"

🔹 5. З cat
cat files.txt | xargs rm

👉 Якщо в files.txt список файлів

🔹 6. Генерація аргументів
seq 1 5 | xargs -I {} touch file{}.txt

👉 Створить:

file1.txt file2.txt ...
📌 Коли xargs особливо корисний
✅ Коли команда НЕ приймає stdin

Наприклад:

echo "hello" | rm   ❌

Але:

echo "file.txt" | xargs rm   ✅
📌 Порівняння
Варіант	Що робить
`	` (pipe)
xargs	перетворює stdin → аргументи
📌 Часта помилка ❗
cat file.txt | xargs rm

👉 Якщо в file.txt:

my file.txt

➡️ розіб’ється на:

my
file.txt

✅ Правильно:

cat file.txt | xargs -d '\n' rm

або:

find . -print0 | xargs -0 ...
✅ Висновок

👉 xargs працює з:

find (найчастіше)
grep
ls
cat
echo
будь-якою командою, що пише в stdout

👉 Це універсальний інструмент для:

automation
scripting
масових операцій
🔥 Коротко (як запам’ятати)

xargs = stdin → аргументи команди