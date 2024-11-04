/*
  Warnings:

  - You are about to drop the column `categoryId` on the `publications` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `Publications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `publications` DROP FOREIGN KEY `Publications_categoryId_fkey`;

-- AlterTable
ALTER TABLE `publications` DROP COLUMN `categoryId`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `categories`;
