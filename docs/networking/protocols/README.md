# 📚 ЗМІСТ: ПРОТОКОЛИ МЕРЕЖ (по рівнях)

Я буду орієнтуватися на модель TCP/IP (з прив’язкою до OSI) — так найзручніше для Linux.

## 1. LINK / NETWORK ACCESS (OSI L2 + частково L1)

👉 “Як пакети передаються по мережі фізично”

📌 Основні протоколи:
- Ethernet (802.3) — основа дротових мереж
- Wi-Fi (802.11) — бездротова мережа
- ARP (Address Resolution Protocol) — IP → MAC
- RARP (історично)
- VLAN (802.1Q) — сегментація мереж
- STP (Spanning Tree Protocol) — уникнення петель
- LLDP — інформація про сусідів

## 2. INTERNET LAYER (OSI L3)

👉 “Як пакети знаходять шлях”

📌 Основні протоколи:
- IP (IPv4) — адресація
- IP (IPv6) — нова адресація
- ICMP — службові повідомлення (ping, errors)
- ICMPv6 — для IPv6
- IGMP — multicast
- IPsec — шифрування на рівні IP

## 3. TRANSPORT LAYER (OSI L4)

👉 “Як доставляються дані”

📌 Основні протоколи:
- TCP — надійний (connection-oriented)
- UDP — швидкий (connectionless)
- SCTP — рідше використовується

## 4. APPLICATION LAYER (OSI L5–L7)

👉 “Що саме передається”

📡 Web / Internet
- HTTP
- HTTPS (HTTP + TLS)

🌍 DNS
- DNS
- DoH / DoT

📧 Email
- SMTP
- POP3
- IMAP

📁 Передача файлів
- FTP
- SFTP
- TFTP

🔐 Віддалений доступ
- SSH
- Telnet

🕒 Службові
- DHCP
- NTP

📡 Інші важливі
- SNMP — моніторинг
- LDAP — каталоги
- SIP / RTP — VoIP

## 5. SECURITY / ENCRYPTION (поперечний рівень)

👉 працюють поверх інших

- TLS / SSL
- IPsec
- Kerberos

## 6. ДОДАТКОВО (дуже важливо для практики)
📌 Routing протоколи
- RIP
- OSPF
- BGP

📌 VPN / тунелі
- GRE
- OpenVPN
- WireGuard
- L2TP


## Як будемо розбирати кожен протокол

Кожен протокол я опишу так:

1. 📌 Що це і для чого
2. 🧠 Як працює (покроково)
3. 📦 Структура пакета (поля)
4. 🔁 Як виглядає в реальності (tcpdump приклади)
5. ⚙️ Як використовується в Linux
6. ⚠️ Типові проблеми
7. 🔗 Зв’язок з іншими протоколами