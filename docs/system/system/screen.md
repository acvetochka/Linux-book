# screen

Утиліта screen — це один із найстаріших і найпотужніших інструментів для роботи з терміналом у Linux/Unix. Якщо коротко:
👉 це термінальний мультиплексор, який дозволяє створювати кілька "віртуальних терміналів" в одному SSH-сеансі та не втрачати їх при відключенні.

## Що таке screen

`screen` — це програма, яка:
- запускає окремі shell-сесії
- дозволяє від’єднуватися (detach) від них
- і потім повертатися (reattach)

📌 Ключова ідея:
> процеси продовжують працювати навіть після закриття SSH або терміналу

## Для чого використовується
Типові кейси:
- запуск довгих процесів (backup, build, ML, скрипти)
- робота через SSH (особливо нестабільне з'єднання)
- паралельна робота в кількох терміналах
- віддалене адміністрування серверів
- логування/моніторинг

## Переваги

✔ Не втрачаєш процеси при обриві SSH  
✔ Можна мати багато "вкладок"  
✔ Можна ділити екран  
✔ Легкий (майже всюди встановлений)  
✔ Працює без GUI  

## Основи роботи
🔸 Запуск screen
```bash
screen
```
або з ім’ям:
```bash
screen -S mysession
```

🔸 Від'єднання (detach)

👉 найважливіша комбінація:
```
Ctrl + A → D
```
(спочатку Ctrl+A, потім D)

🔸 Повернення до сесії
```bash
screen -r
```
або:
```bash
screen -r mysession
```

🔸 Список сесій
```bash
screen -ls
```

🔸 Завершення

Усередині screen:
```
exit
```
або:
```
Ctrl + A → K
```

## Керування вікнами (windows)
Створити нове вікно
```
Ctrl + A → C
```
Перемикання
```ini
Ctrl + A → N   # наступне
Ctrl + A → P   # попереднє
Ctrl + A → 0-9 # конкретне
```
Список вікон
```
Ctrl + A → "
```
Перейменування
```
Ctrl + A → A
```

## Робота з розділенням екрану
Горизонтальний split
```
Ctrl + A → S
```
Вертикальний split (не у всіх версіях)
```
Ctrl + A → |
```
Перемикання між панелями
```
Ctrl + A → Tab
```
Закрити панель
```
Ctrl + A → X
```
Запустити shell у новій панелі
```
Ctrl + A → C
```
## Копіювання (copy mode)
```
Ctrl + A → [
```

Далі:

- стрілки — переміщення
- Space — почати виділення
- Enter — копіювати

Вставка:
```
Ctrl + A → ]
```

## Логування
```
Ctrl + A → H
```
або запуск з логом:
```bash
screen -L
```

## Основні команди CLI
| Команда          | Опис                  |
| ---------------- | --------------------- |
| `screen`         | запуск                |
| `screen -S name` | створити сесію        |
| `screen -ls`     | список                |
| `screen -r`      | підключитись          |
| `screen -d`      | від'єднати            |
| `screen -d -r`   | "force attach"        |
| `screen -X`      | виконати команду      |
| `screen -wipe`   | очистити мертві сесії |

## Конфігурація (~/.screenrc)

Це головний файл налаштувань.

🔸 Приклад базового конфігу
```ini
# зміна prefix (замість Ctrl+A)
escape ^Bb

# статусбар
hardstatus on
hardstatus alwayslastline
hardstatus string "%{= kw}%-w%{= BW}%n %t%{-}%+w"

# включити scrollback
defscrollback 10000

# автоматичний лог
deflog on

# кольори
term screen-256color

# вимкнути стартовий екран
startup_message off
```

🔸 Зміна prefix

За замовчуванням:
```
Ctrl + A
```
Можна зробити як у tmux:
```
escape ^Tt
```
👉 тоді буде:
```
Ctrl + T
```

🔸 Гарячі клавіші (key bindings)
```bash
bind c screen 1
bind k kill
bind n next
bind p prev
```
🔸 Автоматичний запуск вікон
```bash
screen -t logs 1 tail -f /var/log/syslog
screen -t htop 2 htop
```

## Alt замість Ctrl+A
❗ Важливий момент

👉 Screen НЕ підтримує повністю Alt як prefix глобально

Тобто:
- Alt + C
- Alt + D

👉 не можна зробити автоматично для всіх команд через escape

🔹 Але є workaround: bind Alt-комбінацій

Ти можеш вручну задати Alt-клавіші:

🔸 Приклад:
```bash
bindkey "^[c" screen      # Alt+C → нове вікно
bindkey "^[d" detach      # Alt+D → detach
bindkey "^[n" next        # Alt+N → next
bindkey "^[p" prev        # Alt+P → prev
bindkey "^[k" kill        # Alt+K → kill window
```

🔹 Що означає `^[c`

Це:

- `^[`  = ESC (Alt)
- `c`   = клавіша

👉 тобто:
```
Alt+C = ESC + c
```

🔹 Повний приклад конфігу "без Ctrl+A"
```bash
# вимкнути стандартний prefix
escape ^^^

# Alt-based управління
bindkey "^[c" screen
bindkey "^[d" detach
bindkey "^[n" next
bindkey "^[p" prev
bindkey "^[k" kill
bindkey "^[w" windows
bindkey "^[\"" windowlist
bindkey "^[0" select 0
bindkey "^[1" select 1
bindkey "^[2" select 2

# split
bindkey "^[s" split
bindkey "^[v" split -v
bindkey "^[x" remove

# navigation
bindkey "^[\t" focus

# copy mode
bindkey "^[[" copy
bindkey "^[]" paste
```

🔹 Чи можна повністю замінити Ctrl+A?

👉 Практично — так  
👉 Теоретично — не на 100%  

Чому:
- деякі внутрішні функції screen жорстко зав’язані на prefix
- не всі команди мають прямий bind

Але:  
👉 90–95% керування можна перенести на Alt

🔹 Проблеми з Alt (важливо!)  
❗ 1. Alt може не працювати

Залежить від:
- терміналу
- SSH
- shell

🔧 Рішення:  
Для Bash:
```bash
set -o emacs
```
Для terminal:
- увімкнути "Meta sends escape"

❗ 2. Конфлікти з bash/readline

Наприклад:
> `Alt+B` → move backward word

👉 буде конфлікт

❗ 3. Затримка ESC
> `Alt = ESC + key` → може бути lag

🔹 Альтернатива: гібридний варіант (рекомендую)

👉 найзручніше:
```bash
# новий prefix
escape ^Tt

# + швидкі Alt shortcuts
bindkey "^[c" screen
bindkey "^[d" detach
bindkey "^[n" next
bindkey "^[p" prev
```
👉 отримуєш:
- `Ctrl+T` → повний контроль
- `Alt` → швидкі дії

🔹 Ще корисні трюки
🔸 Повтор команди без prefix
```bash
bind ' ' other
```
🔸 Швидке закриття
```bash
bindkey "^[q" kill
```
🔸 Перемикання як вкладки
```bash
bindkey "^[h" prev
bindkey "^[l" next
```

👉 як Vim 😎

🔹 UX-покращення (дуже рекомендую)
```bash
# великий scrollback
defscrollback 10000

# кольори
term screen-256color

# статус бар
hardstatus alwayslastline
hardstatus string "%{= kw}%H | %l | %Y-%m-%d %c %{= BW}%-w%{= kW}%n %t%{-}%+w"

# без splash screen
startup_message off
```

🔹 Висновок

👉 Коротко:
| Питання                         | Відповідь                         |
| ------------------------------- | --------------------------------- |
| Чи можна прибрати Ctrl+A?       | ✔ майже повністю                  |
| Чи можна зробити Alt як prefix? | ❌ ні                              |
| Чи можна Alt для команд?        | ✔ так (bindkey)                   |
| Найкращий варіант               | 👉 hybrid (Ctrl+T + Alt shortcuts) |

## Просунуті можливості
🔸 Спільний доступ (multiuser)
```
Ctrl + A → :
multiuser on
acladd username
```

🔸 Надсилання команд у сесію
```bash
screen -S mysession -X stuff "ls\n"
```
🔸 Запуск у detached режимі
```bash
screen -dmS mysession command
```

## Типові сценарії
🔸 Запуск довгого процесу
```bash
screen -S backup
./backup.sh
```
👉 від'єднуєшся → процес працює

🔸 SSH + screen (золоте правило)
```bash
ssh server
screen -S work
```

## Часті проблеми
❗ "Attached session"
```bash
screen -d -r
```
❗ "Dead session"
```bash
screen -wipe
```

## Порівняння з tmux
| Feature      | screen  | tmux          |
| ------------ | ------- | ------------- |
| Простота     | ✔       | ❌             |
| Гнучкість    | ❌       | ✔             |
| Конфіг       | слабкий | дуже потужний |
| Популярність | старий  | сучасний      |


## Best Practices

✔ Завжди давай ім’я сесії  
✔ Використовуй scrollback  
✔ Вмикай логування для важливих задач  
✔ Міняй prefix (щоб не конфліктував з bash)  
✔ Використовуй screen -dmS для автозапуску  

## Висновок

`screen` — це:  
👉 must-have для Linux-адміністратора

Особливо якщо:
- працюєш через SSH
- запускаєш довгі процеси
- адмініструєш сервери