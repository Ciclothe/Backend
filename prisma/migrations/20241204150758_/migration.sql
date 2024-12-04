/*
  Warnings:

  - A unique constraint covering the columns `[userId,publicationId]` on the table `Likes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Likes_userId_publicationId_key` ON `Likes`(`userId`, `publicationId`);
