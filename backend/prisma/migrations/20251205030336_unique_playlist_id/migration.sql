/*
  Warnings:

  - A unique constraint covering the columns `[spotifyPlaylistId]` on the table `Playlist` will be added. If there are existing duplicate values, this will fail.
  - Made the column `spotifyPlaylistId` on table `Playlist` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Playlist" ALTER COLUMN "spotifyPlaylistId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Playlist_spotifyPlaylistId_key" ON "Playlist"("spotifyPlaylistId");
