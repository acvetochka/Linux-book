# Troubleshooting <!-- omit in toc -->

## Зміст <!-- omit in toc -->


- [1. Що таке “швидкодія” в Linux](#1-що-таке-швидкодія-в-linux)
  - [1.1 Визначення](#11-визначення)
  - [1.2 4 ключові ресурси (Golden Signals Linux)](#12-4-ключові-ресурси-golden-signals-linux)
  - [1.3 Bottleneck (вузьке місце)](#13-bottleneck-вузьке-місце)
- [2. Загальний алгоритм troubleshooting](#2-загальний-алгоритм-troubleshooting)
  - [2.1 Головне правило](#21-головне-правило)
  - [2.2 Універсальний алгоритм](#22-універсальний-алгоритм)
  - [2.3 Швидкий чек (SRE-style)](#23-швидкий-чек-sre-style)
  - [2.4 Метод USE (найважливіший)](#24-метод-use-найважливіший)
- [3. CPU troubleshooting](#3-cpu-troubleshooting)
  - [3.1 Основні метрики CPU](#31-основні-метрики-cpu)
  - [3.2 top / htop](#32-top--htop)
  - [3.3 ps — snapshot процесів](#33-ps--snapshot-процесів)
  - [3.4 uptime — load average](#34-uptime--load-average)
  - [3.5 mpstat (детально по ядрах)](#35-mpstat-детально-по-ядрах)
  - [3.6 Типові проблеми CPU](#36-типові-проблеми-cpu)
- [4. RAM troubleshooting](#4-ram-troubleshooting)
  - [4.1 free](#41-free)
  - [4.2 swap](#42-swap)
  - [4.3 vmstat](#43-vmstat)
  - [4.4 OOM Killer](#44-oom-killer)
  - [4.5 smem / pmap](#45-smem--pmap)
  - [4.6 Типові проблеми](#46-типові-проблеми)
- [5. Disk (I/O) troubleshooting](#5-disk-io-troubleshooting)
  - [5.1 iostat (найважливіше)](#51-iostat-найважливіше)
  - [5.2 iotop](#52-iotop)
  - [5.3 df](#53-df)
  - [5.4 du](#54-du)
  - [5.5 Типи IO проблем](#55-типи-io-проблем)
- [6. Network troubleshooting](#6-network-troubleshooting)
  - [6.1 ping](#61-ping)
  - [6.2 ss / netstat](#62-ss--netstat)
  - [6.3 iftop](#63-iftop)
  - [6.4 nload](#64-nload)
  - [6.5 tcpdump (просунуто)](#65-tcpdump-просунуто)
  - [6.6 Типові проблеми](#66-типові-проблеми)
- [7. IO wait — найважливіша тема](#7-io-wait--найважливіша-тема)
  - [7.1 Що це](#71-що-це)
  - [7.2 Як виглядає](#72-як-виглядає)
  - [7.3 Причини](#73-причини)
- [8. Стрес-тестування](#8-стрес-тестування)
  - [8.1 stress](#81-stress)
  - [8.2 stress-ng](#82-stress-ng)
  - [8.3 fio (disk test)](#83-fio-disk-test)
- [9. Advanced tools](#9-advanced-tools)
  - [9.1 atop](#91-atop)
  - [9.2 dstat](#92-dstat)
  - [9.3 sar](#93-sar)
  - [9.4 perf](#94-perf)
  - [9.5 strace](#95-strace)
- [10. Практичні сценарії](#10-практичні-сценарії)
- [11. Головні патерни](#11-головні-патерни)
  - [11.1 CPU bound vs IO bound](#111-cpu-bound-vs-io-bound)
  - [11.2 Cache vs RAM](#112-cache-vs-ram)
  - [11.3 Scaling](#113-scaling)
- [12. Cheat Sheet](#12-cheat-sheet)
- [Висновок (дуже важливий)](#висновок-дуже-важливий)

## 1. Що таке “швидкодія” в Linux

### 1.1 Визначення

`Швидкодія` (performance) — це здатність системи обробляти навантаження з мінімальними затримками.

Основні метрики:
| Метрика     | Що означає                    |
| ----------- | ----------------------------- |
| Latency     | Час відповіді                 |
| Throughput  | Кількість операцій за секунду |
| Load        | Навантаження на систему       |
| Utilization | Наскільки зайнятий ресурс     |
| Saturation  | Чи є “черги”                  |

### 1.2 4 ключові ресурси (Golden Signals Linux)

Будь-який performance-проблема — це один із 4 ресурсів:
- CPU
- RAM
- Disk (I/O)
- Network

👉 90% troubleshooting = знайти, який ресурс є bottleneck

### 1.3 Bottleneck (вузьке місце)

`Bottleneck` — ресурс, який обмежує систему

Приклади:
- CPU 100% → процеси не виконуються
- RAM закінчилась → swap → повільно
- Disk повільний → IO wait
- Network → затримки

## 2. Загальний алгоритм troubleshooting

### 2.1 Головне правило

👉 НЕ починати з “фіксів”, а з діагностики

### 2.2 Універсальний алгоритм
1. Симптом
2. Визначити ресурс
3. Визначити причину
4. Підтвердити метриками
5. Виправити

### 2.3 Швидкий чек (SRE-style)
```bash
uptime
top
free -h
df -h
iostat
```

### 2.4 Метод USE (найважливіший)

Для кожного ресурсу дивимось:

| Показник    | Що означає         |
| ----------- | ------------------ |
| Utilization | наскільки зайнятий |
| Saturation  | чи є черга         |
| Errors      | помилки            |

## 3. CPU troubleshooting
### 3.1 Основні метрики CPU
**Load Average**
```bash
uptime
```
```bash
load average: 1.23, 0.85, 0.60
```
👉 це НЕ %
👉 це кількість процесів, що чекають CPU

✔ правило:
- load ≈ кількість CPU → нормально
- load > CPU → перевантаження

### 3.2 top / htop

`top` — інтерактивний монітор процесів у реальному часі

```bash
top
```

📌 Основні секції  
🔹 CPU summary
```
%Cpu(s): 10.0 us, 5.0 sy, 0.0 ni, 80.0 id, 5.0 wa
```
Ключові поля:

| Поле | Значення   |
| ---- | ---------- |
| us   | user CPU   |
| sy   | kernel CPU |
| id   | idle       |
| wa   | IO wait ⚠️  |

🔴 Важливо
> wa (IO wait) > 20% → проблема диску

📌 Список процесів
| Колонка | Значення         |
| ------- | ---------------- |
| PID     | id процесу       |
| %CPU    | використання CPU |
| %MEM    | пам’ять          |
| TIME+   | CPU час          |
| COMMAND | команда          |

📌 Важливі клавіші
| Клавіша | Дія               |
| ------- | ----------------- |
| P       | сортування по CPU |
| M       | по пам’яті        |
| k       | kill процес       |
| r       | змінити priority  |

📌 Приклад аналізу
```bash
CPU 90%
1 процес має 85%
→ bottleneck знайдено
```

### 3.3 ps — snapshot процесів

Показує список процесів (НЕ realtime)

Команда
```bash
ps aux
```
📌 Пояснення
| Поле | Значення        |
| ---- | --------------- |
| a    | всі процеси     |
| u    | user format     |
| x    | включає без TTY |

```bash
ps aux --sort=-%cpu | head
```
👉 показує хто “їсть” CPU

### 3.4 uptime — load average
📌 Команда
```bash
uptime
```
```
load average: 1.00, 0.80, 0.50
```
📌 Що це

👉 кількість процесів, які:
- виконуються
- або чекають CPU

📌 Інтерпретація
```
CPU = 4 ядра

load = 4 → нормально
load = 8 → перевантаження
```

❗ Часта помилка:

| Ситуація                  | Пояснення      |
| ------------------------- | -------------- |
| CPU 100%                  | CPU bottleneck |
| Load високий, CPU низький | IO bottleneck  |

### 3.5 mpstat (детально по ядрах)
```bash
mpstat -P ALL 1
```
- показує кожне ядро
- баланс навантаження

📌 Ключі
| Ключ   | Значення      |
| ------ | ------------- |
| -P ALL | всі ядра      |
| 1      | кожну секунду |

📌 Навіщо

👉 знайти:
```bash
1 ядро 100%, інші idle → single-thread bottleneck
```

### 3.6 Типові проблеми CPU
🔹 1. CPU bound процес
```C
while true; do :; done
```
✔ рішення:
- оптимізація коду
- обмеження CPU (nice, cgroups)

🔹 2. Context switching

Занадто багато процесів → overhead

🔹 3. Interrupts / kernel load
```bash
top → sy %
```

## 4. RAM troubleshooting
### 4.1 free
```bash
free -h
```
Приклад:
```bash
Mem: 8G total, 7G used, 1G free
```

 Важливо

>❗ Linux використовує RAM як cache  
> used ≠ проблема  
> available — головне поле (реально доступна пам’ять)

### 4.2 swap
```bash
swapon --show
```
👉 якщо swap активно використовується → погано

### 4.3 vmstat
```bash
vmstat 1
```
Ключові поля:

| Поле | Значення   |
| ---- | ---------- |
| si   | swap in    |
| so   | swap out ⚠️ |
| r    | runnable   |
| b    | blocked    |

🔴 Якщо:
> so > 0 → система “помирає”

### 4.4 OOM Killer
```bash
dmesg | grep -i kill
```
👉 Linux вбиває процеси

### 4.5 smem / pmap
```bash
pmap -x PID
```

👉 пам’ять процесу

### 4.6 Типові проблеми
- memory leak
- swap thrashing
- overcommit

## 5. Disk (I/O) troubleshooting

### 5.1 iostat (найважливіше)
```bash
iostat -x 1
```

Ключі
| Ключ | Значення             |
| ---- | -------------------- |
| -x   | розширена статистика |
| 1    | кожну секунду        |

Ключові поля:

| Поле     | Значення           |
| -------- | ------------------ |
| %util    | використання диску |
| await    | затримка ⚠️         |
| r/s, w/s | операції           |

🔴 Правила
- await > 10ms → проблема
- %util ~100% → диск забитий

### 5.2 iotop
```bash
iotop
```
👉 хто пише/читає

```bash
iotop -o
```
👉 тільки активні процеси

### 5.3 df
```bash
df -h
```

👉 заповненість файлової системи

🔴 Проблема

> 100% → система ламається

### 5.4 du
```bash
du -sh *
```

👉 показує розмір файлів/папок

### 5.5 Типи IO проблем
🔹 1. Slow disk

HDD vs SSD
***
🔹 2. Random IO

База даних → багато дрібних операцій
***
🔹 3. Queue

await ↑ → черга
***

## 6. Network troubleshooting
### 6.1 ping
```bash
ping google.com
```
👉 latency

### 6.2 ss / netstat
```bash
ss -tuln
```
👉 відкриті 

Ключі
| Ключ | Значення  |
| ---- | --------- |
| -t   | TCP       |
| -u   | UDP       |
| -l   | listening |
| -n   | без DNS   |

### 6.3 iftop
```bash
iftop
```
👉 хто генерує трафік

### 6.4 nload

👉 простий графік

### 6.5 tcpdump (просунуто)
```bash
tcpdump -i eth0
```

### 6.6 Типові проблеми
- packet loss
- high latency
- connection limits

## 7. IO wait — найважливіша тема

### 7.1 Що це

IO wait — час, коли CPU чекає диск

### 7.2 Як виглядає
```bash
top → wa = 40%
CPU idle ≠ проблема CPU
```

### 7.3 Причини
- повільний диск
- багато IO
- swap

##  8. Стрес-тестування
### 8.1 stress
```bash
stress --cpu 4
```

### 8.2 stress-ng
```bash
stress-ng --vm 2 --vm-bytes 1G
```

### 8.3 fio (disk test)
```bash
fio --name=test --rw=randread --size=1G
```

## 9. Advanced tools
### 9.1 atop
```bash
atop
```
👉 історія системи

###  9.2 dstat
```bash
dstat
```

### 9.3 sar
sar -u 1

👉 історичні дані

### 9.4 perf
```bash
perf top
```
👉 профілювання CPU

### 9.5 strace
```bash
strace -p PID
```
👉 що робить процес

## 10. Практичні сценарії
🔴 Сценарій 1: сайт повільний
- 0top → CPU?
- iostat → диск?
- free → swap?

🔴 Сценарій 2: load високий
- load ↑
- CPU idle → IO проблема
  
🔴 Сценарій 3: сервер “висить”
- `vmstat`
- `dmesg`
  
🔴 Сценарій 4: база гальмує
- `iostat`
- `iotop`

## 11. Головні патерни
### 11.1 CPU bound vs IO bound

| Тип       | Ознака     |
| --------- | ---------- |
| CPU bound | CPU 100%   |
| IO bound  | wa високий |

### 11.2 Cache vs RAM

Linux використовує RAM ефективно

### 11.3 Scaling
- vertical (додати ресурси)
- horizontal (більше серверів)

## 12. Cheat Sheet
🔥 Швидка діагностика
```bash
top
htop
free -h
iostat -x 1
vmstat 1
```
🔥 Знайти проблему
| Симптом | Інструмент |
| ------- | ---------- |
| CPU     | top        |
| RAM     | free       |
| Disk    | iostat     |
| Network | iftop      |

## Висновок (дуже важливий)

👉 Performance — це НЕ про команди  
👉 Це про мислення

Головна формула:
```bash
Симптом → Ресурс → Метрика → Причина → Рішення
```