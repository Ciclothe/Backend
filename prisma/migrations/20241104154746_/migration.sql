-- CreateTable
CREATE TABLE `Communities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `maxClothes` INTEGER NOT NULL,
    `Date` DATETIME(3) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `theme` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `maximumCapacity` INTEGER NOT NULL,
    `creatorId` INTEGER NOT NULL,

    UNIQUE INDEX `Communities_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_members` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_members_AB_unique`(`A`, `B`),
    INDEX `_members_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Communities` ADD CONSTRAINT `Communities_creatorId_fkey` FOREIGN KEY (`creatorId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_members` ADD CONSTRAINT `_members_A_fkey` FOREIGN KEY (`A`) REFERENCES `Communities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_members` ADD CONSTRAINT `_members_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
