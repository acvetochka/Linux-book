# Утиліта dig

`dig` (DNS lookup utility)

`dig` (скорочено від *Domain Information Groper*) — це командна утиліта для запитів системи доменних імен (DNS). Вона використовується адміністраторами мереж і розробниками для діагностики, тестування та налагодження роботи DNS-серверів і записів. Інструмент є стандартним у більшості систем UNIX-подібного типу.

**Основні факти**
- **Розробник**: Internet Systems Consortium

- **Початковий випуск**: 1988 р. (у складі пакету BIND)

- **Поточна підтримка**: частина пакета BIND 9

- **Тип програмного забезпечення**: CLI-утиліта для DNS-запитів

- **Ліцензія**: ISC License (відкрите програмне забезпечення)

**Призначення та використання**
dig дозволяє здійснювати запити до DNS-серверів для отримання інформації про записи типів A, AAAA, MX, NS, TXT та інших. Його часто застосовують для перевірки налаштування доменів, діагностики проблем розпізнавання імен, а також аналізу роботи DNS-інфраструктури. Команда `dig example.com` повертає детальний звіт про запит і відповідь сервера.

**Особливості та формат вихідних даних**
На відміну від старіших інструментів, таких як `nslookup`, `dig` надає структурований та розширюваний формат виводу. Він містить секції HEADER, QUESTION, ANSWER, AUTHORITY та ADDITIONAL, що спрощує аналіз результатів як людиною, так і програмно. Також підтримується опція `+short` для стислого відображення.

**Варіанти та сумісність**
`dig` є частиною пакета BIND і доступний у Linux, macOS, *BSD та Windows (через пакети BIND або WSL). Існують похідні версії, наприклад `ldig` для роботи з DNS-over-TLS і `drill` з пакета Unbound, які розширюють його можливості без зміни базового синтаксису.

## Концепція

dig (Domain Information Groper) — це інструмент для:
> прямого запиту до DNS-серверів і аналізу відповіді

📌 Що важливо

👉 на відміну від:
- ping / браузера

👉 dig:

- обходить кеші (частково)
- показує весь DNS-пакет
- дозволяє тестувати DNS-сервери напряму

## 1. БАЗОВА КОМАНДА
📌
```bash
dig google.com
```

📤 Вивід
```bash
; <<>> DiG 9.18 <<>> google.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345

;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;google.com.         IN  A

;; ANSWER SECTION:
google.com.  300  IN  A  142.250.74.14

;; Query time: 20 msec
;; SERVER: 192.168.1.1#53
;; WHEN: Tue Apr 15
;; MSG SIZE  rcvd: 56
```

## 2. РОЗБІР КОЖНОГО БЛОКУ
🔹 HEADER
```bash
opcode: QUERY
status: NOERROR
id: 12345
```

📌 Пояснення
- opcode — тип запиту
- status:
  - NOERROR — все ок
  - NXDOMAIN — домен не існує
- id — ідентифікатор запиту

🔹 FLAGS
```bash
flags: qr rd ra
```

📌 Розбір
| Flag | Значення            |
| ---- | ------------------- |
| qr   | це відповідь        |
| rd   | recursion desired   |
| ra   | recursion available |


🔹 QUESTION SECTION
```bash
google.com. IN A
```

Поля:
- домен
- клас (IN = internet)
- тип запису

🔹 ANSWER SECTION
```bash
google.com. 300 IN A 142.250.74.14
```

🔬 Детально
| Поле       | Значення  |
| ---------- | --------- |
| google.com | ім’я      |
| 300        | TTL (сек) |
| IN         | клас      |
| A          | тип       |
| IP         | результат |


🔹 Query time
- час відповіді

🔹 SERVER
- який DNS відповів

## 3. ТИПИ DNS ЗАПИСІВ
🔹 A (IPv4)
```bash
dig google.com A
```

🔹 AAAA (IPv6)
```bash
dig google.com AAAA
```

🔹 MX (пошта)
```bash
dig gmail.com MX
```

🔹 NS (сервери)
```bash
dig google.com NS
```

🔹 TXT
```bash
dig google.com TXT
```

🔹 CNAME
```bash
dig www.google.com CNAME
```

## 4. ОСНОВНІ ОПЦІЇ
🔹 `+short` (дуже важливо)
```bash
dig +short google.com
```
📤
```bash
142.250.74.14
```

🔹 `@server` (конкретний DNS)
```bash
dig @8.8.8.8 google.com
```
👉 напряму до Google DNS

🔹 `+trace` (повний шлях DNS)
```bash
dig +trace google.com
```
👉 покаже:

- root
- TLD
- authoritative

🔹 `+noall +answer`
```bash
dig +noall +answer google.com
```
👉 тільки результат

🔹 `+stats`
```bash
dig +stats google.com
```
👉 статистика

🔹 `+nocmd`
```bash
dig +nocmd google.com
```
👉 прибрати header

🔹 `-x` (reverse lookup)
```bash
dig -x 8.8.8.8
```

📤
```bash
8.8.8.8.in-addr.arpa PTR dns.google.
```

## 5. ПРАКТИЧНІ СЦЕНАРІЇ
📌 1. DNS не працює
```bash
dig google.com
```
👉 якщо нема відповіді → проблема DNS

📌 2. Перевірка конкретного сервера
```bash
dig @1.1.1.1 google.com
```

📌 3. Різні DNS → різні результати
```bash
dig @8.8.8.8 google.com
dig @1.1.1.1 google.com
```

📌 4. Reverse lookup
```bash
dig -x 142.250.74.14
```

## 6. ВАЖЛИВІ НЮАНСИ
❗ кеш
- dig не використовує system cache (як правило)

❗ DNS може відповідати по-різному
- геолокація
- балансування

❗ NXDOMAIN
- status: NXDOMAIN

👉 домен не існує

🧠 7. ВИСНОВОК

👉 `dig`:

- головний інструмент для DNS
- показує повний DNS-пакет
- дозволяє тестувати сервери

💡 Дуже проста аналогія
- `DNS` = телефонна книга
- `dig` = ти сам дзвониш у довідкову