# iptables — повна довідка

`iptables` — це утиліта командного рядка в просторі користувача Linux, що дозволяє адміністраторам систем керувати правилами фільтрації IP-пакетів ядра через підсистему Netfilter. Вона використовується для налаштування брандмауера, NAT і контролю мережевого трафіку в Linux 2.4 та новіших ядрах.

**Основні факти**
- **Розробник**: спільнота netfilter.org

- **Початковий автор**: Пол «Rusty» Рассел (Paul “Rusty” Russell) 

- **Поточна стабільна версія**: 1.8.13 (2025 р.) 

- **Ліцензія**: GNU GPL v2

- **Послідовник**: nftables

**Історія та розвиток**
Проєкт netfilter/iptables заснований 1999 року для заміни старих систем ipchains і ipfwadm. Його створено з метою покращення фільтрації пакетів, NAT і маскування в Linux. Сьогодні його підтримує ядро команди Netfilter Core Team на netfilter.org, а сучасним наступником вважається nftables.

**Принцип роботи**
iptables працює як інтерфейс до фреймворку Netfilter, що реалізований у ядрі Linux.

- Таблиці містять ланцюги (chains) правил.

- Ланцюги визначають, як обробляти пакети (наприклад, `INPUT`, `OUTPUT`, `FORWARD`).

- Цілі (targets), як-от `ACCEPT`, `DROP`, `REJECT`, визначають дію після збігу умов.  
Такі правила дозволяють здійснювати як статичну, так і стан-орієнтовану фільтрацію, а також налаштовувати NAT.

**Значення та використання**
iptables є базовим інструментом безпеки Linux-систем, який дозволяє:

- блокувати або дозволяти з’єднання на основі IP-адрес, портів чи протоколів;

- здійснювати перенаправлення портів і маскування трафіку;

- створювати складні політики міжмережевого екранування для серверів і кластерів.

Хоча nftables поступово замінює iptables у сучасних дистрибутивах, остання залишається широко використовуваною через сумісність, зрозумілу синтаксис та значну кількість інструментів, що її підтримують.

## 1. Що таке iptables

`iptables` — це утиліта для керування Netfilter в ядрі Linux.

👉 Вона дозволяє:

- фільтрувати пакети
- робити NAT
- контролювати трафік
- будувати firewall

## 2. Як це працює (дуже важливо)

![iptables](/Linux/iptables.png)
👉 Пакет проходить через ланцюги (chains):

- PREROUTING → перед маршрутизацією
- INPUT → в систему
- FORWARD → через систему
- OUTPUT → з системи
- POSTROUTING → після маршрутизації

## 3. Таблиці (tables)
| Таблиця  | Для чого               |
| -------- | ---------------------- |
| `filter` | фільтрація (основна)   |
| `nat`    | NAT                    |
| `mangle` | модифікація пакетів    |
| `raw`    | до connection tracking |

## 4. Ланцюги (chains)
| Chain       | Призначення      |
| ----------- | ---------------- |
| INPUT       | вхідний трафік   |
| OUTPUT      | вихідний         |
| FORWARD     | транзит          |
| PREROUTING  | до маршрутизації |
| POSTROUTING | після            |

## 5. Базовий синтаксис
```bash
iptables -t TABLE -A CHAIN [MATCH] -j TARGET
```

## 6. Основні дії
| Ключ | Опис           |
| ---- | -------------- |
| `-A` | додати правило |
| `-D` | видалити       |
| `-L` | список         |
| `-F` | очистити       |
| `-P` | політика       |

## 7. TARGET (що робити)
| Target     | Опис            |
| ---------- | --------------- |
| ACCEPT     | дозволити       |
| DROP       | відкинути       |
| REJECT     | відхилити       |
| MASQUERADE | NAT             |
| DNAT       | destination NAT |

## 8. Match (умови)
IP
```bash
-s 192.168.1.0/24 #IP джерела
-d 8.8.8.8 #IP призначення
```

Порт
```bash
-p tcp --dport 80 #порт призначення
-p tcp --sport 22 #порт джерела
```

Інтерфейс
```bash
-i eth0 # вхідний інтерфейс (input interface)
-o eth1 # вихідний інтерфейс (output interface)
```

Стан (важливо!)
```bash
-m state --state NEW,ESTABLISHED,RELATED
```

| Стан            | Що означає      | Простими словами               | Приклад                          |
| --------------- | --------------- | ------------------------------ | -------------------------------- |
| **NEW**         | Нове з’єднання  | перший пакет (ініціація)       | клієнт відкриває SSH             |
| **ESTABLISHED** | Вже встановлене | частина існуючої сесії         | відповідь сервера                |
| **RELATED**     | Пов’язане       | нове, але прив’язане до іншого | FTP data, ICMP помилки           |
| **INVALID**     | Некоректне      | не відповідає жодному стану    | пошкоджений або підозрілий пакет |


## 9. Типові правила
✅ Дозволити SSH
```bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
```

❌ Заборонити все
```bash
iptables -P INPUT DROP
```

🔁 Дозволити встановлені з'єднання
```bash
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
```

## 10. NAT
MASQUERADE (інтернет для LAN)
```bash
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
```

DNAT (port forwarding)
```bash
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to 192.168.1.100
```

## 11. Повний приклад firewall
```bash
# очистити
iptables -F
iptables -t nat -F

# політика
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# дозволити loopback
iptables -A INPUT -i lo -j ACCEPT

# дозволити established
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# SSH
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# HTTP/HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## 12. Збереження правил
RHEL:
```bash
service iptables save
```
або:
```bash
iptables-save > /etc/sysconfig/iptables
```

## 13. Перевірка
```bash
iptables -L -n -v
```

## 14. Типові помилки

❌ заблокував SSH → втрата доступу

❌ порядок правил

❌ немає ESTABLISHED

❌ забув NAT

## 15. iptables vs nftables

👉 сучасна альтернатива:
```bash
nftables
```
але:

- iptables все ще дуже популярний
- часто в курсах і сертифікаціях