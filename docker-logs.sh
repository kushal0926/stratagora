#!/bin/bash

set -euo pipefail

COMPOSE_FILES=(-f docker-compose.yaml)
if [[ "${1:-}" == "--dev" ]]; then
  COMPOSE_FILES+=(-f docker-compose.dev.yaml)
fi

# Follow logs for all services
docker compose "${COMPOSE_FILES[@]}" logs -f
