# 🎯 Stratagora - Chess Analysis & AI Coach

AI-powered chess analysis platform with Stockfish engine and Claude AI coaching.

## 🚀 Features

- ✅ **No signup required** - Analyze games instantly
- ♟️ **Upload PGN files** - Analyze any chess game
- 🌐 **Import from Chess.com/Lichess** - Connect your account
- 🧠 **Stockfish Analysis** - Engine evaluation and move classification
- 🤖 **AI Chess Coach** - Chat with Claude AI about your games
- 📊 **Performance Tracking** - Monitor improvement over time

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + Shadcn UI
- Better Auth
- Prisma ORM

**Backend:**
- Go 1.23 with Chi router
- Stockfish engine
- Claude AI API
- Chess.com API

**Database:**
- PostgreSQL 17 (Neon)

**Infrastructure:**
- Docker & Docker Compose

## 📦 Quick Start (Docker)

### Prerequisites
- Docker & Docker Compose
- Neon PostgreSQL account
- (Optional) Anthropic API key for AI features

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/stratagora.git
cd stratagora
```

### 2. Configure environment
```bash
# Copy example env file
cp .env.docker.example .env.docker

# Edit with your values
nano .env.docker
```

**Required variables:**
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Generate with: `openssl rand -base64 32`

### 3. Start with Docker
```bash
# Start all services
./docker-start.sh

# Or manually:
docker compose -f docker-compose.yaml up -d

# Start dev mode (hot-reload)
./docker-start.sh --dev
# equivalent:
docker compose -f docker-compose.yaml -f docker-compose.dev.yaml up -d --build
```

`--dev` enables live preview for frontend edits in Docker (`web/src/**` changes reload at http://localhost:3000).

### 4. Access the application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **Health Check:** http://localhost:8080/health

### 5. Stop services
```bash
# Stop all services
./docker-stop.sh

# Or manually:
docker compose -f docker-compose.yaml down
```

## 💻 Development Setup (Without Docker)

### Prerequisites
- Node.js 20+
- Go 1.23+
- PostgreSQL 17 (or Neon account)

### Frontend Setup
```bash
cd web

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Run Prisma migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

### Backend Setup
```bash
cd backend

# Install dependencies
go mod download

# Set up environment
cp .env.example .env
# Edit .env with your values

# Run server
go run cmd/api/main.go
```

## 📁 Project Structure
```
stratagora/
├── web/                    # Next.js frontend
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities
│   │   └── prisma/        # Database schema
│   └── Dockerfile
│
├── backend/               # Go backend
│   ├── cmd/api/          # Main application
│   ├── internal/         # Internal packages
│   │   ├── handlers/    # HTTP handlers
│   │   ├── middleware/  # Middleware
│   │   └── services/    # Business logic
│   ├── pkg/             # Public packages
│   └── Dockerfile
│
├── docker-compose.yaml   # Docker orchestration
└── README.md
```

## 🗓️ Development Roadmap

- [x] **Week 1:** Foundation (Auth, Database, Backend)
- [ ] **Week 2:** Chess Functionality (Upload, Display, Chess.com)
- [ ] **Week 3:** Stockfish Analysis Engine
- [ ] **Week 4:** Claude AI Integration & Polish

## 📊 API Endpoints

### Health
- `GET /health` - Service health check
- `GET /ping` - Simple ping/pong

### Chess Analysis (Coming Soon)
- `POST /api/chess/analyze` - Analyze full game
- `POST /api/chess/evaluate` - Evaluate position

### Chess.com Integration (Coming Soon)
- `POST /api/chesscom/games` - Fetch user games

### Claude AI (Coming Soon)
- `POST /api/claude/chat` - Chat with AI coach

## 🐳 Docker Commands
```bash
# Build images
docker compose -f docker-compose.yaml build

# Start services
docker compose -f docker-compose.yaml up -d

# View logs
docker compose -f docker-compose.yaml logs -f

# Stop services
docker compose -f docker-compose.yaml down

# Rebuild and restart
docker compose -f docker-compose.yaml up -d --build

# Remove volumes (⚠️ deletes data)
docker compose -f docker-compose.yaml down -v
```

## 🧪 Testing
```bash
# Test Go backend
curl http://localhost:8080/health

# Test Next.js frontend
curl http://localhost:3000

# View backend logs
docker compose -f docker-compose.yaml logs backend

# View frontend logs
docker compose -f docker-compose.yaml logs frontend
```

## 🔧 Troubleshooting

### Frontend won't start
```bash
# Check logs
docker compose -f docker-compose.yaml logs frontend

# Rebuild
docker compose -f docker-compose.yaml up -d --build frontend
```

### Backend connection issues
```bash
# Check if backend is running
docker compose -f docker-compose.yaml ps

# Test backend directly
curl http://localhost:8080/health
```

### Database connection errors
- Verify `DATABASE_URL` in `.env.docker`
- Check Neon dashboard is accessible
- Ensure SSL mode is `verify-full`

## 📝 Environment Variables

### Frontend (web/.env.local)
```env
DATABASE_URL=              # Neon PostgreSQL
BETTER_AUTH_SECRET=        # Random 32+ char string
NEXT_PUBLIC_GO_API_URL=    # Backend URL
```

### Backend (backend/.env)
```env
PORT=8080                  # Server port
ANTHROPIC_API_KEY=         # Claude AI (optional)
```

## 🤝 Contributing

This is a personal project, but feedback and suggestions are welcome!

## 📄 License

MIT License - feel free to use for your own projects

## 🙏 Acknowledgments

- Stockfish chess engine
- Anthropic's Claude AI
- Chess.com & Lichess APIs
- Neon PostgreSQL

---

**Built with ❤️ for chess enthusiasts**

Questions? Open an issue or reach out!
