#!/bin/bash

set -euo pipefail

COMPOSE_FILES=(-f docker-compose.yaml)
if [[ "${1:-}" == "--dev" ]]; then
  COMPOSE_FILES+=(-f docker-compose.dev.yaml)
fi

echo "Starting Stratagora with Docker..."
docker compose "${COMPOSE_FILES[@]}" up -d --build