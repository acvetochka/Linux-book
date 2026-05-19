# Докладна довідка по Apache HTTP Server (Apache httpd)

## 1. Що таке вебсервер

`Вебсервер` — це програма, яка:

- приймає HTTP/HTTPS-запити від клієнтів (браузерів, API, - мобільних додатків);
- обробляє їх;
- повертає відповідь:
  - HTML-сторінки,
  - CSS,
  - JavaScript,
  - зображення,
  - JSON,
  - файли тощо.

## Схема роботи
> Користувач → Browser → HTTP/HTTPS → Web Server → Файл/Backend → Відповідь

Основні задачі вебсерверів
- обслуговування сайтів;
- передача статичних файлів;
- проксіювання запитів до backend;
- SSL/TLS шифрування;
- аутентифікація;
- балансування навантаження;
- логування;
- контроль доступу.

## 2. Що таке Apache httpd

Apache HTTP Server — один із найстаріших та найпопулярніших вебсерверів у світі.

Apache HTTP Server (часто званий Apache) — це відкрите програмне забезпечення для створення та управління вебсервером. Розроблений Apache Software Foundation, він є одним із найпопулярніших серверів, що забезпечує розповсюдження вебконтенту в Інтернеті. Його стабільність, розширюваність і кросплатформність зробили Apache центральним компонентом вебінфраструктури з кінця 1990-х років.

**Ключові факти**  
**Розробник**: Apache Software Foundation

**Перше випуск**: 1995

**Ліцензія**: Apache License 2.0

**Мови програмування**: C

**ОС-підтримка**: Unix/Linux, Windows, macOS

**Історія та розвиток**  
Apache HTTP Server виник у 1995 році як продовження коду NCSA HTTPd. Його назва походить від фрази “a patchy server”, що відображало походження з “заплатаного” коду попередника. Проєкт швидко здобув домінуючу позицію серед вебсерверів завдяки відкритому коду та активній спільноті розробників.

**Архітектура та модулі**  
Apache побудований за модульною архітектурою, що дозволяє додавати функції через модулі (наприклад, mod_ssl для HTTPS, mod_rewrite для перенаправлень). Конфігурація здійснюється через текстові файли, зазвичай httpd.conf, де адміністратори визначають параметри безпеки, віртуальні хости та політику кешування.

**Використання та вплив**  
Apache є ключовою частиною класичного стеку LAMP (Linux, Apache, MySQL, PHP/Perl/Python), на якому базуються мільйони вебсайтів. Хоча його частка ринку зменшилася через конкуренцію від Nginx і Microsoft IIS, Apache залишається важливим інструментом для корпоративних і освітніх середовищ.

**Поточний стан**  
Сервер постійно оновлюється для підтримки сучасних стандартів, таких як HTTP/2 і TLS 1.3. Розвиток координується спільнотою Apache HTTP Server Project у рамках Apache Software Foundation, що забезпечує відкритість і прозорість процесу розробки.

**Назва сервісу**:
```bash
httpd
```
**Назва пакета**:
```bash
apache2
```
або
```bash
httpd
```
(залежить від дистрибутива Linux)

## 3. Історія та особливості Apache

Apache:

- створений у 1995 році;
- підтримується Apache Software Foundation;
- повністю open-source;
- працює майже на всіх ОС.

## 4. Основні можливості Apache
Apache підтримує

Вебсайти
- HTML
- PHP
- Python
- Perl
- CGI
- Node.js через proxy

HTTPS
- SSL/TLS сертифікати
- Let's Encrypt

Reverse Proxy

Apache може працювати як:

- reverse proxy;
- load balancer;
- gateway.

Віртуальні хости

Декілька сайтів на одному сервері:

- example.com
- api.example.com
- site2.com

Аутентифікація
- Basic Auth
- LDAP
- Kerberos

Контроль доступу
- по IP;
- по директоріях;
- по користувачах.

Модулі

Apache модульний:

- mod_ssl
- mod_proxy
- mod_rewrite
- mod_headers
- mod_security

## 5. Архітектура Apache
Основна схема
```
Client
   ↓
Apache Parent Process
   ↓
Worker Processes / Threads
   ↓
Modules
   ↓
Files / Backend / Applications
```

