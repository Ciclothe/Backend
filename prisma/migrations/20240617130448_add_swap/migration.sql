/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `Swap` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `relatedPostId` INTEGER NOT NULL,
    `offeredId` INTEGER NOT NULL,
    `dateTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Users_userName_key` ON `Users`(`userName`);

-- AddForeignKey
ALTER TABLE `Swap` ADD CONSTRAINT `Swap_relatedPostId_fkey` FOREIGN KEY (`relatedPostId`) REFERENCES `Publications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Swap` ADD CONSTRAINT `Swap_offeredId_fkey` FOREIGN KEY (`offeredId`) REFERENCES `Publications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
