-- CreateTable
CREATE TABLE `SearchHistorial` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `search` VARCHAR(191) NOT NULL,
    `searchedById` INTEGER NOT NULL,
    `searchedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SearchHistorial` ADD CONSTRAINT `SearchHistorial_searchedById_fkey` FOREIGN KEY (`searchedById`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

