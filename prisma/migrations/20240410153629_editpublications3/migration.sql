/*
  Warnings:

  - You are about to drop the column `images` on the `publications` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `publications` table. All the data in the column will be lost.
  - Added the required column `city` to the `Publications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Publications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `publications` DROP COLUMN `images`,
    DROP COLUMN `location`,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `country` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Image` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `publicationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
