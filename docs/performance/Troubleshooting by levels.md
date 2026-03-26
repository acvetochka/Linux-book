# Troubleshooting by levels

Нижче приведено повну карту знань Linux + як її структурувати по рівнях (junior → middle → senior). Це дуже допомагає:
- не губитись
- розуміти “що далі вчити”
- будувати системне мислення

## 1. Головна ідея (дуже важливо)

Linux — це не набір команд, а система:
```bash
Hardware
   ↓
Kernel
   ↓
Subsystems (CPU, Memory, FS, Network)
   ↓
Userspace (processes, tools)
   ↓
Applications
```

👉 Troubleshooting працює зверху вниз або знизу вверх

## 2. Повна Mind Map Linux (твоя структура + логіка)
```bash
01 Fundamentals
02 Environment
03 Shell
04 Scripting

05 FileSystem
06 Storage
07 FileManagement
08 TextProcessing
09 Archives

10 Users
11 Permissions

12 Processes
17 Process Control

13 System
16 Logs
15 Package Management

14 Networking

18 Security

19 Performance  ⭐ (центр)
   ├── CPU
   ├── RAM
   ├── Disk
   ├── Network
   ├── Tools
   ├── Troubleshooting ⭐
   ├── Methodology ⭐
   ├── Scenarios ⭐

20 Documentation
21 Collections
```

## 3. Рівні знань (найцінніше)
### 🟢 JUNIOR рівень

👉 Ти розумієш що відбувається

Що потрібно знати:
Основи:
- що таке процес
- що таке RAM
- що таке диск
- що таке load

Команди:
```bash
top
free -h
df -h
ps aux
```
Простий troubleshooting:
```
Сервер повільний →
відкрив top →
знайшов процес →
kill
```
❗ Тип мислення:
> "Що відбувається?"

### 🟡 MIDDLE рівень

👉 Ти розумієш чому це відбувається

🔥 Головне:
1. Bottlenecks
   - CPU bound
   - IO bound
   - Memory pressure

2. Метрики
   
   | Ресурс  | Метрики         |
   | ------- | --------------- |
   | CPU     | load, us, sy    |
   | RAM     | available, swap |
   | Disk    | await, util     |
   | Network | latency         |

3. Інструменти
   ```bash
   htop
   iostat
   vmstat
   ss
   iotop
   ```
4. Метод USE
   ```
   Utilization
   Saturation
   Errors
   ```
5. Вже є мислення:
   > "Де bottleneck?"

   🔥 Приклад мислення:  
      ```
      Load високий
      CPU idle
      → це НЕ CPU
      → це IO
      ```

### 🔴 SENIOR рівень

👉 Ти розумієш як система працює всередині

🔥 Глибина:
CPU:
- scheduler (CFS)
- context switching
- interrupts

RAM:
- page cache
- swap behavior
- OOM killer

Disk:
- queue depth
- random vs sequential IO

Network:
- TCP stack
- congestion control

🔧 Інструменти:
```bash
perf
strace
sar
tcpdump
```

🔥 Найважливіше:
> Root cause analysis

❗ Тип мислення:
> "Що саме в системі працює неправильно?"


### Як виглядає мислення профі
Junior:

> Сервер повільний 😢

Middle:
> CPU? RAM? Disk?

Senior:
```
Latency ↑
→ дивлюсь IO
→ await високий
→ диск bottleneck
→ причина: random IO від DB
```

## Найцінніше, що тобі треба винести
> `Linux` = система ресурсів  
> `Performance` = баланс ресурсів  
> `Troubleshooting` = пошук bottleneck  