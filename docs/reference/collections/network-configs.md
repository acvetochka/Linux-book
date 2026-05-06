# 🌐 КОНФІГУРАЦІЙНІ ФАЙЛИ. МЕРЕЖА (розширено: routing, NAT, firewall)

## 🔹 🧭 NetworkManager (детальніше)
| Файл                                       | Що містить                                |
| ------------------------------------------ | ----------------------------------------- |
| `/etc/NetworkManager/system-connections/*` | профілі інтерфейсів (IP, gateway, routes) |
| `/etc/NetworkManager/NetworkManager.conf`  | глобальні налаштування                    |
| `/run/NetworkManager/`                     | runtime стан                              |


> [!NOTE]👉 ВАЖЛИВО:
`nmcli` змінює саме ці файли

## 🔹 🌐 Інтерфейси та IP (runtime)
| Шлях                 | Що містить                |
| -------------------- | ------------------------- |
| `/proc/net/dev`      | статистика інтерфейсів    |
| `/sys/class/net/`    | інформація про інтерфейси |
| `/proc/net/fib_trie` | структура IP-адрес        |


## 🔹 🧭 Маршрутизація
| Шлях                      | Що містить               |
| ------------------------- | ------------------------ |
| `/proc/net/route`         | таблиця маршрутів (IPv4) |
| `/proc/net/ipv6_route`    | IPv6 маршрути            |
| `/etc/iproute2/rt_tables` | кастомні routing tables  |


👉 команда:
```bash
ip route
```

## 🔹 🔁 Kernel networking (sysctl)
| Файл                            | Що містить                   |
| ------------------------------- | ---------------------------- |
| `/proc/sys/net/ipv4/ip_forward` | увімкнення маршрутизації     |
| `/proc/sys/net/ipv4/*`          | параметри TCP/IP             |
| `/etc/sysctl.conf`              | постійні налаштування        |
| `/etc/sysctl.d/*.conf`          | сучасний спосіб конфігурації |

## 🔹 🔥 Firewall (iptables / netfilter)
| Шлях                          | Що містить                         |
| ----------------------------- | ---------------------------------- |
| `/proc/net/ip_tables_names`   | список таблиць (filter, nat, etc.) |
| `/proc/net/ip_tables_matches` | доступні match модулі              |
| `/proc/net/ip_tables_targets` | доступні target                    |
| `/proc/net/nf_conntrack`      | активні NAT/conntrack з'єднання    |


👉 це реальний стан firewall у ядрі

## 📌 Конфіг (залежить від дистрибутива)
🔹 RedHat / CentOS / AlmaLinux
| Файл                       | Що містить             |
| -------------------------- | ---------------------- |
| `/etc/sysconfig/iptables`  | збережені правила IPv4 |
| `/etc/sysconfig/ip6tables` | IPv6                   |


👉 використовується:
```bash
service iptables save
```

🔹 Debian / Ubuntu
| Файл                     | Що містить   |
| ------------------------ | ------------ |
| `/etc/iptables/rules.v4` | правила IPv4 |
| `/etc/iptables/rules.v6` | IPv6         |


👉 через:
```bash
iptables-persistent
```

## 🔹 🔄 NAT (частина iptables)

👉 окремих файлів НЕ має

але:

| Де дивитись              | Що                     |
| ------------------------ | ---------------------- |
| `/proc/net/nf_conntrack` | трансляції (SNAT/DNAT) |
| `iptables -t nat -L`     | правила                |

## 🔹 🌍 DNS (важливо для мережі)
| Файл                              | Що містить     |
| --------------------------------- | -------------- |
| `/etc/resolv.conf`                | DNS сервери    |
| `/run/NetworkManager/resolv.conf` | генерується NM |

## 🔹 🧾 ARP / MAC
| Файл            | Що містить  |
| --------------- | ----------- |
| `/proc/net/arp` | ARP таблиця |


👉 команда:
```bash
ip neigh
```

## 🔹 🔌 Стан сокетів і з'єднань
| Файл            | Що містить    |
| --------------- | ------------- |
| `/proc/net/tcp` | TCP з'єднання |
| `/proc/net/udp` | UDP           |
| `/proc/net/raw` | raw sockets   |


👉 краще використовувати:
```bash
ss
```

## 📌 🧠 Як це все пов’язано (мережа)
🔹 Коли ти задаєш IP через nmcli:
```bash
/etc/NetworkManager/system-connections/*
↓
NetworkManager
↓
kernel (/proc, /sys)
↓
ip a
```

🔹 Коли додаєш маршрут:
```bash
nmcli / ip route
↓
kernel routing table
↓
/proc/net/route
```

🔹 Коли працює NAT:
```bash
iptables (nat)
↓
netfilter (kernel)
↓
/proc/net/nf_conntrack
```

🔹 Коли працює firewall:
```bash
iptables rules
↓
kernel (netfilter)
↓
packet filtering
```

## Важливі принципи (мережа)

👉 `/etc` → конфіг  
👉 `/proc` → стан ядра (runtime)  
👉 `/run` → тимчасові дані  
👉 `nmcli` → керує NetworkManager  
👉 `iptables` → керує netfilter  

🔥 КЛЮЧОВА ІДЕЯ
> Linux мережа = kernel + userspace tools

- kernel → реально обробляє пакети
- nmcli / ip / iptables → керують kernel

## ✅ ПІДСУМОК 
- 🌐 мережа → `/etc/NetworkManager`
- 🧭 маршрути → `/proc/net/route`
- 🔁 routing → `/proc/sys/net`
- 🔥 firewall → `/proc/net/ip_tables*`
- 🔄 NAT → `/proc/net/nf_conntrack`
- 📡 ARP → `/proc/net/arp`