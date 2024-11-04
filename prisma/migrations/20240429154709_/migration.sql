/*
  Warnings:

  - You are about to drop the column `genre` on the `frontcategories` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `frontcategories` table. All the data in the column will be lost.
  - Added the required column `typeId` to the `FrontCategories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `frontcategories` DROP FOREIGN KEY `FrontCategories_genre_fkey`;

-- DropForeignKey
ALTER TABLE `frontcategories` DROP FOREIGN KEY `FrontCategories_type_fkey`;

-- AlterTable
ALTER TABLE `frontcategories` DROP COLUMN `genre`,
    DROP COLUMN `type`,
    ADD COLUMN `typeId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `FrontCategories` ADD CONSTRAINT `FrontCategories_typeId_fkey` FOREIGN KEY (`typeId`) REFERENCES `FrontProductType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
