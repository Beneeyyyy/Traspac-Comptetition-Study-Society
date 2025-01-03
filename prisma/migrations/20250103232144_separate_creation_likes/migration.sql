/*
  Warnings:

  - You are about to drop the column `commentId` on the `CreationLike` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,creationId]` on the table `CreationLike` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CreationLike" DROP CONSTRAINT "CreationLike_commentId_fkey";

-- DropIndex
DROP INDEX "CreationLike_userId_creationId_commentId_key";

-- AlterTable
ALTER TABLE "CreationLike" DROP COLUMN "commentId";

-- CreateTable
CREATE TABLE "CreationCommentLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreationCommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreationCommentLike_userId_commentId_key" ON "CreationCommentLike"("userId", "commentId");

-- CreateIndex
CREATE UNIQUE INDEX "CreationLike_userId_creationId_key" ON "CreationLike"("userId", "creationId");

-- AddForeignKey
ALTER TABLE "CreationCommentLike" ADD CONSTRAINT "CreationCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreationCommentLike" ADD CONSTRAINT "CreationCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "CreationComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
