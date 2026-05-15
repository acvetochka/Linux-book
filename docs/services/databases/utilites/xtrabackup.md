# Percona XtraBackup — докладна довідка

`Percona XtraBackup` — це безкоштовна утиліта з відкритим кодом для резервного копіювання баз даних MySQL, розроблена компанією Percona. Вона створює гарячі (без зупинки сервісу) інкрементальні та повні копії даних для MySQL, MariaDB та Percona Server. Завдяки швидкості та надійності XtraBackup широко використовується у виробничих середовищах.

**Ключові факти**
- **Розробник**: Percona

- **Початковий випуск**: 2009 р.

- **Ліцензія**: GNU GPL v2

- **Підтримувані СУБД**: MySQL, MariaDB, Percona Server

- **Тип резервного копіювання**: Повне, інкрементальне, гаряче

**Основні можливості**  
Percona XtraBackup дозволяє створювати резервні копії без блокування таблиць або зупинки сервера. Вона підтримує інкрементальні бекапи, стиснення даних, шифрування та перевірку цілісності. Утиліта працює з механізмом зберігання InnoDB, що забезпечує точність копій навіть під час активних транзакцій.

**Робочий процес**  
Процес резервного копіювання включає створення фізичних копій файлів даних та журналів транзакцій, які потім можна «приготувати» (prepare) для відновлення. Це дозволяє відновити базу даних до узгодженого стану, мінімізуючи час простою.

**Переваги та застосування**  
XtraBackup популярна серед адміністраторів баз даних завдяки можливості масштабного резервного копіювання у хмарних і локальних інфраструктурах. Її часто використовують у середовищах з великими обсягами даних, де важливо уникнути простою системи.

**Інтеграція та сумісність**  
Інструмент легко інтегрується з системами автоматизації резервного копіювання, такими як Ansible або Puppet, і підтримує використання в контейнерних середовищах. Його також можна поєднувати з Percona Toolkit для моніторингу та управління базами даних.

## Що таке Percona XtraBackup

`Percona XtraBackup` — це open-source утиліта для створення фізичних резервних копій (physical backup) для:
- MySQL
- Percona Server for MySQL
- частково MariaDB
  
## Основне призначення

👉 створення:

- hot backup
- incremental backup
- physical backup

без зупинки MySQL.

## Основні особливості
| Особливість    | Опис        |
| -------------- | ----------- |
| Тип backup     | Physical    |
| Hot backup     | ✔️           |
| Incremental    | ✔️           |
| Compression    | ✔️           |
| Streaming      | ✔️           |
| Downtime       | мінімальний |
| InnoDB support | ✔️           |


## Чим відрізняється від mysqldump
| mysqldump      | XtraBackup      |
| -------------- | --------------- |
| logical backup | physical backup |
| SQL dump       | raw DB files    |
| повільніше     | швидше          |
| маленькі БД    | великі БД       |
| простіше       | складніше       |

## Як працює XtraBackup

Утиліта:

- копіює InnoDB файли
- копіює redo logs
- робить consistent snapshot
- дозволяє recovery

## Основні компоненти
| Компонент    | Призначення     |
| ------------ | --------------- |
| `xtrabackup` | основна утиліта |
| `xbstream`   | streaming       |
| `xbcrypt`    | encryption      |
| `xbcloud`    | cloud upload    |


## Встановлення
🟥 RHEL / Rocky / AlmaLinux
```bash
dnf install percona-xtrabackup-80
```

🟦 Debian / Ubuntu
```bash
apt install percona-xtrabackup-80
```

## Перевірка версії
```bash
xtrabackup --version
```

## Базовий синтаксис
```bash
xtrabackup [options]
```

## Основні режими роботи
| Режим         | Опис               |
| ------------- | ------------------ |
| `--backup`    | створення backup   |
| `--prepare`   | підготовка backup  |
| `--copy-back` | restore            |
| `--move-back` | restore через move |

### Full Backup
📦 Створення backup
```bash
xtrabackup \
--backup \
--target-dir=/backup/full
```

🔹 Що відбувається

👉 утиліта:

- копіює data files
- копіює redo log
- створює consistent state

🔹 Вміст backup directory
| Файл                 | Опис                     |
| -------------------- | ------------------------ |
| `ibdata1`            | InnoDB system tablespace |
| `xtrabackup_info`    | metadata                 |
| `xtrabackup_logfile` | redo logs                |
| `.ibd`               | table files              |

🔹 Backup з авторизацією
```bash
xtrabackup \
--backup \
--user=root \
--password \
--target-dir=/backup/full
```

🔹 Backup конкретної БД
```bash
xtrabackup \
--backup \
--databases="mydb" \
--target-dir=/backup/mydb
```


### Incremental Backup
📌 Ідея

Копіюються лише зміни:
- після попереднього backup.

🔹 Full backup
```bash
xtrabackup \
--backup \
--target-dir=/backup/base
```

🔹 Incremental backup
```bash
xtrabackup \
--backup \
--target-dir=/backup/inc1 \
--incremental-basedir=/backup/base
```

🔹 Наступний incremental
```bash
xtrabackup \
--backup \
--target-dir=/backup/inc2 \
--incremental-basedir=/backup/inc1
```

🔹 Як працює incremental

XtraBackup використовує:
- LSN (Log Sequence Number)

📌 LSN

👉 номер змін у redo log.

### Prepare phase (ДУЖЕ ВАЖЛИВО 🔥)
📌 Що це

Backup НЕ готовий до restore одразу.

Треба:
```bash
xtrabackup \
--prepare \
--target-dir=/backup/full
```

🔹 Що робить prepare

👉 застосовує:

- redo logs
- rollback незавершених транзакцій