## 6. MPM (Multi-Processing Modules)

Apache використовує MPM для роботи з процесами/потоками.

- **Prefork**
  > 1 process = 1 request

  Особливості:

  - стабільний;
  - сумісний зі старими PHP-модулями;
  - багато RAM.

  Використання
  ```bash
  apachectl -V | grep MPM
  ```

  Worker
  > Processes + Threads

  Плюси:

  - менше RAM;
  - швидший.

- Event

    Сучасний режим.

    Плюси:

    - ефективний KeepAlive;
    - найкраща продуктивність.
## 7. Встановлення Apache
Debian/Ubuntu
```bash
sudo apt update
sudo apt install apache2
```

RHEL/CentOS/Rocky/AlmaLinux
```bash
sudo dnf install httpd
```
або:
```bash
sudo yum install httpd
```

## 8. Основні служби systemd
Запуск
```bash
sudo systemctl start apache2
```
або:
```bash
sudo systemctl start httpd
```

Автозапуск
```bash
sudo systemctl enable apache2
```

Статус
```bash
systemctl status apache2
```

Перезапуск
```bash
sudo systemctl restart apache2
```

Reload конфігурації
```bash
sudo systemctl reload apache2
```


Reload:

- перечитує конфіг;
- не розриває існуючі з’єднання.

## 9. Основні каталоги та файли
### Debian/Ubuntu
Головний конфіг
```bash
/etc/apache2/apache2.conf
```
Порти
```bash
/etc/apache2/ports.conf
```

Сайти
```bash
/etc/apache2/sites-available/
/etc/apache2/sites-enabled/
```

Модулі
```bash
/etc/apache2/mods-available/
/etc/apache2/mods-enabled/
```

Логи
```bash
/var/log/apache2/
```

DocumentRoot
```bash
/var/www/html
```

| Каталог            | Призначення        |
| ------------------ | ------------------ |
| `/etc/apache2/`    | головна директорія |
| `sites-available/` | конфіги сайтів     |
| `sites-enabled/`   | активні сайти      |
| `mods-available/`  | модулі             |
| `mods-enabled/`    | активні модулі     |



### RHEL/CentOS
Основний конфіг
```bash
/etc/httpd/conf/httpd.conf
```
Додаткові конфіги
```bash
/etc/httpd/conf.d/
```

Логи
```bash
/var/log/httpd/
```

DocumentRoot
```bash
/var/www/html
```

| Каталог                      | Призначення        |
| ---------------------------- | ------------------ |
| `/etc/httpd/`                | головна директорія |
| `/etc/httpd/conf/httpd.conf` | головний конфіг    |
| `/etc/httpd/conf.d/`         | додаткові конфіги  |
| `/etc/httpd/conf.modules.d/` | конфіги модулів    |
| `/var/log/httpd/`            | журнали            |
| `/var/www/html/`             | DocumentRoot       |

### Важлива відмінність

У Debian:

- є система:
  - sites-available;
  - sites-enabled;
  - a2ensite.

У RHEL:

- зазвичай просто додають .conf файли в:
```bash
/etc/httpd/conf.d/
```

## 10.  Основні утиліти Apache
### apachectl

Головна утиліта керування.

Перевірка конфіга
```bash
apachectl configtest
```
або:
```bash
httpd -t
```

Перезапуск
```bash
apachectl restart
```

Reload
```bash
apachectl graceful
```

Graceful:

- плавне перезавантаження;
- без розриву активних з’єднань.

### a2enmod / a2dismod (Debian)
Увімкнення модуля
```bash
sudo a2enmod rewrite
```

Вимкнення
```bash
sudo a2dismod rewrite
```

### a2ensite / a2dissite
Увімкнення сайту
```bash
sudo a2ensite example.conf
```

Вимкнення
```bash
sudo a2dissite example.conf
```

### RHEL/CentOS/Rocky/AlmaLinux
a2enmod та a2ensite відсутні

У RHEL:
- модулі підключаються через:
  ```apache
  LoadModule
  ```
- конфіги сайтів кладуть у:
  ```bash
  /etc/httpd/conf.d/
  ```

### httpd

Бінарний файл сервера.

