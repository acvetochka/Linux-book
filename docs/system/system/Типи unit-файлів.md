# Типи unit-файлів

## 1. Загальна картина

👉 У systemd є різні типи unit-ів:
| Тип       | Файл         | Для чого         |
| --------- | ------------ | ---------------- |
| service   | `.service`   | запуск програм   |
| target    | `.target`    | групи сервісів   |
| timer     | `.timer`     | аналог cron      |
| socket    | `.socket`    | запуск по запиту |
| path      | `.path`      | реакція на файл  |
| mount     | `.mount`     | монтування       |
| automount | `.automount` | lazy mount       |
| swap      | `.swap`      | swap             |
| device    | `.device`    | пристрої         |
| slice     | `.slice`     | групи ресурсів   |
| scope     | `.scope`     | зовнішні процеси |


## 2. SERVICE

👉 запускає програму
```ini
[Service]
ExecStart=/usr/bin/node app.js
```

## 3. TARGET — групи юнітів

👉 це як “режим системи”

**📌 Що це?**
> target = набір інших unit-ів

**🔥 Приклад:**
```ini
[Unit]
Description=My App Stack
Requires=nginx.service
Requires=postgres.service
```

**🧠 Використання:**
- запуск групи сервісів
- заміна runlevels

**📌 Важливі target-и:**
- multi-user.target
- graphical.target

## 4. TIMER — заміна cron

👉 запускає сервіс по часу

**📦 Пара файлів:**  
timer:
```ini
[Timer]
OnBootSec=5min
OnUnitActiveSec=1h
```
service:
```ini
[Service]
ExecStart=/usr/bin/backup.sh
```
🧠 Пояснення:

👉 "через 5 хв після старту, потім кожну годину"

🔥 Аналог cron:
```ini
OnCalendar=daily
```

## 5. SOCKET — запуск по запиту

👉 сервіс стартує тільки коли є підключення

**📌 Приклад:**
```ini
[Socket]
ListenStream=8080
```

**🧠 Як працює:**
1. systemd слухає порт
2. приходить запит
3. запускається service

👉 економія ресурсів

## 6. PATH — слідкує за файлами

👉 запускає сервіс, якщо змінюється файл

**📌 Приклад:**
```ini
[Path]
PathModified=/tmp/test.txt
```
👉 коли файл зміниться → запускається service

**🧠 Використання:**
- watcher
- автоматизація

## 7. MOUNT — монтування

👉 описує mount point

**📌 Приклад:**
```ini
[Mount]
What=/dev/sdb1
Where=/mnt/data
Type=ext4
```

👉 systemd сам змонтує

## 8. AUTOMOUNT — lazy mount

👉 монтує тільки коли звертаєшся

**📌 Приклад:**
```ini
[Automount]
Where=/mnt/data
```
👉 відкрив папку → змонтувалось

## 9. SWAP — swap
```ini
[Swap]
What=/swapfile
```
👉 керує swap

## 10. DEVICE — пристрої

👉 автоматично створюються systemd

Приклад:
- /dev/sda
- USB

👉 ти рідко їх пишеш вручну

## 11. SLICE — ресурси (cgroups)

👉 групи процесів

**📌 Приклад:**
```ini
[Slice]
CPUQuota=50%
```
👉 обмеження ресурсів

## 12. SCOPE — зовнішні процеси

👉 systemd контролює процес, який він НЕ запустив

Приклад:
```bash
systemd-run --scope htop
```

## 13. Як вони працюють разом (дуже важливо)
Приклад:
```bash
.timer → запускає → .service
.socket → запускає → .service
.path → запускає → .service
.target → групує → service
```
👉 service = ядро всього

## 14. Як вибрати що використовувати
| Потрібно           | Використовуй |
| ------------------ | ------------ |
| запустити програму | service      |
| cron               | timer        |
| запуск по порту    | socket       |
| watcher файлів     | path         |
| mount              | mount        |
| група сервісів     | target       |


## 15. Реальні кейси (дуже корисно)
🔹 backup раз на день 👉 timer + service

🔹 nginx on-demand 👉 socket + service

🔹 rebuild при зміні файлу 👉 path + service

🔹 весь стек (nginx + api + db) 👉 target

## Висновок

👉 systemd — це не тільки про сервіси

👉 це:

- scheduler (timer)
- watcher (path)
- network daemon (socket)
- init system (target)
- resource manager (slice)