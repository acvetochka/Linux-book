# Утиліта tcpdump

`tcpdump` — це консольна програма для аналізу мережевого трафіку (packet analyzer), що дозволяє перехоплювати та переглядати пакети, які проходять через мережеві інтерфейси комп’ютера. Вона є стандартним інструментом у системному адмініструванні та комп’ютерній безпеці, широко використовується для діагностики, моніторингу та цифрової форензіки мереж.

**Ключові факти**
- **Початок розробки**: 1987 р. у Lawrence Berkeley Laboratory

- **Мова програмування**: C

- **Ліцензія**: BSD 3-Clause

- **Бібліотека-залежність**: libpcap

- **Офіційний сайт**: tcpdump.org

- **Історія та розвиток**

Інструмент створили Ван Джейкобсон (Van Jacobson), Крейг Лерес (Craig Leres) і Стівен МакКанн (Steven McCanne) у Lawrence Berkeley Laboratory для дослідження продуктивності TCP-мереж. У 1999 р. було засновано сайт tcpdump.org, який підтримує спільнота The Tcpdump Group. Програма стала базовим еталоном для багатьох утиліт аналізу мережі, включно з Wireshark.

**Функції та можливості**  
tcpdump відображає заголовки пакетів IP, TCP, UDP, ICMP, ARP, IPv6 та інших протоколів, використовуючи фільтри Berkeley Packet Filter (BPF) для вибіркового перехоплення. Програма може:

- читати трафік у реальному часі з мережевого інтерфейсу;

- зберігати дані у файли .pcap для подальшого аналізу;

- фільтрувати пакети за адресою, портом, протоколом або прапорами;

- відображати інформацію у зручному для читання форматі.

**Підтримувані системи**  
tcpdump доступний майже на всіх UNIX-подібних ОС (Linux, BSD, macOS, Solaris, HP-UX, AIX). Для Windows існує порт під назвою WinDump, який використовує бібліотеку WinPcap або Npcap.

**Практичне застосування**  
tcpdump є незамінним у відстеженні збоїв з’єднання, затримок, втрат пакетів і несанкціонованої активності. Його часто поєднують із Wireshark для глибшого графічного аналізу збережених дампів.

**Поточний стан**  
Проєкт активно підтримується спільнотою The Tcpdump Group на GitHub. Останні версії регулярно оновлюються для підтримки сучасних протоколів і безпекових стандартів.

## Концепція

tcpdump:
> перехоплює і показує реальні мережеві пакети, які проходять через інтерфейс

👉 працює через:
- libpcap
- raw sockets

**Що таке “пакет” тут**
```bash
Ethernet frame
  └── IP packet
        └── TCP/UDP segment
              └── payload (дані)
```
👉 tcpdump може показати кожен рівень

## 1. БАЗОВА КОМАНДА
📌
```bash
sudo tcpdump
```
📤 Вивід
```bash
IP 192.168.1.100.54321 > 142.250.74.14.443: Flags [S], seq 12345, win 64240, length 0
```

## 2. РОЗБІР КОЖНОГО ПОЛЯ
🔹 IP
- протокол рівня L3

🔹 192.168.1.100.54321
- source IP + порт

🔹 >
- напрямок

🔹 142.250.74.14.443
- destination IP + порт

🔹 Flags [S]
- TCP flags:  
  
      | Flag | Значення |
      | ---- | -------- |
      | S    | SYN      |
      | A    | ACK      |
      | F    | FIN      |
      | R    | RESET    |
      | P    | PUSH     |

🔹 seq 12345
- sequence number

🔹 win 64240
- TCP window

🔹 length 0
- payload size

## 3. ВИБІР ІНТЕРФЕЙСУ
🔹 список інтерфейсів
```bash
tcpdump -D
```
🔹 використання
```bash
sudo tcpdump -i enp0s3
```

## 4. ОСНОВНІ ОПЦІЇ (дуже важливо)
🔹 -n (без DNS)
```bash
tcpdump -n
```
👉 не резолвить IP → швидше

🔹 -nn (без DNS + портів)
```bash
tcpdump -nn
```
👉 не перекладає:
- IP
- порти

🔹 -v, -vv, -vvv (verbosity)
```bash
tcpdump -vv
```
📤 більше деталей:
- TTL
- ID
- options

🔹 -e (Ethernet)
```bash
tcpdump -e
```
📤 додає:
```bash
08:00:27:aa:bb:cc > ff:ff:ff:ff:ff:ff
```
👉 MAC адреси

🔹 -X (hex + ASCII)
```bash
tcpdump -X
```
📤
```bash
0x0000:  4500 003c ...
```
👉 payload у hex + текст

🔹 -A (ASCII)
```bash
tcpdump -A
```
👉 видно HTTP:
> GET / HTTP/1.1

🔹 -c (кількість пакетів)
```bash
tcpdump -c 5
```
👉 захопити 5 пакетів

🔹 -w (запис у файл)
```bash
tcpdump -w capture.pcap
```
👉 для Wireshark

🔹 -r (читати файл)
```bash
tcpdump -r capture.pcap
```

🔹 -s (snap length)
```bash
tcpdump -s 0
```
👉 захопити весь пакет

🔹 -t (без timestamp)
```bash
tcpdump -t
```

## 5. ФІЛЬТРИ (BPF) — НАЙВАЖЛИВІША ЧАСТИНА
📌 Синтаксис
```bash
tcpdump [options] expression
```
🔹 по протоколу
```bash
tcpdump tcp
tcpdump udp
tcpdump icmp
```

🔹 по IP
```bash
tcpdump host 8.8.8.8
```

🔹 тільки вихідні
```bash
tcpdump src 192.168.1.100
```

🔹 тільки вхідні
```bash
tcpdump dst 8.8.8.8
```

🔹 по порту
```bash
tcpdump port 80
```

🔹 комбіновано
```bash
tcpdump 'tcp and port 80'
```

🔹 AND / OR / NOT
```bash
tcpdump 'tcp and port 80 and host 1.2.3.4'
```

🔹 виключити
```bash
tcpdump 'not port 22'
```

🔹 діапазон
```bash
tcpdump portrange 1000-2000
```

## 6. ПРАКТИЧНІ СЦЕНАРІЇ
📌 1. DNS
```bash
tcpdump port 53
```
👉 бачиш запити

📌 2. HTTP
```bash
tcpdump -A port 80
```
👉 бачиш:

- GET
- headers
  
📌 3. SSH
```bash
tcpdump port 22
```

📌 4. перевірка доступу
```bash
tcpdump host 8.8.8.8
```

👉 чи йдуть пакети

📌 5. SYN flood
```bash
tcpdump 'tcp[tcpflags] & tcp-syn != 0'
```

## 7. ГЛИБШИЙ РІВЕНЬ (BPF байти)
🔹 TCP flags
```bash
tcpdump 'tcp[13] & 2 != 0'
```
👉 SYN

🔹 ACK
```bash
tcpdump 'tcp[13] & 16 != 0'
```

## 8. ВАЖЛИВІ НЮАНСИ
❗ потрібен root
```bash
sudo tcpdump
```
❗ багато трафіку → фільтруй  
❗ може впливати на продуктивність

## 9. ВИСНОВОК

👉 tcpdump — це:

- найнижчий рівень аналізу
- реальні пакети
- ключ до розуміння мережі

💡 Дуже проста аналогія
- `ss` → хто говорить
- `tcpdump` → що саме говорять