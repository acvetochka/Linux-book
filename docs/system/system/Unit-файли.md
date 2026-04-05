# unit-файл <!-- omit in toc -->

## 1. Що таке unit-файл (ще раз дуже чітко)

У systemd:

👉 unit-файл — це текстовий файл (конфіг), який каже:

- що запускати
- як запускати
- коли запускати
- з якими правами

## 2. Де зберігаються unit-файли

Це критично важливо 👇

**📦 Основні шляхи:**
```bash
/etc/systemd/system/     # твої (кастомні, найважливіші)
/run/systemd/system/     # тимчасові (runtime)
/lib/systemd/system/     # системні (пакети)
```

**🧠 Як systemd їх читає (пріоритет!)**
1. `/etc/systemd/system/` ← 🔥 головний
2. `/run/systemd/system/`
3. `/lib/systemd/system/`

👉 якщо однаковий файл є в кількох місцях — береться з `/etc`

**📌 Висновок:**
- 👉 створюєш свої сервіси → тільки в `/etc/systemd/system/`
- 👉 не редагуй `/lib/...` (перезапишеться при оновленні)

## 3. Ім’я unit-файлу

Формат:
```bash
name.type
```
Приклади:
```bash
nginx.service
docker.service
myapp.service
backup.timer
```

## 4. Структура unit-файлу

Завжди складається з секцій:
```ini
[Unit]
...

[Service]
...

[Install]
...
```

## 5. Секція [Unit] — опис і залежності
**🔹 Основні параметри**

- Description
  ```ini
  Description=My App
  ```
  👉 просто опис

- Documentation
  ```ini
  Documentation=https://example.com
  Requires (жорстка залежність)
  Requires=postgres.service
  ```
  👉 якщо postgres не стартує → цей сервіс теж не стартує

- Wants (м’яка залежність)
  ```ini
  Wants=redis.service
  ```
  👉 запускає redis, але якщо він впаде — сервіс працює далі

- After / Before (порядок)
  ```ini
  After=network.target
  Before=nginx.service
  ```
  👉 НЕ означає залежність!  
  👉 тільки порядок запуску

- Conflicts
  ```ini
  Conflicts=apache.service
  ```
  👉 не можуть працювати разом

## 6. Секція [Service] — найважливіша
### 6.1 Exec-команди
- ExecStart
  ```ini
  ExecStart=/usr/bin/node /app/index.js
  ```
  👉 головна команда запуску

- ExecStop
  ```ini
  ExecStop=/usr/bin/killall node
  ExecReload
  ExecReload=/bin/kill -HUP $MAINPID
  ```
  ⚠️ Важливо:
  тільки абсолютні шляхи  
  не працює $PATH

### 6.2 Type (тип сервісу)
```ini
Type=simple
```

Варіанти:
| Type    | Що означає      |
| ------- | --------------- |
| simple  | просто запускає |
| forking | daemon (fork)   |
| oneshot | один раз        |
| notify  | сигнал systemd  |
| idle    | після всіх      |


### 6.3 Restart
- Restart
  ```ini
  Restart=always
  ```
  | Значення   | Опис               |
  | ---------- | ------------------ |
  | no         | не перезапускати   |
  | always     | завжди             |
  | on-failure | тільки при помилці |


- RestartSec
  ```ini
  RestartSec=5
  ```
  👉 затримка

### 6.4 User / Group
```ini
User=node
Group=node
```
👉 від чийого імені запускати

### 6.5 WorkingDirectory
```ini
WorkingDirectory=/app
```
👉 як cd

### 6.6 Environment
```ini
Environment="NODE_ENV=production"
```
або:
```ini
EnvironmentFile=/etc/myapp.env
```

### 6.7 StandardOutput / Error
```ini
StandardOutput=journal
StandardError=journal
```

### 6.8 Timeout
```ini
TimeoutStartSec=30
TimeoutStopSec=10
```

### 6.9 KillMode
```ini
KillMode=control-group
```
| Значення      | Опис            |
| ------------- | --------------- |
| control-group | всі процеси     |
| process       | тільки головний |


### 6.10 Limit (ресурси)
```ini
LimitNOFILE=65535
LimitNPROC=4096
```

### 6.11 Безпека 🔐
```ini
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
ProtectHome=true
```
👉 дуже важливо для production

## 7. Секція [Install]

Це про автозапуск

-  WantedBy
    ```ini
    WantedBy=multi-user.target
    ```

    👉 означає:
    > запускати при старті системи

- RequiredBy
  ```ini
  RequiredBy=nginx.service
  ```

-  Alias
    ```ini
    Alias=myapp.service
    ```

## 8. Як працює enable
```bash
systemctl enable myapp
```
👉 створює symlink:
```bash
/etc/systemd/system/multi-user.target.wants/myapp.service
```

## 9. Перевірка unit-файлу
```bash
systemd-analyze verify myapp.service
```

## 10. Після змін

Завжди:
```bash
systemctl daemon-reload
```

##  11. Правила написання unit-файлів
❗ 1. Абсолютні шляхи

❌ НЕ:
```ini
ExecStart=node app.js
```
✅ ТАК:
```ini
ExecStart=/usr/bin/node /app/app.js
```

❗ 2. Один ExecStart

(для Type=simple)

❗ 3. Не використовуй shell

❌
```ini
ExecStart=cd /app && node app.js
```
✅
```ini
WorkingDirectory=/app
ExecStart=/usr/bin/node app.js
```

❗ 4. Права доступу
```bash
chmod 644 myapp.service
```

❗ 5. Ім’я файлу = ім’я сервісу


