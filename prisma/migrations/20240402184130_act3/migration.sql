/*
  Warnings:

  - You are about to drop the column `publicationId` on the `tags` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `tags` DROP FOREIGN KEY `Tags_publicationId_fkey`;

-- AlterTable
ALTER TABLE `tags` DROP COLUMN `publicationId`;

-- CreateTable
CREATE TABLE `_PublicationsToTags` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PublicationsToTags_AB_unique`(`A`, `B`),
    INDEX `_PublicationsToTags_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_PublicationsToTags` ADD CONSTRAINT `_PublicationsToTags_A_fkey` FOREIGN KEY (`A`) REFERENCES `Publications`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PublicationsToTags` ADD CONSTRAINT `_PublicationsToTags_B_fkey` FOREIGN KEY (`B`) REFERENCES `Tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
