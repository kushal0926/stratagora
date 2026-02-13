-- CreateTable
CREATE TABLE "game" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pgn" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'upload',
    "white" TEXT NOT NULL,
    "black" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "event" TEXT,
    "site" TEXT,
    "date" TEXT,
    "round" TEXT,
    "white_elo" TEXT,
    "black_elo" TEXT,
    "opening" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "game_userId_created_at_idx" ON "game"("userId", "created_at");

-- AddForeignKey
ALTER TABLE "game" ADD CONSTRAINT "game_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
