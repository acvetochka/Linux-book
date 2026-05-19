# Загальна таблиця порівняння Apache в Debian vs RHEL

## 1. Встановлення Apache
| Дія                     | Debian/Ubuntu         | RHEL/CentOS/Rocky/Alma |
| ----------------------- | --------------------- | ---------------------- |
| Встановлення Apache     | `apt install apache2` | `dnf install httpd`    |
| Старий менеджер пакетів | —                     | `yum install httpd`    |
| Назва пакета            | `apache2`             | `httpd`                |
| Назва сервісу           | `apache2`             | `httpd`                |

## 2. Керування службою (systemd)
| Дія                   | Debian/Ubuntu               | RHEL-family               |
| --------------------- | --------------------------- | ------------------------- |
| Запуск                | `systemctl start apache2`   | `systemctl start httpd`   |
| Зупинка               | `systemctl stop apache2`    | `systemctl stop httpd`    |
| Перезапуск            | `systemctl restart apache2` | `systemctl restart httpd` |
| Reload                | `systemctl reload apache2`  | `systemctl reload httpd`  |
| Статус                | `systemctl status apache2`  | `systemctl status httpd`  |
| Автозапуск            | `systemctl enable apache2`  | `systemctl enable httpd`  |
| Вимкнення автозапуску | `systemctl disable apache2` | `systemctl disable httpd` |

## 3. Основні файли та каталоги
| Призначення        | Debian/Ubuntu                                   | RHEL-family                  |
| ------------------ | ----------------------------------------------- | ---------------------------- |
| Головна директорія | `/etc/apache2/`                                 | `/etc/httpd/`                |
| Головний конфіг    | `/etc/apache2/apache2.conf`                     | `/etc/httpd/conf/httpd.conf` |
| Порти              | `/etc/apache2/ports.conf`                       | у `httpd.conf`               |
| Конфіги сайтів     | `/etc/apache2/sites-available/`                 | `/etc/httpd/conf.d/`         |
| Активні сайти      | `/etc/apache2/sites-enabled/`                   | немає                        |
| Модулі             | `/etc/apache2/mods-available/`                  | `/etc/httpd/conf.modules.d/` |
| Активні модулі     | `/etc/apache2/mods-enabled/`                    | немає                        |
| Логи               | `/var/log/apache2/`                             | `/var/log/httpd/`            |
| DocumentRoot       | `/var/www/html/`                                | `/var/www/html/`             |
| SSL конфіг         | `/etc/apache2/sites-available/default-ssl.conf` | `/etc/httpd/conf.d/ssl.conf` |

## 4. Перевірка та керування Apache
| Дія                   | Debian/Ubuntu          | RHEL-family          |
| --------------------- | ---------------------- | -------------------- |
| Перевірка конфігу     | `apachectl configtest` | `httpd -t`           |
| Список модулів        | `apachectl -M`         | `httpd -M`           |
| VirtualHost           | `apachectl -S`         | `httpd -S`           |
| Інформація про збірку | `apachectl -V`         | `httpd -V`           |
| Graceful reload       | `apachectl graceful`   | `apachectl graceful` |

## 5. Увімкнення модулів
| Дія               | Debian/Ubuntu      | RHEL-family                                  |
| ----------------- | ------------------ | -------------------------------------------- |
| Увімкнення модуля | `a2enmod rewrite`  | модулі вже підключені або через `LoadModule` |
| Вимкнення модуля  | `a2dismod rewrite` | ручне редагування конфігів                   |
| SSL модуль        | `a2enmod ssl`      | `dnf install mod_ssl`                        |
| Rewrite           | `a2enmod rewrite`  | зазвичай уже є                               |
| Proxy             | `a2enmod proxy`    | зазвичай уже є                               |
| Headers           | `a2enmod headers`  | зазвичай уже є                               |

## 6. Віртуальні хости (Virtual Hosts)
| Дія               | Debian/Ubuntu                  | RHEL-family              |
| ----------------- | ------------------------------ | ------------------------ |
| Конфіг сайта      | `sites-available/example.conf` | `conf.d/example.conf`    |
| Активація сайта   | `a2ensite example.conf`        | не потрібна              |
| Вимкнення сайта   | `a2dissite example.conf`       | видалення/rename `.conf` |
| Reload після змін | `systemctl reload apache2`     | `systemctl reload httpd` |

## 7. SSL/TLS
| Дія                  | Debian/Ubuntu              | RHEL-family                            |
| -------------------- | -------------------------- | -------------------------------------- |
| Встановлення SSL     | `a2enmod ssl`              | `dnf install mod_ssl`                  |
| SSL конфіг           | `default-ssl.conf`         | `ssl.conf`                             |
| Перевірка SSL модуля | `apachectl -M \| grep ssl` | `httpd -M \| grep ssl`                 |
| Сертифікати          | `/etc/ssl/`                | `/etc/pki/tls/` часто використовується |

