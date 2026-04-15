# Утиліта lshw

`lshw` (Hardware Lister) — це інструмент командного рядка з відкритим вихідним кодом для операційних систем на базі Linux, який відображає детальну інформацію про апаратне забезпечення комп’ютера. Його використовують системні адміністратори, розробники та користувачі для діагностики та інвентаризації систем.

**Ключові факти**
- **Тип**: Утиліта командного рядка Linux

- **Розробник**: Christophe Grenier

- **Ліцензія**: GNU General Public License (GPL)

- **Перша версія**: початок 2000-х років

- **Основна функція**: детальне виведення характеристик апаратного забезпечення

**Призначення та можливості**  
`lshw` збирає та відображає дані про апаратні компоненти, зокрема процесор, пам’ять, материнську плату, пристрої зберігання, мережеві адаптери тощо. На відміну від простих утиліт, які показують лише базову інформацію, lshw надає глибокий огляд системи, включно з даними з DMI, PCI, USB та інших джерел ядра Linux.

**Використання та формати виведення**  
Програму можна запускати з правами адміністратора для отримання повної інформації (`sudo lshw`). Вона підтримує кілька форматів виведення — текстовий, XML, HTML та JSON — що спрощує автоматизований аналіз або інтеграцію з інвентаризаційними системами. Скорочений формат (`lshw -short`) дозволяє переглянути зведену таблицю пристроїв.

**Застосування та значення**  
`lshw` широко застосовується для аудиту апаратного забезпечення, перевірки сумісності систем, підготовки звітів про конфігурацію серверів і усунення несправностей. Завдяки легкості та універсальності інструмент залишається стандартним засобом у більшості дистрибутивів Linux і використовується в автоматизованих скриптах адміністрування.

## Концепція

`lshw`:
> показує повну ієрархію апаратного забезпечення, яке бачить ядро Linux

📌 Що важливо

👉 на відміну від:
- `ip` → логічна мережа
- `nmcli` → конфіг

👉 `lshw`:

- показує фізичні пристрої
- драйвери
- capabilities

## 1. Як організований вивід

lshw будує дерево:
```
Computer
 ├── CPU
 ├── Memory
 ├── Network
 ├── Disk
```

## 2. БАЗОВА КОМАНДА
📌
```bash
sudo lshw
```

📤 (фрагмент)
```bash
*-network
   description: Ethernet interface
   product: 82540EM Gigabit Ethernet Controller
   vendor: Intel Corporation
   physical id: 3
   bus info: pci@0000:00:03.0
   logical name: enp0s3
   version: 02
   serial: 08:00:27:4e:66:a1
   size: 1Gbit/s
   capacity: 1Gbit/s
   width: 32 bits
   clock: 33MHz
   capabilities: pm pci bus_master cap_list ethernet physical tp 10bt 10bt-fd 100bt 100bt-fd 1000bt-fd
   configuration: autonegotiation=on broadcast=yes driver=e1000 latency=0 link=yes multicast=yes
   resources: irq:19 memory:f0000000-f001ffff
```

## 3. РОЗБІР КОЖНОГО ПОЛЯ
🔹 `*-network`
- тип пристрою

🔹 `description`
- загальний тип 
- (Ethernet)

🔹 `product`
- модель

🔹 `vendor`
- виробник

🔹 `physical id`
- внутрішній ID

🔹 `bus info`
- pci@0000:00:03.0

👉 адреса на шині (PCI)

🔹 `logical name`
- enp0s3

👉 ім’я інтерфейсу (дуже важливо)

🔹 `serial`
- MAC адреса

🔹 `size`
- поточна швидкість

🔹 `capacity`
- максимальна

🔹 `width`
- ширина шини

🔹 `clock`
- частота

🔹 `capabilities`
- що підтримує:
  - 1000bt
  - full duplex
  - etc

🔹 `configuration`
- driver=e1000
- link=yes

🔬 ключові поля:
- driver — драйвер ядра
- link=yes — кабель підключений
- autonegotiation — автоузгодження

🔹 `resources`
- IRQ
- memory range

## 4. ОСНОВНІ ОПЦІЇ
🔹 -short (зручно)
```bash
lshw -short
```
📤
```bash
H/W path  Device  Class      Description
========================================
/0/3      enp0s3  network    Ethernet interface
```

🔹 -class network
```bash
sudo lshw -class network
```
👉 тільки мережа

🔹 -class disk
```bash
lshw -class disk
```

🔹 -businfo
```bash
lshw -businfo
```
📤
```bash
Bus info          Device  Class   Description
================================================
pci@0000:00:03.0 enp0s3  network Ethernet interface
```

🔹 -numeric
```bash
lshw -numeric
```

👉 показує ID (PCI)

🔹 -json
```bash
lshw -json
```
👉 для парсингу

🔹 -sanitize
```bash
lshw -sanitize
```
👉 приховує MAC/серійники

## 5. ПРАКТИЧНІ СЦЕНАРІЇ
📌 1. Який драйвер мережі?
```bash
lshw -class network
```
👉 дивишся:
```bash
driver=e1000
```

📌 2. Чи є лінк?
```bash
link=yes
```
👉 якщо no → кабель / switch

📌 3. Яка швидкість?
```bash
size: 1Gbit/s
```

📌 4. Чому не працює інтернет?

👉 перевір:

- є інтерфейс?
- драйвер?
- link=yes?

## 6. ВАЖЛИВІ НЮАНСИ
❗ потрібен sudo
- sudo lshw

❗ може не показати все без root

❗ залежить від драйверів

## 7. РІЗНИЦЯ З ІНШИМИ
| Інструмент | Що показує |
| ---------- | ---------- |
| ip         | мережа     |
| nmcli      | конфіг     |
| ss         | з’єднання  |
| tcpdump    | пакети     |
| lshw       | залізо     |


## 8. ВИСНОВОК

👉 lshw:

- дає повну картину апаратури
- критично важливий для діагностики
- показує драйвери і link status

💡 Аналогія
- `ip` → карта доріг
- `ss` → машини
- `tcpdump` → що в машинах
- `lshw` → з чого зроблені дороги