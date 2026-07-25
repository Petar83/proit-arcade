# PRO-IT Arcade

Mobile-first, self-hosted HTML5 arcade portal.

## Included games

- Space Attack
- Neon Breakout
- Road Hopper
- 2048
- Snake Pro

## Requirements

- Debian/Ubuntu LXC or VM
- Docker Engine
- Docker Compose plugin
- Nginx Proxy Manager or another reverse proxy

## Installation

```bash
git clone https://github.com/Petar83/proit-arcade.git
cd proit-arcade
cp .env.example .env
chmod +x deploy.sh update.sh
./deploy.sh
```

The default local port is `8088`.

## Nginx Proxy Manager

Configure the proxy host:

- Domain: `arcade.pro-it.bg`
- Scheme: `http`
- Forward hostname/IP: IP address of the LXC
- Forward port: `8088`
- Websockets: enabled
- SSL: Let's Encrypt + Force SSL

## Updating

```bash
cd proit-arcade
./update.sh
```
