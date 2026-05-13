# Довідка: xtrabackup_logfile

## Призначення

Файл:
```bash
xtrabackup_logfile
```
містить копію InnoDB redo log.

## Що таке redo log

Redo log:
- журнал змін InnoDB,
- використовується для recovery.

## Для чого потрібен

Під час backup:

- дані копіюються while MySQL running,
- redo log потрібен для consistency.

## Розташування
```bash
/backup/full/xtrabackup_logfile
```

## Особливості
- binary format
- НЕ читається вручну
- використовується під час `--prepare`

## Під час prepare
```bash
xtrabackup --prepare
```
redo log:

- replay-иться,
- changes apply-яться до pages.

## Аналогія
| Файл               | Аналог                |
| ------------------ | --------------------- |
| xtrabackup_logfile | ib_logfile / redo log |

## Важливість

Без:
```bash
xtrabackup_logfile
```
prepare неможливий

Після prepare redo changes:
- already applied,
- backup стає consistent.