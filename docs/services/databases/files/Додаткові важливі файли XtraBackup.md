# Додаткові важливі файли XtraBackup

## `ibdata1`
Що це

System tablespace InnoDB.

Містить
- dictionary metadata
- undo
- doublewrite buffer
- internal structures

## `undo_001`, `undo_002`

Undo tablespaces.

**Використовуються**
- для rollback transactions.

## `ib_buffer_pool`

Dump buffer pool pages.

Прискорює
- warm-up після restore/restart.

## `binlog.index`

Список binary logs.

Приклад
```bash
./mysql-bin.000001
./mysql-bin.000002
```

## `auto.cnf`

Містить:
- server_uuid

**Важливо для replication**

Клонування `auto.cnf`  
може створити:
```
duplicate server UUID
```

## `backup-my.cnf`
**Призначення**

Збереження MySQL settings,
необхідних для restore/prepare.

Приклад
```ini
innodb_page_size=16384
innodb_log_file_size=50331648
server_id=1
```

**Використовується**

XtraBackup під час:

- prepare
- restore

**Особливість**

Параметри мають відповідати original server.

## `xtrabackup_slave_info`

(якщо replication)

Містить
```sql
CHANGE REPLICATION SOURCE TO ...
```

Використовується
- для replica provisioning.