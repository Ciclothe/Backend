-- AlterTable
ALTER TABLE `notifications` ADD COLUMN `relatedPostId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_relatedPostId_fkey` FOREIGN KEY (`relatedPostId`) REFERENCES `Publications`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
