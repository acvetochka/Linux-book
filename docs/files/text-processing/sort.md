# sort

sort:

- працює з текстовими потоками (stdin/stdout)
- використовується в пайпах
- є частиною GNU coreutils
- майже завжди йде разом з grep, awk, sed

## 📄 Тестовий файл

Нехай у нас є файл `data.txt`:
```bash
cat data.txt
```

```bash
apple  10  red
banana 2   yellow
cherry 30  red
apple  2   green
banana 11  green
```
Формат:  
👉 назва число колір

## БАЗОВЕ СОРТУВАННЯ
✅ Команда
```bash
sort data.txt
```
📌 Для чого
> Сортує рядки лексикографічно (як слова у словнику)

📤 Що виведе
```bash
apple  10  red
apple  2   green
banana 11  green
banana 2   yellow
cherry 30  red
```

## КЛЮЧІ SORT
### `-r` — зворотне сортування  
  ✅ Команда
  ```bash
  sort -r data.txt
  ```
  📌 Для чого
  > Сортує у зворотному порядку

  📤 Вивід
  ```bash
  cherry 30  red
  banana 2   yellow
  banana 11  green
  apple  2   green
  apple  10  red
  ```

### `-n` — числове сортування  
  ✅ Команда
  ```bash
  sort -n -k2 data.txt
  ```
  📌 Для чого
  > Сортує за числами, а не як текст

  📤 Вивід
  ```bash
  banana 2   yellow
  apple  2   green
  apple  10  red
  banana 11  green
  cherry 30  red
  ```

### `-k` — вибір поля 
✅ Команда
```bash
sort -k1 data.txt
```
📌 Для чого
> Сортує за 1-м полем (словом)

📤 Вивід
```bash
apple  10  red
apple  2   green
banana 2   yellow
banana 11  green
cherry 30  red
```

### `-k2` — сортування за другим полем
✅ Команда
```bash
sort -k2 data.txt
```

📌 Для чого
> Сортує за 2-м полем як текст

📤 Вивід
```bash
apple  10  red
banana 11  green
apple  2   green
banana 2   yellow
cherry 30  red
```
(бо "10" < "2" як рядок)

### `-t` — розділювач
✅ Команда
```bash
sort -t" " -k2 data.txt
```

📌 Для чого
> Вказує розділювач полів

(важливо для CSV, наприклад -t,)

📤 Вивід

👉 той самий, але контроль точніший

### `-u` — унікальні рядки
✅ Команда
```bash
sort -u data.txt
```
📌 Для чого
> Видаляє дублікати

📤 Вивід

(якщо були б дублікати — залишився б один)

### `-f` — ігнор регістру
✅ Команда
```bash
sort -f data.txt
```
📌 Для чого

Не враховує великі/малі літери

### `-b` — ігнор початкових пробілів
✅ Команда
```bash
sort -b data.txt
```
📌 Для чого
> Ігнорує leading spaces

### `-M` — сортування місяців
✅ Команда
```bash
printf "Jan\nFeb\nDec\n" | sort -M
```
📌 Для чого
> Сортує як місяці

📤 Вивід
```bash
Jan
Feb
Dec
```

### `-h` — "human readable" числа
✅ Команда
```bash
printf "1K\n10M\n2K\n" | sort -h
```
📌 Для чого
> Сортує розміри (K, M, G)

📤 Вивід
```
1K
2K
10M
```

### `-V` — версії
✅ Команда
```bash
printf "file1\nfile10\nfile2\n" | sort -V
```
📌 Для чого
> Правильне сортування версій

📤 Вивід
```bash
file1
file2
file10
```

### `-c` — перевірка чи відсортовано
✅ Команда
```bash
sort -c data.txt
```

📌 Для чого
> Перевіряє чи файл вже відсортований

📤 Вивід

👉 нічого (або помилка якщо ні)

### `-o` — запис у файл
✅ Команда
```bash
sort data.txt -o sorted.txt
```
📌 Для чого
> Записує результат у файл

### `-R` — випадковий порядок
✅ Команда
```bash
sort -R data.txt
```

📌 Для чого
> Перемішує рядки

### `-g` — "general numeric"
✅ Команда
```bash
printf "1e3\n100\n2e2\n" | sort -g
```
📌 Для чого
> Сортує наукові числа

📤 Вивід
```
100
2e2
1e3
```

### `-S` — памʼять
✅ Команда
```bash
sort -S 1M data.txt
```
📌 Для чого
> Обмежує використання RAM

### `-T` — тимчасова папка
✅ Команда
```bash
sort -T /tmp data.txt
```

📌 Для чого
> Вказує де створювати тимчасові файли

### `--parallel`
✅ Команда
```bash
sort --parallel=4 data.txt
```
📌 Для чого
> Використовує кілька CPU

## КОМБІНАЦІЇ (найважливіше 🔥)
✅ Сортування за 2 полем числово
```bash
sort -k2,2 -n data.txt
```
📌 тільки друге поле

📤
```
banana 2   yellow
apple  2   green
apple  10  red
banana 11  green
cherry 30  red
```

✅ Спочатку слово, потім число
```bash
sort -k1,1 -k2,2n data.txt
```
📤
```
apple  2   green
apple  10  red
banana 2   yellow
banana 11  green
cherry 30  red
```

✅ Унікальні + сортування
```bash
sort -u -k1,1 data.txt
```
📌 тільки по першому полю

## ВАЖЛИВІ МОМЕНТИ

⚠️ 1. Поля нумеруються з 1

- `-k1` → перше поле
- `-k2` → друге

⚠️ 2. За замовчуванням:  
- розділювач = пробіли/таб
- сортування = текстове

⚠️ 3. Різниця:  
- sort -k2
- sort -k2,2

👉 другий варіант — тільки поле 2 (правильніше!)

## ВИСНОВОК

sort — це:

✔ сортування тексту  
✔ підтримка чисел, версій, розмірів  
✔ сортування по колонках  
✔ дуже часто використовується з:
- uniq
- awk
- cut