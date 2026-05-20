# Конфігураційні файли Apache (RHEL)

## 1. `/etc/httpd/conf/httpd.conf` — основний конфігураційний файл Apache (RHEL)
Загальна інформація

У RHEL-family головний конфіг:
```bash
/etc/httpd/conf/httpd.conf
```
Через нього:

- задаються глобальні параметри;
- підключаються модулі;
- визначаються директорії;
- налаштовуються логи;
- задаються MPM;
- підключаються додаткові `.conf`.

### 1.1 Глобальні параметри сервера
| Параметр               | Опис                               | Варіанти значень  | Значення за замовчуванням | Приклад                         |
| ---------------------- | ---------------------------------- | ----------------- | ------------------------- | ------------------------------- |
| `ServerRoot`           | Коренева директорія Apache         | шлях              | `/etc/httpd`              | `ServerRoot "/etc/httpd"`       |
| `PidFile`              | Файл PID процесу                   | шлях              | `run/httpd.pid`           | `PidFile "/run/httpd.pid"`      |
| `Timeout`              | Таймаут запиту                     | секунди           | `60`                      | `Timeout 60`                    |
| `KeepAlive`            | Повторне використання TCP-з’єднань | `On/Off`          | `On`                      | `KeepAlive On`                  |
| `MaxKeepAliveRequests` | Максимум запитів в KeepAlive       | число             | `100`                     | `MaxKeepAliveRequests 100`      |
| `KeepAliveTimeout`     | Таймаут KeepAlive                  | секунди           | `5`                       | `KeepAliveTimeout 5`            |
| `Listen`               | Порт/IP прослуховування            | `port`, `ip:port` | `80`                      | `Listen 443`                    |
| `ServerName`           | Ім’я сервера                       | hostname          | немає                     | `ServerName example.com`        |
| `ServerAdmin`          | Email адміністратора               | email             | немає                     | `ServerAdmin admin@example.com` |
| `UseCanonicalName`     | Використання canonical hostname    | `On/Off/DNS`      | `Off`                     | `UseCanonicalName Off`          |

### 1.2 Параметри процесів та MPM
| Параметр                 | Опис                                | Значення | Default       | Приклад                       |
| ------------------------ | ----------------------------------- | -------- | ------------- | ----------------------------- |
| `StartServers`           | Початкова кількість процесів        | число    | MPM-dependent | `StartServers 5`              |
| `MinSpareServers`        | Мінімум idle processes              | число    | `5`           | `MinSpareServers 5`           |
| `MaxSpareServers`        | Максимум idle processes             | число    | `10`          | `MaxSpareServers 10`          |
| `ServerLimit`            | Максимум процесів                   | число    | `256`         | `ServerLimit 256`             |
| `MaxRequestWorkers`      | Максимум одночасних запитів         | число    | `256`         | `MaxRequestWorkers 256`       |
| `ThreadsPerChild`        | Потоків на процес                   | число    | `25`          | `ThreadsPerChild 25`          |
| `ThreadLimit`            | Максимум потоків                    | число    | `64`          | `ThreadLimit 64`              |
| `MaxConnectionsPerChild` | Перезапуск процесу після N requests | число    | `0`           | `MaxConnectionsPerChild 1000` |

### 1.3 Логи
| Параметр    | Опис              | Варіанти                    | Default          | Приклад                                 |
| ----------- | ----------------- | --------------------------- | ---------------- | --------------------------------------- |
| `ErrorLog`  | Файл помилок      | шлях                        | `logs/error_log` | `ErrorLog "/var/log/httpd/error_log"`   |
| `LogLevel`  | Рівень логування  | `debug/info/warn/error/...` | `warn`           | `LogLevel warn`                         |
| `LogFormat` | Формат access log | шаблон                      | common           | `LogFormat "%h %l %u %t \"%r\" %>s %b"` |
| `CustomLog` | Access log        | шлях + формат               | немає            | `CustomLog logs/access_log combined`    |

### 1.4 MIME та контент
| Параметр      | Опис                  | Варіанти         | Default           | Приклад                          |
| ------------- | --------------------- | ---------------- | ----------------- | -------------------------------- |
| `TypesConfig` | MIME database         | шлях             | `/etc/mime.types` | `TypesConfig /etc/mime.types`    |
| `DefaultType` | MIME за замовчуванням | MIME type        | none              | `DefaultType text/plain`         |
| `AddType`     | Додати MIME тип       | MIME + extension | —                 | `AddType application/json .json` |
| `AddEncoding` | Додати encoding       | encoding         | —                 | `AddEncoding gzip .gz`           |
| `AddCharset`  | Charset               | charset          | —                 | `AddCharset UTF-8 .utf8`         |

