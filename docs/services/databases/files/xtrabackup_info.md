# Довідка: xtrabackup_info

## Призначення

Файл:
```bash
xtrabackup_info
```
містить metadata backup:

- час backup,
- тип backup,
- версію MySQL,
- LSN,
- параметри backup.

## Розташування
```bash
/backup/full/xtrabackup_info
```

## Приклад
```ini
uuid = 4c3e2a0d-3074-11ef-9f7d-525400123456
name =
tool_name = xtrabackup
tool_command = --backup --target-dir=/backup/full
tool_version = 8.0.35-31
ibbackup_version = 8.0.35-31
server_version = 8.0.45
start_time = 2026-05-13 01:10:20
end_time = 2026-05-13 01:10:32
lock_time = 0
binlog_pos = filename 'mysql-bin.000001', position '183584'
innodb_from_lsn = 0
innodb_to_lsn = 21748866
partial = N
incremental = N
format = file
compressed = N
encrypted = N
```

## Основні параметри
- `uuid` - Унікальний ID backup.

- `tool_name` -  Зазвичай: `xtrabackup`

- `tool_command` - Команда запуску backup.

- `tool_version` - Версія XtraBackup.

- `server_version` - Версія MySQL server.

- `start_time` - Початок backup.

- `end_time` - Завершення backup.

- `lock_time` - Час table locking.

- `binlog_pos` - Координати binary log.

- `innodb_from_lsn` - Початковий LSN.

- `innodb_to_lsn` - Кінцевий LSN.

- `partial`
  | Значення | Значення       |
  | -------- | -------------- |
  | `Y`      | partial backup |
  | `N`      | full backup    |

- `incremental`
  | Значення | Значення           |
  | -------- | ------------------ |
  | `Y`      | incremental backup |
  | `N`      | full backup        |

- `compressed`
  | Значення | Значення          |
  | -------- | ----------------- |
  | `Y`      | compressed backup |
  | `N`      | normal backup     |

- `encrypted`
  | Значення | Значення         |
  | -------- | ---------------- |
  | `Y`      | encrypted backup |
  | `N`      | unencrypted      |

## Для чого корисний

✅ audit  
✅ troubleshooting  
✅ PITR  
✅ перевірка incremental chain  
✅ backup inventory