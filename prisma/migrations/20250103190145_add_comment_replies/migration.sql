/*
  Warnings:

  - A unique constraint covering the columns `[userId,commentId]` on the table `CreationLike` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "CreationComment" ADD COLUMN     "parentId" INTEGER;

-- AlterTable
ALTER TABLE "CreationLike" ADD COLUMN     "commentId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "CreationLike_userId_commentId_key" ON "CreationLike"("userId", "commentId");

-- AddForeignKey
ALTER TABLE "CreationComment" ADD CONSTRAINT "CreationComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CreationComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreationLike" ADD CONSTRAINT "CreationLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CreationComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
