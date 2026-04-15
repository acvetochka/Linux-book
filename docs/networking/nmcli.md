# Утиліта nmcli

`nmcli` (NetworkManager Command-Line Interface) — це утиліта командного рядка для керування мережевими підключеннями в системах на базі Linux. Вона є частиною пакета NetworkManager і надає користувачам та сценаріям автоматизації можливість створювати, налаштовувати й діагностувати мережеві інтерфейси без графічного інтерфейсу.

**Ключові факти**
- **Розробник**: Red Hat

- **Тип програмного забезпечення**: CLI для керування мережею

- **Початковий випуск**: 2010 рік (разом з NetworkManager 0.8)

- **Підтримувані системи**: Linux-дистрибутиви (Fedora, RHEL, Ubuntu, Debian тощо)

- **Ліцензія**: GNU GPL

**Основні можливості**  
nmcli дозволяє переглядати статус мережі, активувати або деактивувати інтерфейси, керувати Wi-Fi, VPN, VLAN, мостами й іншими з’єднаннями. Команди утиліти організовані за підкомандами, такими як `nmcli device`, `nmcli connection`, `nmcli general`, що забезпечує модульний підхід до управління мережами.

**Використання та сценарії**  
nmcli широко застосовується адміністраторами серверів та системами автоматизації, де немає графічного середовища. Воно дозволяє створювати сценарії для підключення до мереж, налаштування IP-адрес, DNS і шлюзів, а також перевірки стану мережевих пристроїв. Завдяки стабільному CLI-інтерфейсу nmcli інтегрується з системами конфігураційного менеджменту (наприклад, Ansible).

**Взаємодія з NetworkManager**  
nmcli напряму взаємодіє з демоном NetworkManager через D-Bus, відображаючи його конфігурацію та статус у реальному часі. Зміни, внесені через nmcli, миттєво застосовуються до NetworkManager і, відповідно, до мережевих інтерфейсів. Це робить nmcli офіційним і рекомендованим засобом командного керування NetworkManager.

**Значення**  
Завдяки nmcli Linux-системи мають уніфікований спосіб конфігурування мереж без потреби в застарілих інструментах, таких як `ifconfig` або `iwconfig`. Це спрощує управління сучасними мережевими сценаріями, зокрема у хмарних і контейнеризованих середовищах.

## Концепція

`nmcli` — це CLI для керування
NetworkManager

👉 працює через D-Bus

📌 Синтаксис
```bash
nmcli [OPTIONS] OBJECT COMMAND [ARGUMENTS]
```

📌 Основні OBJECT
| OBJECT     | Що це           |
| ---------- | --------------- |
| general    | стан NM         |
| device     | інтерфейси      |
| connection | профілі         |
| networking | глобальний стан |
| radio      | Wi-Fi           |

## 1. nmcli general
📌 Команда
```bash
nmcli general status
```

📤 Вивід
```bash
STATE      CONNECTIVITY  WIFI-HW  WIFI     WWAN-HW  WWAN
connected  full          enabled  enabled  enabled  disabled
```

🔬 Розбір

`STATE`
- connected / disconnected
  
`CONNECTIVITY`
- none — немає мережі
- portal — captive portal
- limited — обмежений доступ
- full — інтернет працює

`WIFI-HW`
- апаратний стан адаптера

📌 Інші команди  

🔹 hostname
```bash
nmcli general hostname
```

🔹 змінити hostname
```bash
nmcli general hostname myhost
```

## 2. nmcli device
📌 Перегляд пристроїв
```bash
nmcli device status
```

📤
```bash
DEVICE   TYPE      STATE      CONNECTION
enp0s3   ethernet  connected  Wired connection 1
wlan0    wifi      disconnected --
```

🔬 Розбір
- DEVICE — інтерфейс
- TYPE — ethernet/wifi
- STATE:
  - connected
  - disconnected
  - unmanaged

📌 Детальна інформація
```bash
nmcli device show enp0s3
```

📤 (фрагмент)
```bash
GENERAL.DEVICE: enp0s3
GENERAL.STATE: 100 (connected)
IP4.ADDRESS[1]: 192.168.1.100/24
IP4.GATEWAY: 192.168.1.1
IP4.DNS[1]: 192.168.1.1
```

🔬 Розбір
`GENERAL.STATE: 100`
- 100 = connected
- (числові коди NM)

`IP4.ADDRESS`
- IP

`IP4.GATEWAY`
- маршрут

`IP4.DNS`
- DNS

⚙️ Дії з пристроями

🔹 підключити
```bash
nmcli device connect enp0s3
```

🔹 відключити
```bash
nmcli device disconnect enp0s3
```

🔹 рескан Wi-Fi
```bash
nmcli device wifi rescan
```

## 3. nmcli connection (найважливіше)
📌 список
```bash
nmcli connection show
```

📤
```bash
NAME                UUID                                  TYPE      DEVICE
Wired connection 1  a1b2c3d4-...                         ethernet  enp0s3
```

🔬
- NAME — профіль
- UUID — унікальний ID
- TYPE — ethernet/wifi
- DEVICE — прив’язка

📌 активні
```bash
nmcli connection show --active
```

⚙️ керування

🔹 активувати
```bash
nmcli connection up "Wired connection 1"
```
🔹 деактивувати
```bash
nmcli connection down "Wired connection 1"
```

## 4. СТВОРЕННЯ ПІДКЛЮЧЕННЯ
📌 DHCP ethernet
```bash
nmcli connection add type ethernet ifname enp0s3 con-name my-eth
```

📌 статичний IP
```bash
nmcli connection add type ethernet ifname enp0s3 con-name static \
  ip4 192.168.1.50/24 gw4 192.168.1.1
```

📌 Wi-Fi
```bash
nmcli device wifi connect "SSID" password "password"
```

## 5. РЕДАГУВАННЯ
🔹 змінити IP
```bash
nmcli connection modify my-eth ipv4.addresses 192.168.1.50/24
```

🔹 змінити gateway
```bash
nmcli connection modify my-eth ipv4.gateway 192.168.1.1
```

🔹 змінити ім’я connection
```bash
nmcli connection modify <старе_ім’я> connection.id <нове_ім’я>
```
```bash
nmcli connection modify "Wired connection 1" connection.id my-eth
```

🔹 DNS
```bash
nmcli connection modify my-eth ipv4.dns "8.8.8.8"
```

🔹 DHCP / static
```bash
nmcli connection modify my-eth ipv4.method auto
nmcli connection modify my-eth ipv4.method manual
```

🔹 ignore DHCP DNS
```bash
nmcli connection modify my-eth ipv4.ignore-auto-dns yes
```


## 6. Wi-Fi
📌 список
```bash
nmcli device wifi list
```

📤
```bash
SSID        SIGNAL  SECURITY
MyWiFi      80      WPA2
```

📌 підключення
```bash
nmcli device wifi connect "MyWiFi" password "12345678"
```

## 7. ЗАСТОСУВАННЯ ЗМІН

👉 після modify:
```bash
nmcli connection up my-eth
```

## 8. КОРОТКИЙ ВИВІД (дуже корисно)
🔹
```bash
nmcli -t -f DEVICE,STATE device
```

📤
```bash
enp0s3:connected
```

## 9. ВАЖЛИВІ НЮАНСИ
❗ nmcli не змінює “на льоту”

👉 змінює profile

❗ треба застосувати

👉 connection up

❗ може перезаписати ip зміни

## 10. ВИСНОВОК

👉 `nmcli`:

- керує профілями
- автоматизує мережу
- працює поверх `ip`

💡 Дуже проста схема
> nmcli → NetworkManager → ip → kernel