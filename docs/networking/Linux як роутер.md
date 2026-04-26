# Linux як роутер (на прикладі Red Hat)

## 1. Що ми будуємо

👉 Сервер з Linux, який:

- має 2 мережеві інтерфейси
- пересилає пакети між ними
- робить NAT (маскарадинг)
- може роздавати інтернет іншим

##  2. Типова схема
<a href="/Linux/router.png"  target="_blank">
  <img src="/Linux/router.png" width="500" alt="Linux schema">
</a>

- eth0 — зовнішній інтерфейс (Internet)
- eth1 — внутрішній (LAN)

##  3. Перевірка інтерфейсів
```bash
ip a
```
Приклад:

- eth0 → 192.0.2.10 (Internet)
- eth1 → 192.168.1.1 (LAN)

##  4. Налаштування IP
Через NetworkManager (nmcli)
```bash
nmcli con show
```

Задати IP для LAN:
```bash
sudo nmcli con mod eth1 ipv4.addresses 192.168.1.1/24
sudo nmcli con mod eth1 ipv4.method manual
sudo nmcli con up eth1
```

## 5. Увімкнення IP forwarding (ключовий крок)

👉 Без цього Linux НЕ буде роутером
```bash
sudo sysctl -w net.ipv4.ip_forward=1
```
Перевірка:
```bash
cat /proc/sys/net/ipv4/ip_forward
```
🔒 Постійно:
```bash
sudo nano /etc/sysctl.conf
```
Додати:
```ini
net.ipv4.ip_forward = 1
```

## 6. NAT (маскарадинг) через iptables

👉 тут Linux починає працювати як роутер
```bash
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

## 7. Дозвіл форвардингу
```bash
sudo iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
sudo iptables -A FORWARD -i eth0 -o eth1 -m state --state RELATED,ESTABLISHED -j ACCEPT
```

## 8. Збереження правил
RHEL 8/9:
```bash
sudo dnf install iptables-services
sudo systemctl enable iptables
sudo service iptables save
```

## 9. Перевірка

З клієнта (LAN):
```bash
ping 8.8.8.8
```
👉 якщо працює → NAT ок

## 10. DNS (важливо!)

На клієнті:
```bash
nameserver 8.8.8.8
```
або підняти локальний DNS

## 11. DHCP сервер (щоб автоматизувати)

Встановлення:
```bash
sudo dnf install dhcp-server
```

Конфіг:
```bash
sudo nano /etc/dhcp/dhcpd.conf
subnet 192.168.1.0 netmask 255.255.255.0 {
  range 192.168.1.100 192.168.1.200;
  option routers 192.168.1.1;
  option domain-name-servers 8.8.8.8;
}
```

Інтерфейс DHCP:
```bash
sudo nano /etc/sysconfig/dhcpd
```
```ini
DHCPDARGS=eth1
```

Запуск:
```bash
sudo systemctl enable dhcpd
sudo systemctl start dhcpd
```

## 12. Firewall (важливо!)

На RHEL використовується:

👉 firewalld

Додати маскарадинг:
```bash
sudo firewall-cmd --add-masquerade --permanent
sudo firewall-cmd --reload
```

Дозволити forwarding:
```bash
sudo firewall-cmd --zone=public --add-interface=eth0 --permanent
sudo firewall-cmd --zone=internal --add-interface=eth1 --permanent
```

## 13. Альтернатива iptables → nftables

У нових системах:
```bash
sudo nft add table ip nat
```
(але iptables поки простіше для навчання)

## 14. Діагностика
Перевірка маршрутів

```bash
ip route
```

Перевірка NAT
```bash
iptables -t nat -L -n -v
```
Трафік
```bash
tcpdump -i eth0
```
## 15. Типові проблеми

❌ немає інтернету
→ не включений ip_forward

❌ клієнти не виходять в інтернет
→ немає MASQUERADE

❌ DNS не працює
→ не заданий nameserver

❌ firewall блокує
→ перевір firewalld

## Висновок

Linux може повністю замінити:

- домашній роутер
- корпоративний gateway
- firewall