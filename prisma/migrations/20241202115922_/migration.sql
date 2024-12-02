/*
  Warnings:

  - You are about to drop the `savepublication` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `savepublication` DROP FOREIGN KEY `SavePublication_publicationId_fkey`;

-- DropForeignKey
ALTER TABLE `savepublication` DROP FOREIGN KEY `SavePublication_userId_fkey`;

-- DropTable
DROP TABLE `savepublication`;

-- CreateTable
CREATE TABLE `SavedPublications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `savedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `publicationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SavedPublications` ADD CONSTRAINT `SavedPublications_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedPublications` ADD CONSTRAINT `SavedPublications_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
