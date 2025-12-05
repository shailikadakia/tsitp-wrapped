/*
  Warnings:

  - The `artist` column on the `Track` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Track" DROP COLUMN "artist",
ADD COLUMN     "artist" TEXT[];
