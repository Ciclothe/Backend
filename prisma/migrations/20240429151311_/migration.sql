/*
  Warnings:

  - You are about to drop the column `frontConditionId` on the `frontcategories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `frontcategories` DROP FOREIGN KEY `FrontCategories_frontConditionId_fkey`;

-- AlterTable
ALTER TABLE `frontcategories` DROP COLUMN `frontConditionId`;
