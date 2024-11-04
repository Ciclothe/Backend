/*
  Warnings:

  - You are about to drop the column `locarion` on the `publications` table. All the data in the column will be lost.
  - Added the required column `location` to the `Publications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `publications` DROP COLUMN `locarion`,
    ADD COLUMN `location` VARCHAR(191) NOT NULL;