Перевірка модулів
```bash
httpd -M
```
Перевірка VirtualHost
```bash
httpd -S
```

Інформація про збірку
```bash
httpd -V
```


## 11. Конфігурація Apache
Основний синтаксис  
```apache
Directive value
```
Приклад:
```apache
ServerName example.com
Listen 80
```

## 12. Listen

Вказує порт.
```apache
Listen 80
Listen 443
```

## 13. ServerName

Головне доменне ім’я.
```apache
ServerName example.com
```

## 14. DocumentRoot

Каталог сайту.
```apache
DocumentRoot /var/www/site
```

## 15. Directory

Налаштування для директорії.
```apache
<Directory "/var/www/site">
    AllowOverride All
    Require all granted
</Directory>
```

## 16. Віртуальні хости (Virtual Hosts)

Дозволяють запускати декілька сайтів.

Приклад HTTP VirtualHost
```apache
<VirtualHost *:80>

    ServerName example.com
    ServerAlias www.example.com

    DocumentRoot /var/www/example

    ErrorLog ${APACHE_LOG_DIR}/example_error.log
    CustomLog ${APACHE_LOG_DIR}/example_access.log combined

</VirtualHost>
```

### Debian

Типово:
```bash
/etc/apache2/sites-available/example.conf
```
Після:
```bash
sudo a2ensite example.conf
sudo systemctl reload apache2
```

### RHEL

Типово:
```bash
/etc/httpd/conf.d/example.conf
```
Після створення:
```bash
sudo systemctl reload httpd
```
Ніяких a2ensite немає.

## 17. HTTPS VirtualHost
```apache
<VirtualHost *:443>

    ServerName example.com

    SSLEngine on

    SSLCertificateFile /etc/ssl/certs/domain.crt
    SSLCertificateKeyFile /etc/ssl/private/domain.key

</VirtualHost>
```

## 18. SSL/TLS
Основні файли сертифікатів
```
.crt
.key
.pem
```

Увімкнення SSL модуля

**Debian/Ubuntu**

```bash
sudo a2enmod ssl
sudo systemctl restart apache2
```

**RHEL/CentOS/Rocky/AlmaLinux**

У RedHat-дистрибутивах немає `a2enmod`.

SSL підтримка зазвичай підключається через пакет:
```bash
sudo dnf install mod_ssl
```
або:
```bash
sudo yum install mod_ssl
```
Після встановлення:

- автоматично створюється SSL-конфіг;
- завантажується модуль mod_ssl.

Основний SSL конфіг у RHEL
```bash
/etc/httpd/conf.d/ssl.conf
```

Перезапуск Apache
```bash
sudo systemctl restart httpd
```

Перевірка завантаження SSL модуля
```bash
httpd -M | grep ssl
```
Очікувано:
```
ssl_module (shared)
```

## 19. .htaccess

Файл локальної конфігурації директорії.

Приклад:
```apache
RewriteEngine On
RewriteRule ^old$ /new [R=301,L]
```

Дозвіл .htaccess
```apache
<Directory "/var/www/html">
    AllowOverride All
</Directory>
```

Недоліки .htaccess
- повільніше;
- Apache читає файл при кожному запиті.

Краще:
- використовувати головний конфіг.

### Особливості RHEL + SELinux

Навіть якщо `.htaccess` правильний, SELinux може блокувати доступ.

Перевірка SELinux
```bash
getenforce
```

Відновлення контекстів
```bash
restorecon -Rv /var/www/html
```

## 20.  mod_rewrite

Один із найважливіших модулів.

Увімкнення
```bash
sudo a2enmod rewrite
```
Приклад redirect
```apache
RewriteEngine On
RewriteRule ^old$ /new [R=301,L]
```

Приклад "гарних URL"
```apache
RewriteRule ^article/([0-9]+)$ article.php?id=$1 [L,QSA]
```

## 21. Reverse Proxy

Apache може передавати запити backend-серверам.

