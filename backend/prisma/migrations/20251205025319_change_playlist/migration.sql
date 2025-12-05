/*
  Warnings:

  - You are about to drop the column `subtype` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Playlist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "subtype",
DROP COLUMN "type";
