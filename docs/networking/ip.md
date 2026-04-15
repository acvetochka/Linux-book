# Утиліта ip (iproute2)

`ip` — це консольна утиліта в системах Linux, що входить до пакета iproute2 і використовується для налаштування та моніторингу мережевих інтерфейсів, маршрутів, тунелів і правил. Вона є сучасною заміною старих інструментів, таких як `ifconfig`, `route` та `netstat`, пропонуючи розширені можливості управління мережею.

Основні факти
- **Пакет**: iproute2

- **Розробник**: спільнота Linux (спочатку Alexey Kuznetsov)

- **Підтримувані платформи**: більшість дистрибутивів Linux

- **Тип ліцензії**: GNU General Public License (GPL)

- **Основна роль**: управління мережею через Netlink API ядра Linux

**Функціональність**  
Утиліта `ip` дозволяє адмініструвати всі ключові аспекти мережевого стеку Linux. Вона підтримує операції з інтерфейсами (`ip link`), адресами (`ip addr`), маршрутами (`ip route`), правилами маршрутизації (`ip rule`), тунелями (`ip tunnel`) і мережевими просторами імен (ip netns). Команди реалізовані як вкладені підкоманди з єдиною узгодженою структурою.

**Архітектура та реалізація**  
`ip` взаємодіє з ядром Linux через Netlink, механізм міжпроцесної комунікації, який дозволяє отримувати й змінювати мережеві параметри в реальному часі. Це забезпечує більшу гнучкість і швидкодію порівняно з утилітами, які працюють через застарілі ioctl-виклики.

**Практичне значення**  
`ip` є стандартним інструментом адміністрування мереж у сучасних Linux-системах, включно з контейнерними середовищами, такими як Docker і Kubernetes. Його універсальний синтаксис робить можливим автоматизацію складних мережевих конфігурацій через сценарії.

**Приклади використання**
- Перегляд інтерфейсів: `ip link show`

- Призначення IP-адреси: `ip addr add 192.168.1.10/24 dev eth0`

- Налаштування маршруту: `ip route add default via 192.168.1.1`

## Концепція (дуже важливо)

ip — це універсальна утиліта для роботи з:
- інтерфейсами (link)
- адресами (addr)
- маршрутами (route)
- ARP/neighbor (neigh)
- тунелями (tunnel)
- правилами маршрутизації (rule)

👉 Синтаксис:
```bash
ip [OPTIONS] OBJECT COMMAND
```

| Частина | Значення                    |
| ------- | --------------------------- |
| OBJECT  | link / addr / route / neigh |
| COMMAND | show / add / del / set      |

## 1. ip addr — адреси

### 1.1 Перегляд
```bash
ip addr show
```

📤 Вивід (реалістичний)
```bash
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 08:00:27:4e:66:a1 brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.100/24 brd 192.168.1.255 scope global dynamic noprefixroute enp0s3
    valid_lft 86399sec preferred_lft 86399sec
    inet6 fe80::a00:27ff:fe4e:66a1/64 scope link
    valid_lft forever preferred_lft forever
```

🔬 Розбір КОЖНОГО поля  
`2: enp0s3`
- 2 — ifindex (використовується ядром)
- enp0s3 — predictable name

`<BROADCAST,MULTICAST,UP,LOWER_UP>`
- UP — інтерфейс увімкнений
- LOWER_UP — фізичний сигнал (кабель/лінк)
- BROADCAST — підтримка broadcast
- MULTICAST — підтримка multicast

`mtu 1500`
- max packet size  
👉 впливає на fragmentation

`qdisc fq_codel`
- queue discipline (контроль черги)
- fq_codel → боротьба з bufferbloat

`state UP`
- стан ядра (може бути DOWN навіть якщо link UP)

`group default`
- група інтерфейсів

`qlen 1000`
- довжина черги

`link/ether 08:00:27:4e:66:a1`
- MAC адреса


`brd ff:ff:ff:ff:ff:ff`
- broadcast MAC

`inet 192.168.1.100/24`
- IPv4 адреса
- CIDR маска

`brd 192.168.1.255`
- broadcast IP

`scope global`
- доступність:
  - global
  - link
  - host

`dynamic`
- отримано через DHCP

`noprefixroute`
- не створює автоматично маршрут

