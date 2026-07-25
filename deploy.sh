#!/usr/bin/env sh
set -eu

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker не е инсталиран."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose plugin не е наличен."
  exit 1
fi

if [ ! -f .env ]; then
  cp .env.example .env
fi

docker compose up -d --build
docker compose ps

echo
echo "PRO-IT Arcade е стартиран."
echo "Локален адрес: http://IP-НА-LXC:$(grep '^ARCADE_PORT=' .env | cut -d= -f2)"
