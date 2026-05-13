# Довідка: xtrabackup_tablespaces

## Призначення

Файл:
```bash
xtrabackup_tablespaces
```
містить mapping tablespace files.

## Що таке tablespace

Tablespace = фізичний файл InnoDB

Наприклад:

- .ibd
- system tablespace
- undo tablespace

## Приклад
```bash
./world/city.ibd
./world/country.ibd
./world/test.ibd
```

## Використовується
- prepare
- restore
- transportable tablespaces
- partial backup


## Особливо важливий

для:
```bash
--tables
--tables-file
```

Допомагає XtraBackup

знати:

- які tablespaces входять у backup,
- де вони розташовані.

## Особливості
- текстовий файл
- містить список tablespace paths
- metadata only