# PRO-IT Arcade Platform

Първа работеща версия на собствена mobile-first аркадна платформа.

## Технологии

- React + Vite
- Phaser 3
- Fastify API
- PostgreSQL
- Redis
- Docker Compose
- Nginx

## Функции във версия 1

- Модерен mobile-first портал
- Псевдоним без регистрация
- Snake, реализирана с Phaser
- Изпращане на резултат към API
- Обща класация в PostgreSQL
- Redis кеш на класацията
- Health endpoint

## Инсталация

```bash
git clone https://github.com/Petar83/proit-arcade.git
cd proit-arcade
cp .env.example .env
nano .env
chmod +x deploy.sh update.sh
./deploy.sh
```

Локален адрес по подразбиране:

```text
http://IP-НА-LXC:8088
```

Nginx Proxy Manager:

- Domain: arcade.pro-it.bg
- Scheme: http
- Forward IP: IP на LXC
- Forward port: 8088
- SSL: Let's Encrypt
- Force SSL: включено

## Обновяване

```bash
cd /opt/proit-arcade
./update.sh
```
