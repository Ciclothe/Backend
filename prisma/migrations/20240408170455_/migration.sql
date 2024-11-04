/*
  Warnings:

  - You are about to alter the column `token` on the `resetpassword` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `resetpassword` MODIFY `token` INTEGER NOT NULL;
