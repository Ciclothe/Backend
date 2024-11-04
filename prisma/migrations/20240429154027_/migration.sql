/*
  Warnings:

  - You are about to alter the column `type` on the `frontcategories` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[id]` on the table `FrontCategories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `FrontProductType` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `frontcategories` DROP FOREIGN KEY `FrontCategories_type_fkey`;

-- DropIndex
DROP INDEX `FrontProductType_type_key` ON `frontproducttype`;

-- AlterTable
ALTER TABLE `frontcategories` MODIFY `type` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `FrontCategories_id_key` ON `FrontCategories`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `FrontProductType_id_key` ON `FrontProductType`(`id`);

-- AddForeignKey
ALTER TABLE `FrontCategories` ADD CONSTRAINT `FrontCategories_type_fkey` FOREIGN KEY (`type`) REFERENCES `FrontProductType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
