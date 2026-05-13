# Довідка: xtrabackup_binlog_info

## Призначення

Файл:
```
xtrabackup_binlog_info
```
містить:

- координати binary log,
- позицію binlog на момент backup,
- GTID (якщо використовується).

Використовується для:

- replication,
- point-in-time recovery (PITR),
- replay через mysqlbinlog.

## Розташування
```bash
/backup/full/xtrabackup_binlog_info
```

## Приклад
```bash
mysql-bin.000001 183584
```

Або з GTID
```bash
mysql-bin.000001 183584 3E11FA47-71CA-11E1-9E33-C80AA9429562:23
```

## Поля
| Поле        | Значення         |
| ----------- | ---------------- |
| binlog file | файл binary log  |
| position    | позиція в binlog |
| GTID        | GTID set         |

## Що означає position
```
183584
```
означає:
```
backup консистентний до цієї позиції
```

## Для PITR

Після restore backup:
```bash
mysqlbinlog \
--start-position=183584 \
mysql-bin.000001
```
відтворить:
- усі зміни після backup

## Створюється

Автоматично при:
```bash
xtrabackup --backup
```

## Особливості
- critical для PITR
- використовується замість SHOW MASTER STATUS
- допомагає правильно вибрати start-position

## Аналог у mysqldump

Подібне до:
```bash
mysqldump --master-data
```