### Debian
Увімкнення модулів
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
```

### RHEL модулі proxy

У більшості випадків вже доступні:
```bash
httpd -M | grep proxy
```

Якщо модулів нема
```bash
sudo dnf install mod_proxy_html
```

Приклад
```apache
ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/
```

## 22. Керування доступом
Дозвіл всім
```apache
Require all granted
```

Заборона всім
```apache
Require all denied
```

Дозвіл по IP
```apache
Require ip 192.168.1.10
```

Декілька IP
```apache
Require ip 192.168.1.0/24
```

## 23. Basic Authentication

Утиліта htpasswd  
Debian
```bash
sudo apt install apache2-utils
```

RHEL
```bash
sudo dnf install httpd-tools
```

Створення пароля
```bash
htpasswd -c /etc/apache2/.htpasswd admin
```

Конфіг
```apache
<Directory "/var/www/secure">

    AuthType Basic
    AuthName "Restricted Area"

    AuthUserFile /etc/apache2/.htpasswd

    Require valid-user

</Directory>
```

## 24. Журнали (Logs)
Debian
```bash
/var/log/apache2/
```

RHEL
```bash
/var/log/httpd/
```

### Systemd journal
Debian
```bash
journalctl -u apache2
```

RHEL
```bash
journalctl -u httpd
```

### Access Log

Усі запити.
```bash
/var/log/apache2/access.log
```

### Error Log

Помилки сервера.
```bash
/var/log/apache2/error.log
```

### Перегляд логів
```bash
tail -f /var/log/apache2/error.log
```

Формати логів
```apache
LogFormat "%h %l %u %t \"%r\" %>s %b" common
```

## 25. Статуси HTTP
| Код | Значення              |
| --- | --------------------- |
| 200 | OK                    |
| 301 | Redirect              |
| 403 | Forbidden             |
| 404 | Not Found             |
| 500 | Internal Server Error |
| 502 | Bad Gateway           |
| 503 | Service Unavailable   |

## 26. KeepAlive

Дозволяє повторно використовувати TCP-з’єднання.
```apache
KeepAlive On
MaxKeepAliveRequests 100
KeepAliveTimeout 5
```

## 27. MIME Types

Визначають тип файлів.
```apache
AddType application/json .json
```

## 28. CGI

Apache підтримує CGI-скрипти.

**Debian**  
Увімкнення
```bash
sudo a2enmod cgid
```

**RHEL**

CGI зазвичай вже доступний:
```bash
httpd -M | grep cgi
```

CGI директорія у RHEL
```bash
/var/www/cgi-bin/
```

## 29. PHP та Apache
### Debian
**mod_php**

Старий варіант:
```apache
libapache2-mod-php
```

**PHP-FPM (сучасний)**
```apache
ProxyPassMatch ^/(.*\.php)$ unix:/run/php/php8.2-fpm.sock|fcgi://localhost/
```

### RHEL
**mod_php**
```bash
sudo dnf install php
```

**PHP-FPM**
```bash
sudo dnf install php-fpm
```

Запуск PHP-FPM
```bash
sudo systemctl enable --now php-fpm
```

## 30. Compression (gzip)
**Debian**  
mod_deflate
```bash
sudo a2enmod deflate
```

Приклад
```apache
AddOutputFilterByType DEFLATE text/html text/plain text/css
```

**RHEL**

Модуль зазвичай уже є.

Перевірка:
```bash
httpd -M | grep deflate
```

## 31. Кешування
mod_expires
```bash
sudo a2enmod expires
```

Приклад
```apache
ExpiresActive On
ExpiresByType image/png "access plus 30 days"
```

**RHEL**

Перевірка:
```bash
httpd -M | grep expires
```

## 32. Безпека Apache
Приховування версії
```apache
ServerTokens Prod
ServerSignature Off
```

Захист директорій
```apache
Options -Indexes
```

Заборона доступу до файлів
```apache
<FilesMatch "^\.">
    Require all denied
</FilesMatch>
```

## 33. SELinux (RHEL)
SELinux є однією з головних відмінностей RedHat-family

SELinux може:

- блокувати доступ до файлів;
- блокувати proxy;
- блокувати мережеві з’єднання;
- викликати 403 навіть при правильних правах.

Контекст для web
```bash
restorecon -Rv /var/www/html
```

Дозвіл мережевих з’єднань (proxy/network)
```bash
setsebool -P httpd_can_network_connect 1
```

Доступ до home директорій
```bash
setsebool -P httpd_enable_homedirs 1
```

Перегляд помилок SELinux
```bash
ausearch -m AVC
```

## 34. Firewall
Debian

Часто використовується:
- ufw

RHEL

Типово:
- firewalld

**firewalld**
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

**iptables**
```bash
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## 35. Типові проблеми Apache
### Syntax error

