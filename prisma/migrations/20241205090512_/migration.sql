-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `relatedEventId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_relatedEventId_fkey` FOREIGN KEY (`relatedEventId`) REFERENCES `Events`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
