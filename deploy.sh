#!/usr/bin/env bash
set -Eeuo pipefail

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker липсва."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose plugin липсва."
  exit 1
fi

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo
  echo "Създаден е .env. Смени POSTGRES_PASSWORD и пусни ./deploy.sh отново."
  exit 1
fi

if grep -q "replace-with-a-long-random-password" .env; then
  echo "Промени POSTGRES_PASSWORD в .env."
  exit 1
fi

docker compose up -d --build
docker compose ps

echo
echo "PRO-IT Arcade е стартиран на http://IP-НА-LXC:$(grep '^ARCADE_PORT=' .env | cut -d= -f2)"
