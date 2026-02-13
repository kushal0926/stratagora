#!/bin/bash

set -euo pipefail

COMPOSE_FILES=(-f docker-compose.yaml)
if [[ "${1:-}" == "--dev" ]]; then
  COMPOSE_FILES+=(-f docker-compose.dev.yaml)
fi

echo "stopping stratagora..."
docker compose "${COMPOSE_FILES[@]}" down
echo "stopped."