`valid_lft`
- lifetime адреси

`preferred_lft`
- preferred lifetime

### 1.2 ВСІ ключові опції
🔹 ip -br addr (коротко)
```bash
ip -br addr
```
Вивід:
```bash
enp0s3    UP   192.168.1.100/24
lo        UNKNOWN 127.0.0.1/8
```

🔹 ip -4 addr

👉 тільки IPv4

🔹 ip -6 addr

👉 тільки IPv6

🔹 ip addr show dev enp0s3

👉 конкретний інтерфейс

🔹 ip addr show up

👉 тільки активні

### 1.3 ЗМІНА НА ЛЬОТУ (ключова частина)
🔹 Додати IP
```bash
sudo ip addr add 192.168.1.200/24 dev enp0s3
```
📤 Вивід:
(нічого)

📌 Що сталося:
> додалась ДРУГА адреса

Перевірка:
```bash
ip addr show dev enp0s3
```
👉 буде дві inet

🔹 Видалити IP
```bash
sudo ip addr del 192.168.1.200/24 dev enp0s3
```
🔹 Замінити IP (правильний спосіб)
```bash
sudo ip addr flush dev enp0s3
sudo ip addr add 192.168.1.50/24 dev enp0s3
```

⚠️ flush:

видаляє ВСІ IP

🔹 Додати alias (старий стиль)
```bash
ip addr add 192.168.1.101/24 dev enp0s3 label enp0s3:1
```

## 2. ip link — інтерфейси
📌 Перегляд
```bash
ip link show
```

📤 Вивід
```bash
2: enp0s3: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP mode DEFAULT group default qlen 1000
```

🔬 Поля
- mode DEFAULT
- group
- qlen

⚙️ ЗМІНА НА ЛЬОТУ  
🔹 Включити
```bash
sudo ip link set enp0s3 up
```

🔹 Виключити
```bash
sudo ip link set enp0s3 down.
```
🔹 Змінити MTU
```bash
sudo ip link set enp0s3 mtu 1400
```
🔹 Змінити MAC
```bash
sudo ip link set dev enp0s3 address 02:11:22:33:44:55.
```

🔹 Перейменувати
```bash
sudo ip link set enp0s3 name eth0
```

⚠️ інтерфейс має бути down

## 3. ip route — маршрути
📌 Перегляд
```bash
ip route show
```
📤 Вивід
```bash
default via 192.168.1.1 dev enp0s3 proto dhcp metric 100
192.168.1.0/24 dev enp0s3 proto kernel scope link src 192.168.1.100
```

🔬 Розбір

`default`
- маршрут за замовчуванням

`via 192.168.1.1`
- gateway

`dev enp0s3`
- інтерфейс

`proto dhcp`
- джерело маршруту

`metric 100`
- пріоритет (менше = краще)

⚙️ ЗМІНА НА ЛЬОТУ  
🔹 Додати default
```bash
sudo ip route add default via 192.168.1.1
```
🔹 Видалити
```bash
sudo ip route del default
```
🔹 Додати маршрут
```bash
sudo ip route add 10.0.0.0/24 via 192.168.1.1
```
🔹 Замінити
```bash
sudo ip route replace default via 192.168.1.254
```
🔹 Перевірка маршруту
```bash
ip route get 8.8.8.8
```
📤
```bash
8.8.8.8 via 192.168.1.1 dev enp0s3 src 192.168.1.100
```

## 4. ip neigh — ARP
📌 Перегляд
```bash
ip neigh
```

📤
```bash
192.168.1.1 dev enp0s3 lladdr aa:bb:cc:dd:ee:ff REACHABLE
```

🔬 Поля
- lladdr — MAC
- REACHABLE — стан

⚙️ ЗМІНА  
🔹 Додати
```bash
ip neigh add 192.168.1.10 lladdr aa:bb:cc:dd:ee:ff dev enp0s3
```
🔹 Видалити
```bash
ip neigh del 192.168.1.10 dev enp0s3
```

## ВАЖЛИВО (підсумок по ip)

👉 ip дозволяє:
- повністю керувати мережею БЕЗ перезапуску
- змінювати все “на льоту”
- працювати без GUI і сервісів

❗ Часті помилки
- забули dev
- неправильна маска
- конфлікт IP
- немає route після зміни IP