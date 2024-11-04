/*
  Warnings:

  - Added the required column `city` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NOT NULL,
    ADD COLUMN `secondName` VARCHAR(191) NULL;
