# systemd <!-- omit in toc -->

## 1. Що таке systemd

`systemd` — це система ініціалізації (init system) і менеджер сервісів у Linux.

👉 Вона відповідає за:

- запуск системи (boot)
- управління сервісами (services)
- монтування файлових систем
- логування
- керування процесами
- таймери (cron-подібні задачі)

📌 Прийшла на заміну старим:
- SysVinit
- Upstart

## 2. Основні поняття systemd
**🔹 Unit (юніт)**

`Unit` — це базова сутність у systemd.

Це конфіг-файл, який описує:

- сервіс
- точку монтування
- таймер
- сокет
- таргет

📁 Розташування:
```ini
/etc/systemd/system/     # кастомні (пріоритетні)
/run/systemd/system/     # runtime
/lib/systemd/system/     # системні
```

**🔹 Типи unit-файлів**

| Тип       | Розширення   | Опис                |
| --------- | ------------ | ------------------- |
| Service   | `.service`   | сервіс (daemon)     |
| Socket    | `.socket`    | сокети              |
| Target    | `.target`    | групи юнітів        |
| Timer     | `.timer`     | планувальник (cron) |
| Mount     | `.mount`     | монтування          |
| Automount | `.automount` | автомонтування      |
| Path      | `.path`      | слідкує за файлами  |
| Device    | `.device`    | пристрої            |
| Swap      | `.swap`      | swap                |


## 3. Структура unit-файлу

Приклад:
```ini
[Unit]
Description=My App
After=network.target

[Service]
ExecStart=/usr/bin/myapp
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

**🔍 Секції:**  
- 🔹 [Unit]
  - опис
  - залежності
- 🔹 [Service]
  - як запускати
  - параметри процесу
- 🔹 [Install]
  - коли запускати (при boot)

## 4. Основні команди systemctl
**🔹 Загальний синтаксис**
```bash
systemctl [command] [unit]
```

### 4.1 Управління сервісами
▶️ Запуск
```bash
systemctl start nginx
```
⏹️ Зупинка
```bash
systemctl stop nginx
```
🔄 Перезапуск
```bash
systemctl restart nginx
```
🔁 Reload (без повного рестарту)
```bash
systemctl reload nginx
```

### 4.2 Статус
```bash
systemctl status nginx
```

Показує:
- PID
- стан
- лог
- помилки

### 4.3 Список сервісів
```bash
systemctl list-units
```
Тільки сервіси:
```bash
systemctl list-units --type=service
```
Всі (включаючи неактивні):
```bash
systemctl list-units --all
```

### 4.4 Автозапуск
Увімкнути:
```bash
systemctl enable nginx
```
Вимкнути:
```bash
systemctl disable nginx
```

### 🚫 Mask (повна заборона запуску)
```bash
systemctl mask nginx
systemctl unmask nginx
```
👉 навіть root не запустить

### 🔁 Reload systemd
```bash
systemctl daemon-reexec
systemctl daemon-reload
```

📌 Після зміни unit-файлів:
```bash
systemctl daemon-reload
```

## 5. Логи — journalctl
🔹 Перегляд логів
```bash
journalctl
```
🔹 Для сервісу
```bash
journalctl -u nginx
```
🔹 В реальному часі
```bash
journalctl -f
```
🔹 За сьогодні
```bash
journalctl --since today
```
🔹 За час
```bash
journalctl --since "2026-03-30 10:00"
```
🔹 Тільки помилки
```bash
journalctl -p err
```

## 6. Залежності
🔹 Типи залежностей
| Директива | Опис               |
| --------- | ------------------ |
| Requires  | жорстка залежність |
| Wants     | м’яка              |
| After     | порядок запуску    |
| Before    | до                 |
| Conflicts | конфлікт           |

🔍 Приклад
```ini
[Unit]
Requires=network.target
After=network.target
```

## 7. Target (аналог runlevel)
| Target            | Старий runlevel |
| ----------------- | --------------- |
| poweroff.target   | 0               |
| rescue.target     | 1               |
| multi-user.target | 3               |
| graphical.target  | 5               |
| reboot.target     | 6               |


🔹 Поточний target
```bash
systemctl get-default
```
🔹 Змінити
```bash
systemctl set-default multi-user.target
```

## 8. Створення власного сервісу
📌 Приклад
```bash
nano /etc/systemd/system/myapp.service
```
```ini
[Unit]
Description=My App
After=network.target

