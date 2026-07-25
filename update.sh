#!/usr/bin/env sh
set -eu

git pull --ff-only
docker compose up -d --build
docker image prune -f

echo "Порталът е обновен."
