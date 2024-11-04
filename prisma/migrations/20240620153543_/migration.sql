/*
  Warnings:

  - Added the required column `offeredUserId` to the `Swap` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relatedUserId` to the `Swap` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `swap` ADD COLUMN `offeredUserId` INTEGER NOT NULL,
    ADD COLUMN `relatedUserId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Swap` ADD CONSTRAINT `Swap_relatedUserId_fkey` FOREIGN KEY (`relatedUserId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Swap` ADD CONSTRAINT `Swap_offeredUserId_fkey` FOREIGN KEY (`offeredUserId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