🔥 Без prepare restore НЕ можна робити.

### Prepare incremental backup
1. Base backup
    ```bash
    xtrabackup \
    --prepare \
    --apply-log-only \
    --target-dir=/backup/base
    ```
2. Apply incremental
    ```bash
    xtrabackup \
    --prepare \
    --apply-log-only \
    --target-dir=/backup/base \
    --incremental-dir=/backup/inc1
    ```

3. Final prepare
    ```bash
    xtrabackup \
    --prepare \
    --target-dir=/backup/base
    ```

### Restore backup
⚠️ Перед restore 

Зупинити MySQL
```bash
systemctl stop mysqld
```

🔹 Restore files
```bash
xtrabackup \
--copy-back \
--target-dir=/backup/full
```

🔹 Права доступу
⚠️ Дуже важливо
```bash
chown -R mysql:mysql /var/lib/mysql
```

🔹 Запуск MySQL
```bash
systemctl start mysqld
```

🔹 --copy-back vs --move-back
| Опція         | Що робить |
| ------------- | --------- |
| `--copy-back` | копіює    |
| `--move-back` | переміщує |


## Compression
🔹 Стиснення backup
```bash
xtrabackup \
--backup \
--compress \
--target-dir=/backup/full
```

🔹 Розпакування
```bash
xtrabackup \
--decompress \
--target-dir=/backup/full
```

## Streaming Backup
🔹 Streaming через xbstream
```bash
xtrabackup \
--backup \
--stream=xbstream \
| gzip > backup.xb.gz
```

🔹 Restore stream

```bash
gunzip -c backup.xb.gz \
| xbstream -x -C /backup/full
```

## Encryption
🔹 Backup encryption
```bash
xtrabackup \
--backup \
--encrypt=AES256 \
--encrypt-key=secret \
--target-dir=/backup/full
```

## Parallel backup
🔹 `--parallel`
```bash
xtrabackup \
--backup \
--parallel=4 \
--target-dir=/backup/full
```

✔️ Що дає

👉 копіювання кількома потоками.

## Throttling
```bash
xtrabackup \
--backup \
--throttle=100
```

📌 Для чого

👉 обмеження IO-навантаження.

## Реплікація
🔹 Backup replica info
```bash
xtrabackup \
--backup \
--slave-info
```

📌 Для чого

👉 replication setup.

## Binary logs
🔹 `--binlog-info`
```bash
xtrabackup \
--backup \
--binlog-info=ON
```

## Інформаційні файли
| Файл                     | Опис            |
| ------------------------ | --------------- |
| `xtrabackup_info`        | metadata        |
| `xtrabackup_checkpoints` | LSN info        |
| `xtrabackup_binlog_info` | binlog position |

## Часті параметри
| Параметр                | Опис             |
| ----------------------- | ---------------- |
| `--backup`              | створити backup  |
| `--prepare`             | prepare phase    |
| `--copy-back`           | restore          |
| `--target-dir`          | backup directory |
| `--incremental-basedir` | base backup      |
| `--compress`            | compression      |
| `--parallel`            | threads          |
| `--stream`              | streaming        |
| `--encrypt`             | encryption       |

## Типовий production backup
```bash
xtrabackup \
--backup \
--compress \
--parallel=4 \
--target-dir=/backup/full
```

## Типовий restore
```bash
xtrabackup --prepare \
--target-dir=/backup/full

systemctl stop mysqld

xtrabackup --copy-back \
--target-dir=/backup/full

chown -R mysql:mysql /var/lib/mysql

systemctl start mysqld
```

##  ✔️ Переваги XtraBackup

 - hot backup  
 - incremental backup  
 - production-ready  
 - швидкий restore  
 - великі БД  

## ❌ Недоліки

 - складніший
 - physical only
 - version compatibility issues

## Часті помилки
| Помилка           | Причина                 |
| ----------------- | ----------------------- |
| backup unusable   | forgot prepare          |
| permission denied | wrong owner             |
| restore failed    | mysqld running          |
| LSN mismatch      | wrong incremental chain |

## Best Practices

✔️ завжди робити `--prepare`  
✔️ тестувати restore  
✔️ backup + binlog  
✔️ compression  
✔️ incremental strategy  

## Коли використовувати XtraBackup
| Сценарій           | Підходить  |
| ------------------ | ---------- |
| Very large DB      | ✔️          |
| Production         | ✔️          |
| Hot backup         | ✔️          |
| Incremental backup | ✔️          |
| Small dev DB       | ⚠️ overkill |

## Найважливіші файли XtraBackup
| Файл                                                                                                     | Призначення             |
| -------------------------------------------------------------------------------------------------------- | ----------------------- |
| [`xtrabackup_checkpoints`](/services/databases/files/xtrabackup_checkpoints)                             | LSN metadata            |
| [`xtrabackup_binlog_info`](/services/databases/files/xtrabackup_binlog_info)                             | binlog coordinates      |
| [`xtrabackup_info`](/services/databases/files/xtrabackup_info)                                           | backup metadata         |
| [`xtrabackup_logfile`](/services/databases/files/xtrabackup_logfile)                                     | redo log copy           |
| [`xtrabackup_tablespaces`](/services/databases/files/xtrabackup_tablespaces)                             | tablespace mapping      |
| [`backup-my.cnf`](/services/databases/files/Додаткові%20важливі%20файли%20XtraBackup.html#backup-my-cnf) | MySQL settings snapshot |


## Висновок

👉 Percona XtraBackup:

- один з найкращих backup tools для MySQL
- створює hot physical backup
- підтримує incremental backup
- підходить для production-середовищ

👉 Найважливіший етап:
```bash
--prepare
```
без нього backup не готовий до restore.