## 12. Повний приклад (production-ready)
```ini
[Unit]
Description=My Node App
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/app

ExecStart=/usr/bin/node index.js

Restart=always
RestartSec=5

Environment=NODE_ENV=production

StandardOutput=journal
StandardError=journal

NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

## 13. Як це запам’ятати

unit-файл = 3 частини:

1️⃣ [Unit]

👉 хто я + залежності

2️⃣ [Service]

👉 як мене запускати

3️⃣ [Install]

👉 коли мене запускати

## 14. Типові помилки (дуже важливо)
❌ "не запускається"

👉 90%:
- неправильний шлях
- немає прав
- forgot daemon-reload

❌ "шлях не знайдено"

👉 знайди:
```bash
which node
```

❌ "працює вручну, але не через systemd"

👉 причина:
- немає PATH
- немає env


## 15. ПОВНИЙ reference параметрів systemd (структуровано)

Ми не будемо просто “звалювати список”, а розіб’ємо по секціях, як це реально працює.

### 🔹 [Unit] — метадані + залежності
📌 Ідентифікація
| Параметр        | Опис      |
| --------------- | --------- |
| `Description`   | опис      |
| `Documentation` | посилання |

🔗 Залежності
| Параметр    | Тип                                             | Опис                            |
| ----------- | ----------------------------------------------- | ------------------------------- |
| `Requires`  | жорстка                                         | якщо не стартує → цей теж падає |
| `Wants`     | м’яка                                           | бажано, але не обов’язково      |
| `Requisite` | як Requires, але без запуску                    |                                 |
| `BindsTo`   | жорстка + якщо dependency падає → цей теж падає |                                 |
| `PartOf`    | пов’язаний lifecycle                            |                                 |


🔄 Порядок запуску
| Параметр | Опис         |
| -------- | ------------ |
| `After`  | запуск після |
| `Before` | запуск до    |

👉 важливо: це НЕ залежності

🚫 Конфлікти
| Параметр    | Опис                      |
| ----------- | ------------------------- |
| `Conflicts` | не можуть працювати разом |

🔁 Перезапуск через інші юніти
| Параметр    | Опис                     |
| ----------- | ------------------------ |
| `OnFailure` | що запускати при падінні |


### 🔹 [Service] — поведінка сервісу
🚀 Exec-команди
| Параметр        | Опис            |
| --------------- | --------------- |
| `ExecStart`     | основна команда |
| `ExecStartPre`  | перед запуском  |
| `ExecStartPost` | після           |
| `ExecStop`      | зупинка         |
| `ExecStopPost`  | після stop      |
| `ExecReload`    | reload          |

🔄 Тип сервісу
| Type      | Опис           |
| --------- | -------------- |
| `simple`  | стандарт       |
| `forking` | daemon         |
| `oneshot` | один раз       |
| `notify`  | сигнал systemd |
| `idle`    | після всіх     |


🔁 Restart логіка
| Параметр                | Опис               |
| ----------------------- | ------------------ |
| `Restart`               | коли перезапускати |
| `RestartSec`            | затримка           |
| `StartLimitIntervalSec` | період             |
| `StartLimitBurst`       | скільки спроб      |


👤 Користувач
| Параметр              | Опис            |
| --------------------- | --------------- |
| `User`                | від кого запуск |
| `Group`               | група           |
| `SupplementaryGroups` | додаткові групи |

📁 Робоче середовище
| Параметр           | Опис     |
| ------------------ | -------- |
| `WorkingDirectory` | cwd      |
| `RootDirectory`    | chroot   |
| `Environment`      | змінні   |
| `EnvironmentFile`  | файл env |

📤 Логи
| Параметр           | Опис         |
| ------------------ | ------------ |
| `StandardOutput`   | stdout       |
| `StandardError`    | stderr       |
| `SyslogIdentifier` | ім’я в логах |


⏱ Таймінги
| Параметр          | Опис           |
| ----------------- | -------------- |
| `TimeoutStartSec` | таймаут старту |
| `TimeoutStopSec`  | таймаут стопу  |

💀 Kill behavior
| Параметр      | Опис         |
| ------------- | ------------ |
| `KillMode`    | кого вбивати |
| `KillSignal`  | сигнал       |
| `SendSIGKILL` | kill чи ні   |

📊 Ліміти
| Параметр      | Опис    |
| ------------- | ------- |
| `LimitCPU`    | CPU     |
| `LimitNOFILE` | файли   |
| `LimitNPROC`  | процеси |


🔐 Безпека
| Параметр          | Опис                |
| ----------------- | ------------------- |
| `NoNewPrivileges` | заборона escalation |
| `PrivateTmp`      | ізольований /tmp    |
| `ProtectSystem`   | readonly FS         |
| `ProtectHome`     | home                |
| `ReadOnlyPaths`   | readonly            |
| `ReadWritePaths`  | writable            |

🧠 cgroups / ресурси
| Параметр                    | Опис    |
| --------------------------- | ------- |
| `MemoryLimit` / `MemoryMax` | RAM     |
| `CPUQuota`                  | CPU %   |
| `TasksMax`                  | процеси |

### 🔹 [Install] — автозапуск
🔗 Основні
| Параметр     | Опис               |
| ------------ | ------------------ |
| `WantedBy`   | м’яке підключення  |
| `RequiredBy` | жорстке            |
| `Alias`      | альтернативне ім’я |


📁 Also
```ini
Also=myapp-helper.service
```
👉 enable включить і його


## Висновок

👉 unit-файл — це контракт між systemd і твоєю програмою

👉 ти описуєш:
- як запускати
- коли запускати
- як контролювати