### 1.5 Безпека
| Параметр          | Опис                  | Значення            | Default      | Приклад               |
| ----------------- | --------------------- | ------------------- | ------------ | --------------------- |
| `ServerTokens`    | Інформація про Apache | `Full/Prod/Minimal` | `Full`       | `ServerTokens Prod`   |
| `ServerSignature` | Підпис на error pages | `On/Off`            | `On`         | `ServerSignature Off` |
| `TraceEnable`     | TRACE метод           | `On/Off`            | `On`         | `TraceEnable Off`     |
| `FileETag`        | ETag generation       | `None/All/...`      | `MTime Size` | `FileETag None`       |

### 1.6 Директорії (`<Directory>`)
| Параметр         | Опис                 | Значення                             | Default      | Приклад                               |
| ---------------- | -------------------- | ------------------------------------ | ------------ | ------------------------------------- |
| `Options`        | Поведінка директорії | `Indexes FollowSymLinks ExecCGI ...` | varies       | `Options -Indexes`                    |
| `AllowOverride`  | Дозвіл `.htaccess`   | `None/All/AuthConfig/...`            | `None`       | `AllowOverride All`                   |
| `Require`        | Контроль доступу     | `all granted/ip/user`                | denied       | `Require all granted`                 |
| `DirectoryIndex` | Default index files  | список                               | `index.html` | `DirectoryIndex index.php index.html` |

### 1.7 Indexing
| Параметр          | Опис                 | Варіанти    | Default | Приклад                      |
| ----------------- | -------------------- | ----------- | ------- | ---------------------------- |
| `Options Indexes` | Directory listing    | `On/Off`    | Off     | `Options +Indexes`           |
| `IndexOptions`    | Налаштування listing | різні flags | —       | `IndexOptions FancyIndexing` |
| `HeaderName`      | Header file          | filename    | —       | `HeaderName HEADER.html`     |
| `ReadmeName`      | Footer file          | filename    | —       | `ReadmeName README.html`     |

### 1.8 CGI
| Параметр          | Опис                  | Значення    | Default | Приклад                                     |
| ----------------- | --------------------- | ----------- | ------- | ------------------------------------------- |
| `ScriptAlias`     | CGI path mapping      | URL + path  | none    | `ScriptAlias /cgi-bin/ "/var/www/cgi-bin/"` |
| `AddHandler`      | CGI extension handler | handler ext | none    | `AddHandler cgi-script .cgi`                |
| `Options ExecCGI` | Дозвіл CGI            | `On/Off`    | Off     | `Options +ExecCGI`                          |

### 1.9 Include директиви
| Параметр          | Опис              | Значення | Default | Приклад                                 |
| ----------------- | ----------------- | -------- | ------- | --------------------------------------- |
| `Include`         | Підключення файлу | шлях     | none    | `Include conf.d/*.conf`                 |
| `IncludeOptional` | Optional include  | шлях     | none    | `IncludeOptional conf.modules.d/*.conf` |

## 2. `/etc/httpd/conf.d/*.conf` — додаткові конфіги
Призначення

У RHEL-family:
```bash
/etc/httpd/conf.d/
```
Містить:

- VirtualHosts;
- SSL;
- proxy;
- php;
- custom configs.

### 2.1 VirtualHost параметри
| Параметр       | Опис             | Значення    | Default | Приклад                                   |
| -------------- | ---------------- | ----------- | ------- | ----------------------------------------- |
| `VirtualHost`  | Віртуальний хост | IP:PORT     | none    | `<VirtualHost *:80>`                      |
| `ServerName`   | Домен            | hostname    | none    | `ServerName example.com`                  |
| `ServerAlias`  | Додаткові домени | hostname    | none    | `ServerAlias www.example.com`             |
| `DocumentRoot` | Корінь сайту     | path        | none    | `DocumentRoot /var/www/site`              |
| `ErrorLog`     | Error log        | path        | global  | `ErrorLog logs/site_error.log`            |
| `CustomLog`    | Access log       | path format | global  | `CustomLog logs/site_access.log combined` |

### 2.2 Proxy параметри
| Параметр           | Опис                      | Варіанти | Default | Приклад                                     |
| ------------------ | ------------------------- | -------- | ------- | ------------------------------------------- |
| `ProxyPass`        | Forward proxy request     | url      | none    | `ProxyPass / http://127.0.0.1:3000/`        |
| `ProxyPassReverse` | Rewrite backend redirects | url      | none    | `ProxyPassReverse / http://127.0.0.1:3000/` |
| `ProxyRequests`    | Forward proxy mode        | `On/Off` | `Off`   | `ProxyRequests Off`                         |
| `ProxyTimeout`     | Proxy timeout             | seconds  | global  | `ProxyTimeout 60`                           |