[Service]
ExecStart=/usr/bin/node /app/index.js
Restart=always
User=node

[Install]
WantedBy=multi-user.target
```

🔹 Активація
```bash
systemctl daemon-reload
systemctl enable myapp
systemctl start myapp
```

## 9. Важливі параметри Service
🔹 Restart
```ini
Restart=always
Restart=on-failure
Restart=no
```

🔹 Типи сервісів
| Type    | Опис             |
| ------- | ---------------- |
| simple  | за замовчуванням |
| forking | daemon           |
| oneshot | одноразовий      |
| notify  | з сигналом       |
| idle    | після всіх       |


🔹 User
```ini
User=www-data
Group=www-data
```
🔹 Environment
```ini
Environment="NODE_ENV=production"
```
🔹 WorkingDirectory
```ini
WorkingDirectory=/app
```
🔹 Exec*
```ini
ExecStart=
ExecStop=
ExecReload=
```

## 10. Timer (аналог cron)
**🔹 Приклад**
```ini
# myjob.timer
[Timer]
OnBootSec=5min
OnUnitActiveSec=1h
# myjob.service
[Service]
ExecStart=/usr/bin/script.sh
```

**🔹 Запуск**
```bash
systemctl enable myjob.timer
systemctl start myjob.timer
```

## 11. Socket activation

systemd може запускати сервіс тільки при зверненні.

📌 Використовується в:
- nginx
- docker
- ssh

## 12. Діагностика
🔹 Час завантаження
```bash
systemd-analyze
```
🔹 Найдовші сервіси
```bash
systemd-analyze blame
```
🔹 Граф
```bash
systemd-analyze critical-chain
```

## 13. Cgroups

systemd використовує control groups (cgroups) для:
- обмеження ресурсів
- ізоляції процесів

## 14. Безпека
🔹 Обмеження
```ini
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full
```

## 15. Debugging сервісів
🔹 Запуск вручну
```bash
systemctl start myapp
systemctl status myapp
```

🔹 Перевірка файлу
```bash
systemd-analyze verify myapp.service
```

## ⚠️ 16. Типові проблеми
❌ Не стартує

👉 перевір:
```bash
systemctl status
journalctl -u
```

❌ Зміни не застосувались
```bash
systemctl daemon-reload
```
❌ Permission denied

👉 перевір:
- User
- права на файл

❌ killed

👉 можливо:
- OOM Killer
- limit CPU/RAM

##  17. Корисні команди (шпаргалка)
```bash
systemctl start SERVICE
systemctl stop SERVICE
systemctl restart SERVICE
systemctl status SERVICE
systemctl enable SERVICE
systemctl disable SERVICE
systemctl mask SERVICE
systemctl unmask SERVICE

journalctl -u SERVICE
journalctl -f

systemctl daemon-reload
systemctl list-units
systemctl list-unit-files
```
## 18. Важливі концепції (коротко)
- systemd = init + service manager
- unit = конфіг
- target = runlevel
- timer = cron
- journalctl = логи
- cgroups = ресурси


## 💡 19. Практичні кейси
🔹 Автозапуск Node.js
```ini
ExecStart=/usr/bin/node app.js
Restart=always
```
🔹 watchdog
```ini
Restart=on-failure
RestartSec=5
```
🔹 залежність від мережі
```ini
After=network-online.target
```

## Висновок

systemd — це:
- універсальний менеджер системи
- заміна init + cron + syslog
- потужний інструмент для DevOps і адмінів