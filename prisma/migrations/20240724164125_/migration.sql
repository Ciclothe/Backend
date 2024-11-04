/*
  Warnings:

  - You are about to alter the column `qualification` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `qualification` DOUBLE NOT NULL DEFAULT 0;
