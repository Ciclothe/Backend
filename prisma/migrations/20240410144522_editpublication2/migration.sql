/*
  Warnings:

  - You are about to drop the column `clothing_condition` on the `publications` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `publications` table. All the data in the column will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `current_condition` to the `Publications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `Comments_commentedById_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `Comments_publicatedAtId_fkey`;

-- AlterTable
ALTER TABLE `publications` DROP COLUMN `clothing_condition`,
    DROP COLUMN `gender`,
    ADD COLUMN `current_condition` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `comments`;

-- CreateTable
CREATE TABLE `Categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CategoriesToPublications` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CategoriesToPublications_AB_unique`(`A`, `B`),
    INDEX `_CategoriesToPublications_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CategoriesToPublications` ADD CONSTRAINT `_CategoriesToPublications_A_fkey` FOREIGN KEY (`A`) REFERENCES `Categories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoriesToPublications` ADD CONSTRAINT `_CategoriesToPublications_B_fkey` FOREIGN KEY (`B`) REFERENCES `Publications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
