# Percona Server — повна довідка

## Що таке Percona

`Percona Server for MySQL` — це розширена, безкоштовна та відкрита дистрибуція системи керування базами даних MySQL, розроблена компанією Percona. Вона забезпечує підвищену продуктивність, масштабованість і спостережуваність порівняно з базовим MySQL, залишаючись сумісною на рівні API та протоколів.

**Основні факти**
- **Розробник: Percona**
  
- **Тип ПЗ**: Дистрибуція СУБД MySQL з відкритим кодом
  
- **Ліцензія**: GNU General Public License (GPL)
  
- **Сумісність**: Повна з MySQL та MariaDB
  
- **Підтримка**: Комерційна підтримка Percona, безкоштовна спільнотна версія

**Походження та розвиток**  
Percona Server for MySQL з’явився у 2006 році як оптимізована альтернатива стандартному MySQL. Розробники прагнули усунути обмеження продуктивності та стабільності, характерні для певних версій MySQL, і додали можливості корпоративного рівня без зміни базового механізму роботи. Продукт оновлюється паралельно з MySQL, забезпечуючи швидке впровадження виправлень і нових функцій.

**Ключові особливості**  
Percona Server включає оптимізований механізм зберігання XtraDB (форк InnoDB), розширені інструменти діагностики, аудитів і моніторингу, а також підтримку шифрування даних на рівні таблиць. Система пропонує поліпшене керування пам’яттю, швидший кеш запитів і покращену реплікацію для високонавантажених середовищ.

**Використання та значення**  
Percona Server for MySQL часто застосовується у хмарних, фінансових та e-commerce рішеннях, де критичними є стабільність і швидкодія. Його обирають підприємства, які прагнуть гнучкості open-source із рівнем надійності комерційних СУБД. Завдяки сумісності з MySQL, міграція та інтеграція відбуваються без змін застосунків.


👉 Це форк MySQL, який:
- повністю сумісний (API, клієнти, SQL)
- має розширення для продуктивності та моніторингу
- безкоштовно включає enterprise-функції

## Архітектура

`Percona` = не один пакет, а екосистема:

Основні компоненти:
- Percona Server — ядро БД
- Percona XtraBackup — гарячі бекапи
- Percona Toolkit — утиліти адміністрування
- Percona PMM — моніторинг

## Percona vs MySQL
| Функція        | MySQL     | Percona      |
| -------------- | --------- | ------------ |
| Open Source    | частково  | повністю     |
| Продуктивність | стандарт  | оптимізована |
| Thread Pool    | платний   | безкоштовний |
| Slow Query     | базовий   | розширений   |
| Backup         | mysqldump | XtraBackup   |


👉 Висновок:
> Percona = MySQL + продуктивність + інструменти

## Встановлення
🟥 RedHat (RHEL / Rocky / AlmaLinux)
```bash
sudo dnf install https://repo.percona.com/yum/percona-release-latest.noarch.rpm
sudo percona-release setup ps80
sudo dnf install percona-server-server
```

🟦 Debian / Ubuntu
```bash
wget https://repo.percona.com/apt/percona-release_latest.generic_all.deb
sudo dpkg -i percona-release_latest.generic_all.deb
sudo percona-release setup ps80
sudo apt update
sudo apt install percona-server-server
```


## Сервіс (systemd)
| Дистрибутив   | Назва сервісу |
| ------------- | ------------- |
| RedHat        | `mysqld`      |
| Ubuntu/Debian | `mysql`       |

```bash
# RedHat
sudo systemctl start mysqld

# Debian
sudo systemctl start mysql
```

## Перший запуск
🔐 RedHat
```bash
sudo grep 'temporary password' /var/log/mysqld.log
```
🔐 Debian
```bash
sudo mysql
```

Безпека
```bash
sudo mysql_secure_installation
```

## Основні шляхи
| Що                | RedHat                | Debian                     |
| ----------------- | --------------------- | -------------------------- |
| Конфіг            | `/etc/my.cnf`         | `/etc/mysql/my.cnf`        |
| Додаткові конфіги | `/etc/my.cnf.d/`      | `/etc/mysql/conf.d/`       |
| Дані              | `/var/lib/mysql/`     | `/var/lib/mysql/`          |
| Логи              | `/var/log/mysqld.log` | `/var/log/mysql/error.log` |

## Основні команди
```bash
# запуск
systemctl start mysqld

# зупинка
systemctl stop mysqld

# рестарт
systemctl restart mysqld

# автозапуск
systemctl enable mysqld
```

## Підключення
```bash
mysql -u root -p
```

## Конфігурація (my.cnf)
⚡ Продуктивність
```ini
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
```
🔗 Підключення
```ini
max_connections = 200
bind-address = 0.0.0.0.
```
📊 Логи
```ini
slow_query_log = 1
long_query_time = 2
```

## Firewall і мережа
🟥 RedHat (firewalld)
```bash
sudo firewall-cmd --add-service=mysql --permanent
sudo firewall-cmd --reload
```

🟦 Debian (ufw)
```bash
sudo ufw allow 3306
```

## SELinux (тільки RedHat ⚠️)
```bash
getenforce
```
```bash
sudo setsebool -P mysql_connect_any 1
```

## Перевірка порту
```bash
ss -tulnp | grep 3306
```

## Особливості Percona
⚡ 1. Розширена статистика
```sql
SHOW USER_STATISTICS;
```
⚡ 2. Thread Pool
- ефективна обробка тисяч підключень

⚡ 3. Extended Slow Log
- більше деталей ніж у MySQL

⚡ 4. XtraBackup (гарячий бекап)
```bash
xtrabackup --backup --target-dir=/backup
```

## Реплікація

Працює як у MySQL:

- master → replica
- GTID
- binlog

## Типові проблеми
❌ RedHat
- SELinux блокує
- firewalld не відкритий

❌ Debian
- неправильний socket
- auth plugin issues

## Коли використовувати Percona

✔️ Highload системи  
✔️ Великі БД  
✔️ Потрібен аналіз запитів  
✔️ Потрібні гарячі бекапи  

## Коли достатньо MySQL

✔️ маленькі проекти  
✔️ навчання  
✔️ low traffic  