Перевірка:
```bash
apachectl configtest
```

### Port already in use
```bash
ss -tulpn | grep :80
```

### Permission denied

Перевірити:

- права;
- SELinux;
- власника файлів.

### 403 Forbidden

Причини:

- Require denied;
- неправильні права;
- Options;
- SELinux.


## 36. Продуктивність Apache
Основні параметри
```apache
MaxRequestWorkers
StartServers
ThreadsPerChild
```

## 37. Apache vs Nginx
| Apache        | Nginx       |
| ------------- | ----------- |
| .htaccess     | немає       |
| Гнучкість     | Вища        |
| RAM           | Більше      |
| Статика       | Повільніше  |
| Reverse proxy | Є           |
| Модулі        | Дуже багато |

## 38. Корисні модулі Apache
Особливість RHEL

Конфіги модулів:
```bash
/etc/httpd/conf.modules.d/
```

Приклад завантаження модуля
```apache
LoadModule ssl_module modules/mod_ssl.so
```

| Модуль       | Призначення   |
| ------------ | ------------- |
| mod_ssl      | HTTPS         |
| mod_rewrite  | URL rewrite   |
| mod_proxy    | Reverse proxy |
| mod_headers  | HTTP headers  |
| mod_security | WAF           |
| mod_status   | Статистика    |
| mod_deflate  | gzip          |
| mod_expires  | cache         |

## 39. mod_status

Показує стан Apache.

Увімкнення
```bash
sudo a2enmod status
```

Конфіг
```apache
<Location /server-status>
    SetHandler server-status
    Require local
</Location>
```

Перегляд
```
http://localhost/server-status
```

## 40. Корисні команди адміністрування
### Debian
Список модулів
```bash
apachectl -M
```

Список VirtualHost
```bash
apachectl -S
```

Перевірка синтаксису
```bash
apachectl configtest
```

### RHEL
```bash
httpd -M
```

Тест конфігурації
```bash
httpd -t
```

### Активні з’єднання
```bash
ss -tnlp | grep httpd
```

## 41. Типова структура сайту
```
/var/www/
└── example/
    ├── public/
    │   ├── index.html
    │   ├── css/
    │   ├── js/
    │   └── images/
    └── logs/
```

## 42.  Рекомендована практика
Краще:
- використовувати HTTPS;
- використовувати PHP-FPM;
- використовувати Event MPM;
- мінімізувати .htaccess;
- регулярно перевіряти логи;
- робити backup конфігів.

## 43.  Backup конфігурації
```bash
tar czf apache-backup.tar.gz /etc/apache2
```

## 44.  Перевірка відкритих портів
```bash
ss -tulpn
```

## 45.  Тест HTTP
```bash
curl -I http://localhost
```

## 46.  Перевірка SSL
```bash
openssl s_client -connect example.com:443
```

## 47.  Основні файли Apache (коротка таблиця)
| Файл                      | Призначення      |
| ------------------------- | ---------------- |
| apache2.conf / httpd.conf | головний конфіг  |
| ports.conf                | порти            |
| sites-available           | конфіги сайтів   |
| sites-enabled             | активні сайти    |
| mods-available            | модулі           |
| access.log                | журнал доступу   |
| error.log                 | журнал помилок   |
| .htaccess                 | локальні правила |

## 48.  Висновок

`Apache HTTP Server` — потужний, гнучкий та модульний вебсервер, який:

- підходить для класичних сайтів;
- підтримує reverse proxy;
- добре працює з PHP;
- має величезну кількість модулів;
- дозволяє дуже тонке налаштування безпеки та доступу.

Найважливіше для адміністратора Apache:

- розуміти VirtualHost;
- вміти читати логи;
- знати mod_rewrite;
- правильно налаштовувати HTTPS;
- регулярно перевіряти конфігурацію через apachectl configtest.