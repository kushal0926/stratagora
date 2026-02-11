#!/bin/bash

# Follow logs for all services
docker-compose logs -f
EOF

chmod +x docker-logs.sh