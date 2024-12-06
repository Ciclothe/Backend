-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `fromUserId` INTEGER NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'notification';

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_fromUserId_fkey` FOREIGN KEY (`fromUserId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
