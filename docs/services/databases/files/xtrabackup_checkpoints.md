# xtrabackup_checkpoints — докладна довідка

Файл:
```
xtrabackup_checkpoints
```
створюється в кожному backup-каталозі Percona XtraBackup.

## Призначення

Файл містить:

- тип бекапу,
- LSN-координати,
- стан prepare,
- інформацію для incremental chain.

XtraBackup використовує його щоб:

- перевіряти сумісність incremental backup,
- знати чи backup already prepared,
- визначати межі redo log.
- Розташування

Наприклад:
```bash
/backup/full/xtrabackup_checkpoints
```
або:
```bash
/backup/inc1/xtrabackup_checkpoints
```

## Приклад файлу
```ini
backup_type = incremental
from_lsn = 21748866
to_lsn = 21769915
last_lsn = 21769915
flushed_lsn = 21769905
redo_memory = 0
redo_frames = 0
```

## Параметри
### 1. backup_type
Призначення

Показує:

- тип backup,
- або стан prepare.

Можливі значення
| Значення        | Опис                      |
| --------------- | ------------------------- |
| `full-backuped` | повний backup без prepare |
| `incremental`   | incremental backup        |
| `log-applied`   | backup prepared           |
| `full-prepared` | prepared full backup      |
| `partial`       | partial backup            |
| `compact`       | compact backup            |

- `full-backuped`
  
    Що означає
    - freshly created full backup
    - redo logs ще не застосовані

    Приклад
    ```ini
    backup_type = full-backuped
    ```

    Коли з’являється

    Після:
    ```bash
    xtrabackup --backup
    ```

    Що можна робити

    ✅ apply-log  
    ✅ apply incremental  
    ✅ copy-back after prepare  

- `incremental`

    Що означає

    Backup містить:

    - лише змінені InnoDB pages,
    - зміни між LSN interval.

    Приклад
    ```ini
    backup_type = incremental
    ``

    Створюється
    ```bash
    xtrabackup --backup --incremental-basedir=...
    ```

    Особливості
    - сам по собі не відновлюється
    - потребує base backup

- `log-applied`

    Що означає

    Backup already prepared.

    Redo logs:

    - застосовані,
    - pages synchronized.

    Приклад
    ```ini
    backup_type = log-applied
    ```

    З’являється після
    ```bash
    xtrabackup --prepare
    ```

    Важливо

    Такий backup:

    - вже modified,
    - може не приймати старі incremental.

- `full-prepared`

    Що означає

    Повний backup повністю підготовлений (prepare completed):

    - redo logs already applied,
    - незавершені транзакції rollback-нуті,
    - backup консистентний,
    - готовий до restore (copy-back).

    Приклад

    ```ini
    backup_type = full-prepared
    ```

    Створюється

    ```bash
    xtrabackup --prepare --target-dir=/backup/full
    ```

    Особливості

    - готовий до відновлення
    - можна використовувати xtrabackup --copy-back
    - backup finalized
    - зазвичай уже не підходить для накочування incremental backup
    - metadata та LSN backup змінені після prepare


- `partial`
  
  Що означає

  Partial backup:

  - не всі tablespaces,
  - backup окремих таблиць/БД.

  Приклад
  ```ini
  backup_type = partial
  ```

  Створюється

  При:
  - `--tables`
  - `--tables-file`

  Особливості
  - restore складніший
  - потребує transportable tablespaces

- `compact`
  Що означає

  Compact backup:
  - secondary indexes excluded,
  - менший розмір.

  Особливості

  Після restore:
  - rebuild indexes required.

### 2. from_lsn
**Призначення**

Початковий LSN backup.

**Що таке LSN**

LSN = Log Sequence Number

Це позиція в InnoDB redo log.

- Для full backup
  ```ini
  from_lsn = 0
  ```
  бо full backup починається з нуля.

- Для incremental
  ```ini
  from_lsn = 21748866
  ```
  означає:
  - backup містить зміни
  - починаючи з цього LSN.

Важливе правило

Для incremental:
```
inc.from_lsn MUST equal base.to_lsn
```

**Приклад**
- full
  ```ini
  to_lsn = 21748866
  ```
- inc1
  ```ini
  from_lsn = 21748866
  ```

### 3. to_lsn
**Призначення**

Кінцевий LSN backup.

**Що означає**

Backup містить:
> all changes up to this LSN

-  incremental
  ```ini
  from_lsn = 21748866
  to_lsn   = 21769915
  ```
  означає:
  - backup охоплює changes
  - між цими LSN.


- Для наступного incremental
```ini
next_inc.from_lsn = previous_inc.to_lsn
```

### 4. last_lsn
**Призначення**

Останній observed redo LSN під час backup.

**Особливість**

Може бути:
```
>= to_lsn
```

Чому

Під час backup:

- сервер продовжує працювати,
- redo logs пишуться далі.

Приклад
```ini
to_lsn   = 21769915
last_lsn = 21769940
```

Інтерпретація
- `to_lsn` — consistency point
- `last_lsn` — latest seen log position

### 5. flushed_lsn
**Призначення**

LSN redo logs, які гарантовано flushed to disk.

**Особливість**

Може бути трохи меншим за last_lsn.

**Приклад**
```ini
last_lsn    = 21769915
flushed_lsn = 21769905
```

Чому

Redo log buffering.

### 6. redo_memory
**Призначення**

Службова статистика redo processing.

Зазвичай
```ini
redo_memory = 0
```

**Використання**

Internal diagnostics.

### 7. redo_frames
**Призначення**

Кількість redo frames.

Зазвичай
```ini
redo_frames = 0
```

Використовується

Internal redo tracking.

## Як перевіряти incremental chain
**Правильний chain**
- full
```ini
to_lsn = 1000
```
- inc1
```ini
from_lsn = 1000
to_lsn   = 2000
```
- inc2
```ini
from_lsn = 2000
to_lsn   = 3000
```

**Неправильний chain**
- full
```ini
to_lsn = 1000
```
- inc1
```ini
from_lsn = 1500
```
❌ backup mismatch.

## Як змінюється backup_type
| Етап                     | backup_type   |
| ------------------------ | ------------- |
| після backup             | full-backuped |
| після incremental backup | incremental   |
| після prepare            | log-applied   |

## Важливе правило
```bash
xtrabackup --prepare
```

змінює:

- файли backup,
- metadata,
- checkpoints.

Тому:

- original full backup бажано зберігати untouched,
- prepare робити на копії.

## Корисні команди
Перегляд
```bash
cat xtrabackup_checkpoints
```

Порівняння chain
```bash
grep lsn */xtrabackup_checkpoints
```
Швидка перевірка compatibility
```bash
base.to_lsn == inc.from_lsn
```

інакше:
```
This incremental backup seems not proper for the target
```