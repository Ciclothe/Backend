-- CreateTable
CREATE TABLE `FrontGenre` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `genre` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FrontGenre_genre_key`(`genre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FrontCondition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `condition` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FrontProductType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `genre` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `FrontProductType_type_key`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FrontCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categories` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `genre` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `frontConditionId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `FrontProductType` ADD CONSTRAINT `FrontProductType_genre_fkey` FOREIGN KEY (`genre`) REFERENCES `FrontGenre`(`genre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FrontCategories` ADD CONSTRAINT `FrontCategories_type_fkey` FOREIGN KEY (`type`) REFERENCES `FrontProductType`(`type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FrontCategories` ADD CONSTRAINT `FrontCategories_genre_fkey` FOREIGN KEY (`genre`) REFERENCES `FrontGenre`(`genre`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FrontCategories` ADD CONSTRAINT `FrontCategories_frontConditionId_fkey` FOREIGN KEY (`frontConditionId`) REFERENCES `FrontCondition`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
