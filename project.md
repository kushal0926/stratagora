stratagory/
├── .env
├── docker-compose.yml
│
├── frontend/                    # Next.js (handles DB via Prisma)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/           # Better Auth routes
│   │   │   ├── games/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/route.ts
│   │   │   ├── analyze/
│   │   │   │   └── route.ts
│   │   │   └── chat/
│   │   │       └── route.ts
│   │   ├── (dashboard)/
│   │   │   ├── games/
│   │   │   ├── analyze/
│   │   │   └── chat/
│   │   └── layout.tsx
│   ├── components/
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth.ts             # Better Auth config
│   │   ├── go-service.ts       # Go microservice client
│   │   └── chess.ts            # Chess.js utilities
│   ├── actions/                # Server Actions
│   │   ├── games.ts
│   │   ├── analyze.ts
│   │   └── chat.ts
│   └── store/
│       └── gameStore.ts
│
└── backend/                     # Go Microservice
    ├── cmd/
    │   └── api/
    │       └── main.go
    ├── internal/
    │   ├── handlers/
    │   │   ├── analyze.go      # POST /analyze
    │   │   ├── stockfish.go    # POST /stockfish/evaluate
    │   │   └── claude.go       # POST /claude/chat
    │   ├── services/
    │   │   ├── stockfish_service.go
    │   │   ├── claude_service.go
    │   │   └── chesscom_service.go
    │   └── middleware/
    │       └── cors.go
    └── Dockerfile