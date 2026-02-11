#!/bin/bash

echo "🐳 Starting Stratagora with Docker..."

# Load environment variables
export $(cat .env.docker | xargs)

# Build and start
docker-compose build
docker-compose up -d

echo ""
echo "✅ Stratagora is running!"
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:8080"