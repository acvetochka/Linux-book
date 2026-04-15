# NetworkManager

## Що таке NetworkManager

`NetworkManager` — це системна служба керування мережевими підключеннями у дистрибутивах Linux. Вона автоматизує виявлення, налаштування та підтримання мережевих з’єднань, спрощуючи роботу користувача з дротовими, бездротовими, VPN і мобільними мережами. Розробляється спільнотою GNOME Project та підтримується більшістю сучасних систем Linux.

**Основні факти**
**Розробник**: GNOME Project / спільнота Linux

**Початковий реліз**: 2004 рік

**Мова програмування**: C

**Ліцензія**: GNU GPL v2

**Основний інтерфейс**: nmcli, nmtui, nm-applet

**Функціональність і компоненти**
NetworkManager складається з головного демона NetworkManager, який працює у фоновому режимі, та набору клієнтських інструментів. Графічна утиліта nm-applet інтегрується з середовищами GNOME або XFCE, тоді як nmcli та nmtui надають керування з командного рядка та текстового інтерфейсу. Система підтримує автоматичне перемикання між мережами, управління профілями з’єднань і інтеграцію з systemd.

**Використання та роль у системі**
NetworkManager спрощує налаштування інтерфейсів Ethernet, Wi-Fi, VPN, WWAN і мостів без необхідності ручного редагування конфігураційних файлів. У дистрибутивах, таких як Ubuntu, Fedora і openSUSE, він є службою за замовчуванням для керування мережею, хоча в серверних сценаріях може замінюватися легшими рішеннями (наприклад, systemd-networkd).

**Поточний стан і розвиток**
Станом на сьогодні NetworkManager активно розвивається та постійно інтегрує сучасні технології, включно з підтримкою WireGuard, IPv6, а також контейнеризованих середовищ. Його гнучкість і підтримка широкого спектра мережевих технологій роблять його стандартом де-факто в настільних і мобільних системах Linux.

## Концепція

`NetworkManager` — це сервіс (daemon), який:
> автоматично керує мережевими інтерфейсами, підключеннями та конфігурацією мережі

📌 Головна ідея

👉 Замість того, щоб:

- вручну прописувати IP (ip)
- редагувати конфіги (/etc/network/...)
- запускати DHCP

👉 ти працюєш з:
> "профілями підключення" (connections)

## 1. Архітектура
🔹 Компоненти  
1. Демон
     - NetworkManager
     - працює у фоні
2. CLI
      - nmcli - основний інструмент для нас
3. GUI
- nm-applet (іконка Wi-Fi)
- KDE / GNOME settings

4. Конфіг-файли
    ```bash
    /etc/NetworkManager/system-connections/
    ```

## 2. Основні сутності (дуже важливо)
📌 1. Device (пристрій)

👉 це:
- enp0s3
- wlan0

📌 фізичний або віртуальний інтерфейс

📌 2. Connection (підключення)

👉 це:
- налаштування мережі

Наприклад:
- "Home WiFi"
- "Office LAN"

📌 містить:

- IP
- gateway
- DNS
- тип (dhcp/static)

📌 3. Active connection

👉 зараз використовується

## 3. Як це працює
1. NetworkManager знаходить інтерфейси
2. застосовує connection
3. запускає DHCP або задає IP
4. налаштовує DNS
5. додає маршрути

## 4. Типи підключень
| Тип      | Опис      |
| -------- | --------- |
| ethernet | кабель    |
| wifi     | Wi-Fi     |
| loopback | lo        |
| bridge   | bridge    |
| bond     | агрегація |
| vlan     | VLAN      |
| vpn      | VPN       |

## 5. Де зберігається конфіг
📌 Файли
```bash
/etc/NetworkManager/system-connections/*.nmconnection
```
📌 Приклад
```ini
[connection]
id=Wired connection 1
type=ethernet

[ipv4]
method=auto
```

## 6. Стани NetworkManager
📌 Команда
```bash
nmcli general status
```
📤 Вивід
```bash
STATE      CONNECTIVITY  WIFI-HW  WIFI
connected  full          enabled  enabled
```

🔬 Розбір
`STATE`
- connected / disconnected

`CONNECTIVITY`
- none — нема інтернету
- portal — captive portal
- limited — частковий доступ
- full — все ок

`WIFI-HW`
- чи є Wi-Fi адаптер

## 7. Device vs Connection (критично)
📌 Device
```bash
nmcli device status
```
📤
```bash
DEVICE   TYPE      STATE      CONNECTION
enp0s3   ethernet  connected  Wired connection 1
```

🔬
- DEVICE — інтерфейс
- STATE — стан
- CONNECTION — профіль

## 8. Важливі особливості
❗ NetworkManager може:
- перезаписати ручні налаштування (ip)
- автоматично підключати мережі

❗ конфлікт з:
- systemd-networkd
- netplan (іноді)

## 9. Коли використовують NetworkManager
✅ Desktop
- майже завжди
  
⚠️ Server
- іноді вимикають
- використовують systemd-networkd

## 10. Як він пов’язаний з іншими інструментами
| Інструмент  | Роль           |
| ----------- | -------------- |
| ip          | низький рівень |
| nmcli       | високий рівень |
| netplan     | конфіг         |
| resolv.conf | DNS            |


