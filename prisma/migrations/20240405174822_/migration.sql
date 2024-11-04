/*
  Warnings:

  - You are about to drop the `_categoriestopublications` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Categories` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `_categoriestopublications` DROP FOREIGN KEY `_CategoriesToPublications_A_fkey`;

-- DropForeignKey
ALTER TABLE `_categoriestopublications` DROP FOREIGN KEY `_CategoriesToPublications_B_fkey`;

-- AlterTable
ALTER TABLE `publications` ADD COLUMN `categoryId` INTEGER NULL;

-- DropTable
DROP TABLE `_categoriestopublications`;

-- CreateIndex
CREATE UNIQUE INDEX `Categories_name_key` ON `Categories`(`name`);

-- AddForeignKey
ALTER TABLE `Publications` ADD CONSTRAINT `Publications_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
