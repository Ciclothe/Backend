-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `accountCreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `profilePhoto` VARCHAR(191) NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Publications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdById` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `locarion` VARCHAR(191) NOT NULL,
    `images` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NULL,
    `usage_time` VARCHAR(191) NULL,
    `primary_color` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `brand` VARCHAR(191) NULL,
    `clothing_condition` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `commentedById` INTEGER NOT NULL,
    `publicatedAtId` INTEGER NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `publicatedTime` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `publicationId` INTEGER NOT NULL,
    `reactionTome` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `publicationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Publications` ADD CONSTRAINT `Publications_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_commentedById_fkey` FOREIGN KEY (`commentedById`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comments` ADD CONSTRAINT `Comments_publicatedAtId_fkey` FOREIGN KEY (`publicatedAtId`) REFERENCES `Publications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reactions` ADD CONSTRAINT `Reactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reactions` ADD CONSTRAINT `Reactions_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tags` ADD CONSTRAINT `Tags_publicationId_fkey` FOREIGN KEY (`publicationId`) REFERENCES `Publications`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