## 8. PHP
| Дія            | Debian/Ubuntu                    | RHEL-family               |
| -------------- | -------------------------------- | ------------------------- |
| mod_php        | `apt install libapache2-mod-php` | `dnf install php`         |
| PHP-FPM        | `apt install php-fpm`            | `dnf install php-fpm`     |
| Запуск PHP-FPM | `systemctl start php8.x-fpm`     | `systemctl start php-fpm` |

## 9. CGI
| Дія            | Debian/Ubuntu       | RHEL-family           |
| -------------- | ------------------- | --------------------- |
| Увімкнення CGI | `a2enmod cgid`      | зазвичай уже активний |
| CGI директорія | `/usr/lib/cgi-bin/` | `/var/www/cgi-bin/`   |

## 10. Basic Authentication
| Дія              | Debian/Ubuntu               | RHEL-family               |
| ---------------- | --------------------------- | ------------------------- |
| htpasswd utility | пакет `apache2-utils`       | пакет `httpd-tools`       |
| Встановлення     | `apt install apache2-utils` | `dnf install httpd-tools` |

## 11. Логи та journalctl
| Дія            | Debian/Ubuntu                 | RHEL-family                 |
| -------------- | ----------------------------- | --------------------------- |
| Access log     | `/var/log/apache2/access.log` | `/var/log/httpd/access_log` |
| Error log      | `/var/log/apache2/error.log`  | `/var/log/httpd/error_log`  |
| Перегляд логів | `tail -f ...`                 | `tail -f ...`               |
| systemd logs   | `journalctl -u apache2`       | `journalctl -u httpd`       |

## 12. Firewall
| Дія              | Debian/Ubuntu       | RHEL-family                        |
| ---------------- | ------------------- | ---------------------------------- |
| Типовий firewall | `ufw`               | `firewalld`                        |
| Відкрити HTTP    | `ufw allow 80/tcp`  | `firewall-cmd --add-service=http`  |
| Відкрити HTTPS   | `ufw allow 443/tcp` | `firewall-cmd --add-service=https` |
| Reload firewall  | `ufw reload`        | `firewall-cmd --reload`            |

## 13. SELinux vs AppArmor
| Особливість           | Debian/Ubuntu     | RHEL-family                                |
| --------------------- | ----------------- | ------------------------------------------ |
| Система захисту       | AppArmor          | SELinux                                    |
| Увімкнена типово      | часто так         | майже завжди                               |
| Може блокувати Apache | рідше             | дуже часто                                 |
| Перевірка             | `aa-status`       | `getenforce`                               |
| Логи                  | `/var/log/syslog` | `ausearch -m AVC`                          |
| Network connect       | —                 | `setsebool -P httpd_can_network_connect 1` |

## 14. Reverse Proxy
| Дія          | Debian/Ubuntu              | RHEL-family              |
| ------------ | -------------------------- | ------------------------ |
| Proxy module | `a2enmod proxy`            | зазвичай уже є           |
| HTTP proxy   | `a2enmod proxy_http`       | зазвичай уже є           |
| Reload       | `systemctl reload apache2` | `systemctl reload httpd` |

## 15. Compression та Cache
| Дія       | Debian/Ubuntu     | RHEL-family  |
| --------- | ----------------- | ------------ |
| gzip      | `a2enmod deflate` | модуль уже є |
| cache     | `a2enmod expires` | модуль уже є |
| Перевірка | `apachectl -M`    | `httpd -M`   |


## 16. Корисні команди діагностики
| Дія                | Debian/Ubuntu                        | RHEL-family             |
| ------------------ | ------------------------------------ | ----------------------- |
| Перевірка портів   | `ss -tulpn`                          | `ss -tulpn`             |
| Хто займає 80 порт | `ss -tulpn \| grep :80`              | `ss -tulpn \| grep :80` |
| Перевірка HTTP     | `curl -I localhost`                  | `curl -I localhost`     |
| Перевірка HTTPS    | `openssl s_client -connect host:443` | те саме                 |

## 17. Найважливіші відмінності
| Debian/Ubuntu                                     | RHEL-family                   |
| ------------------------------------------------- | ----------------------------- |
| Дуже багато helper-утиліт (`a2enmod`, `a2ensite`) | Майже все через ручні `.conf` |
| Структура modular                                 | Простіша структура            |
| AppArmor                                          | SELinux                       |
| Сервіс `apache2`                                  | Сервіс `httpd`                |
| Логи `/var/log/apache2/`                          | Логи `/var/log/httpd/`        |
| Конфіги сайтів через symlink                      | Конфіги напряму в `conf.d/`   |
