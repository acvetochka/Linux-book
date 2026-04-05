# tmux

## Що таке tmux

`tmux` (Terminal Multiplexer) — це сучасний аналог screen, який дозволяє:

- створювати кілька термінальних сесій
- ділити екран на панелі
- від'єднуватися і повертатися
- керувати всім через гарячі клавіші

👉 простіше:
> це як "вкладки + split-screen" для терміналу

## Для чого використовується
Основні кейси:
- робота через SSH
- довгі процеси (build, deploy, scripts)
- моніторинг (logs, htop)
- розробка (frontend/backend одночасно)
- DevOps / адмінка

## Чому tmux краще за screen
| Функція   | `tmux`         | `screen`    |
| --------- | -------------- | ----------- |
| Конфіг    | ✔ дуже гнучкий | ❌ обмежений |
| Split     | ✔ зручний      | ❌ незручний |
| Клавіші   | ✔ логічні      | ❌ застарілі |
| Статусбар | ✔ потужний     | ❌ слабкий   |
| Copy mode | ✔ нормальний   | ❌ біль      |


👉 сьогодні tmux — стандарт де-факто

## Основи роботи
🔸 Запуск
```bash
tmux
```
або:
```bash
tmux new -s mysession
```

🔸 Від’єднання
```
Ctrl + B → D
```

🔸 Повернення
```bash
tmux attach
```
або:
```bash
tmux attach -t mysession
```

🔸 Список сесій
```bash
tmux ls
```

🔸 Завершення
```
exit
```
або:
```
Ctrl + B → &
```

## Архітектура tmux

Важливо зрозуміти:
```
session
 ├── window (вкладка)
 │     ├── pane (панель)
 │     ├── pane
 │
 ├── window
```

## Керування вікнами (windows)
Створити
```
Ctrl+B → C
```
Перемикання
```
Ctrl+B → N   (next)
Ctrl+B → P   (prev)
Ctrl+B → 0-9
```

Список
```
Ctrl+B → W
```
Перейменувати
```
Ctrl+B → ,
```

## Панелі (split)
Вертикальний split
```
Ctrl+B → %
```
Горизонтальний
```
Ctrl+B → "
```
Навігація
```
Ctrl+B → ← ↑ ↓ →
```
або:
```
Ctrl+B → O
```
Закрити pane
```
Ctrl+B → X
```
Resize
```
Ctrl+B → Ctrl+←
Ctrl+B → Ctrl+→
```

## Copy mode
```
Ctrl+B → [
```
- рух — стрілки або vim (h j k l)
- Space — почати виділення
- Enter — копіювати

Вставка:
```
Ctrl+B → ]
```
🔹 Команди CLI
```bash
tmux new -s name
tmux attach -t name
tmux ls
tmux kill-session -t name
tmux kill-server
tmux rename-session
```

## Конфігурація (~/.tmux.conf)

👉 головна сила tmux

🔹 Базовий конфіг (must-have)
```bash
# змінити prefix (як у screen → Ctrl+A)
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# миша
set -g mouse on

# scrollback
set -g history-limit 10000

# швидкий reload
bind r source-file ~/.tmux.conf \; display "Reloaded!"

# статусбар
set -g status-bg black
set -g status-fg white
```

## Спрощення керування (🔥 найважливіше)
🔸 Vim-style navigation
```bash
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R
```

🔸 Split як у IDE
```bash
bind | split-window -h
bind - split-window -v
```

🔸 Переключення вікон
```bash
bind -n M-h previous-window
bind -n M-l next-window
```

👉 `Alt + h / l` без prefix

🔸 Нове вікно (без Ctrl+B)
```bash
bind -n M-c new-window
```
🔸 Закрити pane
```bash
bind -n M-x kill-pane
```
🔸 Detach
```bash
bind -n M-d detach
```

## Alt-комбінації

👉 на відміну від screen:

✅ tmux ПОВНОЦІННО підтримує Alt без prefix
```bash
bind -n M-c new-window
bind -n M-n next-window
bind -n M-p previous-window
bind -n M-d detach
```
👉 це головна UX-перевага tmux

## Copy mode як у Vim
```bash
setw -g mode-keys vi
```

## Статусбар (просунутий)
```bash
set -g status-left "#S"
set -g status-right "%H:%M %d-%b"
```

## Автоматичні вікна
```bash
new-window -n logs "tail -f /var/log/syslog"
new-window -n htop "htop"
```

## Plugins (суперсила tmux)

👉 через [TPM (Tmux Plugin Manager)](TPM)

Популярні:
- tmux-resurrect (відновлення сесій)
- tmux-continuum (автосейв)
- tmux-yank (копіювання)

## Приклад "ідеального" конфігу
```bash
# prefix
set -g prefix C-a
unbind C-b
bind C-a send-prefix

# mouse
set -g mouse on

# history
set -g history-limit 10000

# vim keys
setw -g mode-keys vi

# navigation
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# splits
bind | split-window -h
bind - split-window -v

# Alt shortcuts
bind -n M-c new-window
bind -n M-n next-window
bind -n M-p previous-window
bind -n M-d detach

# reload
bind r source-file ~/.tmux.conf \; display "Reloaded!"
```

## Best Practices

✔ Міняй prefix на Ctrl+A  
✔ Використовуй Alt shortcuts  
✔ Увімкни mouse  
✔ Використовуй vim-keys  
✔ Додай plugins  

## Типові проблеми
❗ Alt не працює
- увімкнути "Meta sends escape" в терміналі
❗ Copy не працює
- використовуй `mode-keys vi`
❗ Конфіг не застосувався
```bash
tmux source-file ~/.tmux.conf
```

## Висновок

👉 tmux — це:

- сучасний стандарт
- гнучкий
- реально зручний після налаштування