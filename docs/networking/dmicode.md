# Утиліта dmidecode

`dmidecode` — це утиліта командного рядка у системах Linux та інших Unix-подібних ОС, що зчитує інформацію про апаратне забезпечення безпосередньо з таблиці DMI (Desktop Management Interface). Вона дозволяє отримати детальні відомості про компоненти комп’ютера без необхідності відкривати корпус або звертатися до BIOS.

**Ключові факти**
- **Розробник**: проєкт GNU

- **Тип**: системна утиліта для зчитування DMI/SMBIOS даних

- **Перша поява**: початок 2000-х років

- **Платформи**: Linux, *BSD, інші Unix-подібні системи

- **Ліцензія**: GNU General Public License (GPL)

**Призначення та функції**
dmidecode зчитує дані з таблиць DMI/SMBIOS, створених BIOS або UEFI, та відображає їх у зручному текстовому форматі. Вивід включає моделі процесорів, обсяг пам’яті, виробника материнської плати, серійні номери, версії прошивки та інші параметри. Це корисно для адміністраторів і технічних фахівців, які потребують інвентаризації обладнання чи діагностики.

**Як працює**
Утиліта звертається до системного пристрою `/dev/mem` або інтерфейсу `sysfs`, щоб знайти й інтерпретувати таблицю SMBIOS, створену прошивкою. Далі вона декодує структури в зрозумілі поля. Команди можуть бути загальні (`dmidecode`) або з уточненням типу, наприклад `dmidecode -t memory` для інформації про RAM.

**Значення та використання**
`dmidecode` вважається стандартним інструментом у системному адмініструванні Linux. Його часто використовують у скриптах моніторингу, системах управління ІТ-інфраструктурою та під час технічної підтримки. Завдяки відкритому коду й незалежності від виробника воно залишається універсальним засобом отримання апаратних метаданих.

## Концепція

dmidecode:
> читає SMBIOS / DMI таблиці, які заповнює BIOS/UEFI

📌 Що це означає

👉 на відміну від:

- lshw → отримує дані від ядра
- dmidecode → читає напряму з прошивки

📌 Важливо

👉 це НЕ “жива” інформація  
👉 це те, що BIOS записав при старті

## 1. Що таке DMI / SMBIOS
🔹 SMBIOS (System Management BIOS)

👉 стандарт, який описує:

- CPU
- RAM
- motherboard
- BIOS

🔹 DMI (Desktop Management Interface)

👉 спосіб доступу до цих даних

## 2. БАЗОВА КОМАНДА
📌
```bash
sudo dmidecode
```

📤 (фрагмент)
```bash
Handle 0x0001, DMI type 1, 27 bytes
System Information
    Manufacturer: Dell Inc.
    Product Name: XPS 13
    Version: Not Specified
    Serial Number: ABC123
    UUID: 123e4567-e89b-12d3-a456-426614174000
```

## 3. РОЗБІР
🔹 Handle 0x0001
- унікальний запис

🔹 DMI type 1
- тип структури

🔹 System Information

👉 секція

🔹 поля:
- Manufacturer
  - виробник
- Product Name
  - модель
- Serial Number
  - серійний номер
- UUID
  - унікальний ID системи

## 4. ОСНОВНІ ТИПИ (DMI TYPES)
| Type | Що це        |
| ---- | ------------ |
| 0    | BIOS         |
| 1    | System       |
| 2    | Motherboard  |
| 3    | Chassis      |
| 4    | CPU          |
| 17   | RAM          |
| 39   | Power supply |

## 5. ОСНОВНІ ОПЦІЇ
🔹 `-t` (тип)

📌 BIOS
```bash
dmidecode -t bios
```
📤
```bash
BIOS Information
    Vendor: American Megatrends
    Version: 1.0.0
```

📌 System
```bash
dmidecode -t system
```

📌 CPU
```bash
dmidecode -t processor
```
📤
```bash
Processor Information
    Socket Designation: CPU1
    Version: Intel(R) Core(TM) i7
    Core Count: 8
```

📌 RAM
```bash
dmidecode -t memory
```
📤
```bash
Memory Device
    Size: 8192 MB
    Type: DDR4
    Speed: 2666 MT/s
```

🔹 `-s` (конкретне поле)
📌
```bash
dmidecode -s system-product-name
```
📤
```bash
XPS 13
```

🔹 популярні ключі
```bash
dmidecode -s system-manufacturer
dmidecode -s system-serial-number
dmidecode -s bios-version
```

🔹 `-q` (quiet)
```bash
dmidecode -q
```
👉 без зайвого тексту

🔹 `-H` (list types)
```bash
dmidecode -H
```
👉 список типів

🔹 `--type` (альтернатива -t)
```bash
dmidecode --type 17
```

## 6. ПРАКТИЧНІ СЦЕНАРІЇ
📌 1. Серійний номер
```bash
dmidecode -s system-serial-number
```

📌 2. Модель ноутбука
```bash
dmidecode -s system-product-name
```

📌 3. RAM
```bash
dmidecode -t memory
```

👉 бачиш:
- слоти
- зайняті/вільні

📌 4. CPU
```bash
dmidecode -t processor
```

📌 5. BIOS
```bash
dmidecode -t bios
```

## 7. ВАЖЛИВІ НЮАНСИ
❗ потрібен root
```bash
sudo dmidecode
```

❗ дані можуть бути неточні

👉 BIOS може:
- не заповнити
- заповнити неправильно

❗ це НЕ live дані

👉 наприклад:
> не покаже поточне навантаження CPU


## 8. РІЗНИЦЯ З `lshw`
|         | dmidecode | lshw         |
| ------- | --------- | ------------ |
| Джерело | BIOS      | kernel       |
| Дані    | статичні  | актуальні    |
| RAM     | слоти     | використання |
| мережа  | ні        | так          |

## 9. ВИСНОВОК

👉 dmidecode:

- читає BIOS
- дає low-level інфо
- корисний для інвентаризації

💡 Аналогія
- `lshw` → що система бачить зараз
- `dmidecode` → що записано в паспорті пристрою