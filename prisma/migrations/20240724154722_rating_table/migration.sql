-- CreateTable
CREATE TABLE `Rating` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rating` INTEGER NOT NULL,
    `qualifiedUserId` INTEGER NOT NULL,
    `ratedById` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_qualifiedUserId_fkey` FOREIGN KEY (`qualifiedUserId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_ratedById_fkey` FOREIGN KEY (`ratedById`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
