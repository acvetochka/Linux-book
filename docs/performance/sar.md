# 📊 sar — System Activity Reporter <!-- omit in toc -->

- [📌 Опис](#-опис)
- [Як працює](#як-працює)
- [Основні режими роботи](#основні-режими-роботи)
- [Основні групи метрик](#основні-групи-метрик)
  - [🧮 CPU](#-cpu)
  - [💾 Memory](#-memory)
  - [🔁 Swap](#-swap)
  - [📄 Paging (дуже важливо)](#-paging-дуже-важливо)
  - [💽 Disk I/O](#-disk-io)
  - [🌐 Network](#-network)
  - [🧵 Processes / context switch](#-processes--context-switch)
  - [🧱 Load average](#-load-average)
  - [🔒 Kernel / system](#-kernel--system)
  - [📊 Interrupts](#-interrupts)
- [🔑 Повний список ключів (основні)](#-повний-список-ключів-основні)
- [Приклади використання](#приклади-використання)
- [⚠️ Типові проблеми](#️-типові-проблеми)
- [🧠 Як використовувати для troubleshooting](#-як-використовувати-для-troubleshooting)
- [📌 Висновок](#-висновок)
- [🔥 Найважливіше запам’ятати](#-найважливіше-запамятати)


## 📌 Опис

`sar` — це утиліта для збору, перегляду та аналізу статистики роботи системи.

Вона входить у пакет:

👉 sysstat

Для роботи запустити 
```bash
sudo systemctl start sysstat
```
🎯 Для чого використовується

sar застосовується для:
- 📊 моніторингу продуктивності системи
- 🔍 аналізу вузьких місць (CPU, RAM, IO, мережа)
- 📈 історичного аналізу (що було годину/день тому)
- 🧠 troubleshooting (lag, high load, OOM, swap)


## Як працює

sar сам не збирає дані постійно.

👉 Дані збирає демон:
- sadc (System Activity Data Collector)

Він записує їх у файли:
```bash
/var/log/sysstat/saXX
```
де `XX` — день місяця

## Основні режими роботи
1️⃣ Live-режим (онлайн)
```bash
sar 1 5
```
- кожну 1 секунду
- 5 разів

2️⃣ Історичні дані
```bash
sar -u -f /var/log/sysstat/sa26
```
або:
```bash
sar -u -s 10:00:00 -e 12:00:00
```

## Основні групи метрик
### 🧮 CPU
```bash
sar -u
```

| Поле    | Опис                        |
| ------- | --------------------------- |
| %user   | user space                  |
| %system | kernel space                |
| %nice   | процеси з nice              |
| %iowait | очікування IO               |
| %steal  | час, вкрадений гіпервізором |
| %idle   | idle                        |

📌 Важливо:

- високий %iowait → проблема з диском
- високий %system → проблема в ядрі/драйверах

### 💾 Memory
```bash
sar -r
```

| Поле      | Опис           |
| --------- | -------------- |
| kbmemfree | вільна памʼять |
| kbmemused | використана    |
| %memused  | % використання |
| kbbuffers | buffers        |
| kbcached  | cache          |

### 🔁 Swap
```bash
sar -W
```

| Поле      | Опис     |
| --------- | -------- |
| pswpin/s  | swap in  |
| pswpout/s | swap out |

📌 Норма:
> 0 або майже 0

### 📄 Paging (дуже важливо)
```bash
sar -B
```

| Поле      | Опис                 |
| --------- | -------------------- |
| pgpgin/s  | сторінки з диска     |
| pgpgout/s | сторінки на диск     |
| fault/s   | page faults          |
| majflt/s  | major faults         |
| pgfree/s  | звільнені сторінки   |
| pgscank/s | scan kswapd          |
| pgscand/s | scan direct          |
| pgsteal/s | reclaimed pages      |
| %vmeff    | ефективність reclaim |

📌 Інтерпретація:
- pgscand/s > 0 → процеси страждають
- низький %vmeff → погана ефективність

### 💽 Disk I/O
```bash
sar -d
```

| Поле  | Опис               |
| ----- | ------------------ |
| tps   | транзакції         |
| rkB/s | read KB/s          |
| wkB/s | write KB/s         |
| await | latency            |
| %util | завантаження диска |

📌 Важливо:
- %util ~ 100% → диск перевантажений
- await > 20-50 ms → проблема

### 🌐 Network
```bash
sar -n DEV
```

| Поле   | Опис     |
| ------ | -------- |
| rxkB/s | receive  |
| txkB/s | transmit |

Детальніше:
```bash
sar -n TCP
sar -n UDP
sar -n SOCK
```

### 🧵 Processes / context switch
```bash
sar -w
```

| Поле    | Опис             |
| ------- | ---------------- |
| cswch/s | context switches |
| proc/s  | нові процеси     |

### 🧱 Load average
```bash
sar -q
```

| Поле     | Опис            |
| -------- | --------------- |
| runq-sz  | runnable        |
| plist-sz | всього процесів |
| ldavg-1  | load avg        |

### 🔒 Kernel / system
```bash
sar -v
```

### 📊 Interrupts
```bash
sar -I SUM
```

## 🔑 Повний список ключів (основні)
| Ключ | Значення     |
| ---- | ------------ |
| -u   | CPU          |
| -r   | RAM          |
| -W   | swap         |
| -B   | paging       |
| -d   | disk         |
| -n   | network      |
| -q   | load         |
| -w   | processes    |
| -I   | interrupts   |
| -v   | kernel       |
| -f   | файл         |
| -s   | start time   |
| -e   | end time     |
| -o   | запис у файл |

##  Приклади використання
🔹 CPU в реальному часі
```bash
sar -u 1 5
```
🔹 Swap activity
```bash
sar -W 1 5
```
🔹 Paging
```bash
sar -B 1 5
```
🔹 Disk bottleneck
```bash
sar -d 1 5
```
🔹 Network
```bash
sar -n DEV 1 5
```
🔹 Історія за день
```bash
sar -u -f /var/log/sysstat/sa26
```
🔹 Інтервал часу
```bash
sar -u -s 10:00:00 -e 11:00:00
```

## ⚠️ Типові проблеми
❌ sar нічого не показує

Причини:
- не працює sysstat
- немає історії
- WSL / контейнер

❌ Немає pgscank/s

Причини:
- інша версія Linux
- інша версія sysstat
- метрики в /proc/vmstat з іншими назвами:
- pgscan_kswapd
- pgscan_direct

❌ WSL

👉 Windows Subsystem for Linux

- немає нормального збору статистики
- sar працює частково

## 🧠 Як використовувати для troubleshooting
🚨 Сервер лагає

1️⃣ CPU:
```bash
sar -u
```
2️⃣ IO:
```bash
sar -d
```
3️⃣ Memory:
```bash
sar -r
sar -W
sar -B
``
4️⃣ Network:
```bash
sar -n DEV
```

## 📌 Висновок

`sar` — це:
- універсальний інструмент моніторингу
- працює з історичними даними
- ключовий для performance troubleshooting

## 🔥 Найважливіше запам’ятати
- sar -u → CPU
- sar -r → RAM
- sar -W → swap
- sar -B → paging
- sar -d → disk
- sar -n DEV → network