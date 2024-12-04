/*
  Warnings:

  - You are about to drop the column `liked` on the `likes` table. All the data in the column will be lost.
  - You are about to drop the column `totalLikes` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `likes` DROP COLUMN `liked`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `totalLikes`;