## 11. Як NetworkManager працює з DHCP
### 11.1. Що таке DHCP в контексті NM

👉 `DHCP` = автоматичне отримання:

- IP
- gateway
- DNS
- lease time

📦 DHCP процес (DORA)
| Етап        | Що відбувається     |
| ----------- | ------------------- |
| Discover    | клієнт шукає сервер |
| Offer       | сервер пропонує IP  |
| Request     | клієнт погоджується |
| Acknowledge | сервер підтверджує  |

### 11.2. Як саме NetworkManager це робить
📌 Варіанти DHCP-клієнта

NetworkManager може використовувати:
- внутрішній DHCP клієнт (за замовчуванням)
- або зовнішній (dhclient, dhcpcd)

📌 Перевірка
```bash
nmcli device show enp0s3 | grep DHCP
```

### 11.3. Що відбувається при підключенні
🔹 1. Інтерфейс піднімається

(еквівалент `ip link set up`)

🔹 2. Запускається DHCP

👉 NM:
- генерує DHCP Discover
- чекає Offer

🔹 3. Отримує параметри

Наприклад:
```bash
IP:        192.168.1.100
Gateway:   192.168.1.1
DNS:       192.168.1.1
Lease:     86400
```

🔹 4. Застосовує їх

👉 через ip:

- додає IP
- додає route
- налаштовує DNS

### 11.4. Де це видно
📌
```bash
nmcli device show enp0s3
```
📤 Вивід (фрагмент)
```bash
IP4.ADDRESS[1]: 192.168.1.100/24
IP4.GATEWAY: 192.168.1.1
IP4.DNS[1]: 192.168.1.1
IP4.DOMAIN: local
IP4.DHCP4.OPTION[1]: lease_time = 86400
```

🔬 Розбір  

`IP4.ADDRESS`
- отриманий IP

`IP4.GATEWAY`
- default route

`IP4.DNS`
- DNS сервери

`IP4.DHCP4.OPTION`
- сирі DHCP опції

### 11.5. Lease (оренда IP)
📌 Що це

IP видається на час (lease)

🔹 NetworkManager:
- автоматично оновлює lease
- використовує T1/T2 таймери

### 11.6. Важливі нюанси DHCP
❗ IP може змінитись
- після перезапуску
- після закінчення lease

❗ NM кешує налаштування
- навіть якщо DHCP тимчасово недоступний

### 11.7. Керування DHCP через nmcli
🔹 увімкнути DHCP
```bash
nmcli connection modify "Wired connection 1" ipv4.method auto
```

🔹 вимкнути (статика)
```bash
nmcli connection modify "Wired connection 1" ipv4.method manual
```


## 12. Як NetworkManager працює з DNS
### 12.1. Концепція

👉 DNS у Linux зараз часто працює через:
- systemd-resolved

📌 Роль NM

NetworkManager:

- отримує DNS (через DHCP)
- передає їх у systemd-resolved

### 12.2. Як виглядає ланцюжок
> DHCP → NetworkManager → systemd-resolved → /etc/resolv.conf → додатки

### 12.3. /etc/resolv.conf (ключовий файл)
📌 Вивід
```bash
cat /etc/resolv.conf
```

📤
```bash
nameserver 127.0.0.53
```

🔬 Що це означає

👉 це НЕ реальний DNS

👉 це локальний stub resolver (systemd-resolved)

### 12.4. systemd-resolved
📌 команда
```bash
resolvectl status
```

📤 Вивід (фрагмент)
```bash
Link 2 (enp0s3)
    Current DNS Server: 192.168.1.1
    DNS Servers: 192.168.1.1
```

🔬 Розбір
- DNS застосовується на рівні інтерфейсу
- можна мати різні DNS для різних інтерфейсів

### 12.5. Як NM передає DNS

👉 NetworkManager:

- отримує DNS з DHCP
- викликає D-Bus API systemd-resolved
- встановлює DNS для інтерфейсу

### 12.6. Перевірка через nmcli
```bash
nmcli device show enp0s3
```
📤
```bash
IP4.DNS[1]: 192.168.1.1
```

### 12.7. Ручне налаштування DNS
🔹 задати DNS
```bash
nmcli connection modify "Wired connection 1" ipv4.dns "8.8.8.8 1.1.1.1"
```

🔹 вимкнути DHCP DNS
```bash
nmcli connection modify "Wired connection 1" ipv4.ignore-auto-dns yes
```

### 12.8. Важливі нюанси DNS
❗ resolv.conf може бути:
- symlink на systemd-resolved
- перезаписується NM

❗ не редагуй вручну

👉 зміни зникнуть

### 12.9. Часті проблеми
❌ DNS не працює

👉 перевір:

resolvectl status

❌ NM не передає DNS

👉 перевір:
```bash
nmcli device show
```

### 12.10. Глибоке розуміння (ключ)

👉 NetworkManager НЕ “робить DNS”

👉 він:

- отримує DNS
- передає далі


## Висновок

👉 NetworkManager:

- автоматизує мережу
- працює через profiles
- керує всім стеком (IP, DNS, routes)

**Дуже проста аналогія**
- `ip` → ручне керування машиною
- `NetworkManager` → автопілот

DHCP
- NM виступає як клієнт
- автоматично застосовує IP/route/DNS

DNS
- NM → systemd-resolved
- DNS застосовується на інтерфейс
