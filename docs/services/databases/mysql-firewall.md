# Firewall для MySQL через iptables

## 1. Перегляд поточних правил
Всі правила
```bash
sudo iptables -L -n -v
```

NAT правила
```bash
sudo iptables -t nat -L -n -v
```

## 2. Дозволити MySQL порт 3306
Відкрити для всіх
```bash
sudo iptables -A INPUT -p tcp --dport 3306 -j ACCEPT
```

## 3. Дозволити тільки конкретному IP
Приклад для replica/server
```bash
sudo iptables -A INPUT \
-p tcp \
-s 192.168.1.20 \
--dport 3306 \
-j ACCEPT
```

## 4. Дозволити локальну мережу
Приклад
```bash
sudo iptables -A INPUT \
-p tcp \
-s 192.168.1.0/24 \
--dport 3306 \
-j ACCEPT
```

## 5. Заборонити доступ до MySQL
Блокування порту
```bash
sudo iptables -A INPUT -p tcp --dport 3306 -j DROP
```

## 6. Видалення правила
Перегляд правил з номерами
```bash
sudo iptables -L INPUT --line-numbers
```

Видалення правила №3
```bash
sudo iptables -D INPUT 3
```

## 7. Дозволити SSH перед блокуванням

⚠️ Важливо перед DROP політиками.
```bash
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

## 8. Базова безпечна конфігурація
Скидання правил.
```bash
sudo iptables -F
```

Політики за замовчуванням
```bash
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT ACCEPT
```

Loopback
```bash
sudo iptables -A INPUT -i lo -j ACCEPT
```

Existing connections
```bash
sudo iptables -A INPUT \
-m conntrack \
--ctstate ESTABLISHED,RELATED \
-j ACCEPT
```

SSH
```bash
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

MySQL
```bash
sudo iptables -A INPUT \
-p tcp \
-s 192.168.1.20 \
--dport 3306 \
-j ACCEPT
```

## 9. Збереження правил
RHEL/CentOS/Rocky/AlmaLinux

Встановлення сервісу
```bash
sudo dnf install -y iptables-services
```

Увімкнення
```bash
sudo systemctl enable iptables
sudo systemctl start iptables
```

Збереження правил
```bash
sudo service iptables save
```
Або:
```bash
sudo iptables-save > /etc/sysconfig/iptables
```

## 10. Відновлення правил
```bash
sudo iptables-restore < /etc/sysconfig/iptables
```

## 11. Перевірка відкритого порту
На сервері
```bash
ss -tulnp | grep 3306
```

З іншого сервера 
- Через nc

  ```bash
  nc -zv 192.168.1.10 3306
  ```

- Через telnet
  ```bash
  telnet 192.168.1.10 3306
  ```

## 12. Логування блокувань
Логувати DROP пакети
```bash
sudo iptables -A INPUT \
-p tcp \
--dport 3306 \
-j LOG \
--log-prefix "MYSQL_BLOCK: "
```

## 13. Перегляд логів firewall
```bash
sudo journalctl -k
```
Або:
```bash
sudo dmesg | grep MYSQL_BLOCK
```

## 14. Приклад для реплікації
SOURCE (MASTER)

Дозволити replica:
```bash
sudo iptables -A INPUT \
-p tcp \
-s 192.168.1.20 \
--dport 3306 \
-j ACCEPT
```

REPLICA

Зазвичай відкривати 3306 не потрібно, якщо replica лише читає binlog з source.

## 15. Часті проблеми
- Connection refused

  Причини:

  - mysqld не запущений
  - bind-address=127.0.0.1
  - порт не слухається

  Перевірка:
  ```bash
  ss -tulnp | grep 3306
  ```

- Connection timed out

  Причини:

  - iptables блокує
  - cloud firewall
  - routing/VPN

- Access denied

  Причини:

  - MySQL user host
  - неправильний пароль

  Перевірка:
  ```sql
  SELECT user,host FROM mysql.user;
  ```