### 2.3 Rewrite параметри
| Параметр        | Опис            | Значення   | Default | Приклад                            |
| --------------- | --------------- | ---------- | ------- | ---------------------------------- |
| `RewriteEngine` | Rewrite enable  | `On/Off`   | Off     | `RewriteEngine On`                 |
| `RewriteRule`   | Rewrite правило | regex      | none    | `RewriteRule ^old$ /new [R=301,L]` |
| `RewriteCond`   | Умова rewrite   | expression | none    | `RewriteCond %{HTTPS} off`         |

### 2.4 Headers
| Параметр            | Опис              | Значення     | Default | Приклад                                 |
| ------------------- | ----------------- | ------------ | ------- | --------------------------------------- |
| `Header set`        | Встановити header | header value | none    | `Header set X-Frame-Options SAMEORIGIN` |
| `Header unset`      | Видалити header   | header       | none    | `Header unset Server`                   |
| `RequestHeader set` | Request headers   | header value | none    | `RequestHeader set X-Test test`         |

## 3. `/etc/httpd/conf.d/ssl.conf` — SSL конфіг

| Параметр                  | Опис            | Значення      | Default | Приклад                                                 |
| ------------------------- | --------------- | ------------- | ------- | ------------------------------------------------------- |
| `SSLEngine`               | SSL enable      | `On/Off`      | Off     | `SSLEngine on`                                          |
| `SSLCertificateFile`      | Сертифікат      | path          | none    | `SSLCertificateFile /etc/pki/tls/certs/server.crt`      |
| `SSLCertificateKeyFile`   | Private key     | path          | none    | `SSLCertificateKeyFile /etc/pki/tls/private/server.key` |
| `SSLCertificateChainFile` | Chain cert      | path          | none    | `SSLCertificateChainFile chain.crt`                     |
| `SSLProtocol`             | TLS versions    | protocol list | varies  | `SSLProtocol -all +TLSv1.2 +TLSv1.3`                    |
| `SSLCipherSuite`          | Cipher list     | ciphers       | default | `SSLCipherSuite HIGH:!aNULL`                            |
| `SSLHonorCipherOrder`     | Cipher priority | `On/Off`      | Off     | `SSLHonorCipherOrder On`                                |
| `SSLCompression`          | SSL compression | `On/Off`      | Off     | `SSLCompression Off`                                    |
| `SSLSessionCache`         | Session cache   | cache type    | none    | `SSLSessionCache shmcb:/run/httpd/sslcache(512000)`     |

## 4. `/etc/httpd/conf.modules.d/*.conf` — модулі
LoadModule
| Параметр     | Опис                | Значення      | Приклад                                    |
| ------------ | ------------------- | ------------- | ------------------------------------------ |
| `LoadModule` | Завантаження модуля | module + file | `LoadModule ssl_module modules/mod_ssl.so` |

Типові модулі
| Модуль           | Призначення   |
| ---------------- | ------------- |
| `mod_ssl`        | HTTPS         |
| `mod_proxy`      | Reverse proxy |
| `mod_proxy_http` | HTTP proxy    |
| `mod_rewrite`    | URL rewrite   |
| `mod_headers`    | HTTP headers  |
| `mod_status`     | Server status |
| `mod_deflate`    | gzip          |
| `mod_expires`    | cache         |
| `mod_security`   | WAF           |
| `mod_auth_basic` | Basic auth    |

## 5. `.htaccess`

| Параметр         | Опис              | Приклад                             |
| ---------------- | ----------------- | ----------------------------------- |
| `RewriteEngine`  | Rewrite rules     | `RewriteEngine On`                  |
| `RewriteRule`    | Redirect/rewrite  | `RewriteRule ^old$ /new [R=301,L]`  |
| `AuthType`       | Тип auth          | `AuthType Basic`                    |
| `AuthName`       | Назва auth        | `AuthName "Restricted"`             |
| `AuthUserFile`   | Password file     | `AuthUserFile /etc/httpd/.htpasswd` |
| `Require`        | Access rules      | `Require valid-user`                |
| `Options`        | Directory options | `Options -Indexes`                  |
| `DirectoryIndex` | Default index     | `DirectoryIndex index.php`          |
| `ErrorDocument`  | Custom errors     | `ErrorDocument 404 /404.html`       |
