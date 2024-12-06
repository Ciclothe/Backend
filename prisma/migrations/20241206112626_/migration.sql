/*
  Warnings:

  - Made the column `content` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `notifications` MODIFY `content` VARCHAR(191) NOT NULL;
