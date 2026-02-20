/*
  Warnings:

  - A unique constraint covering the columns `[chesscom_url]` on the table `game` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "game" ADD COLUMN     "chesscom_url" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "game_chesscom_url_key" ON "game"("chesscom_url");

-- CreateIndex
CREATE INDEX "game_chesscom_url_idx" ON "game"("chesscom_url");
