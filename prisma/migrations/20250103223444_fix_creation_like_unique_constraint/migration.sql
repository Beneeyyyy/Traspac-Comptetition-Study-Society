/*
  Warnings:

  - A unique constraint covering the columns `[userId,creationId,commentId]` on the table `CreationLike` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CreationLike_userId_commentId_key";

-- DropIndex
DROP INDEX "CreationLike_userId_creationId_key";

-- CreateIndex
CREATE UNIQUE INDEX "CreationLike_userId_creationId_commentId_key" ON "CreationLike"("userId", "creationId", "commentId");
