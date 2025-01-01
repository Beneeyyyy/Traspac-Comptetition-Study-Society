/*
  Warnings:

  - You are about to drop the column `title` on the `Discussion` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Discussion_isResolved_idx";

-- DropIndex
DROP INDEX "Discussion_userId_materialId_idx";

-- DropIndex
DROP INDEX "Reply_userId_discussionId_idx";

-- AlterTable
ALTER TABLE "Discussion" DROP COLUMN "title";

-- CreateIndex
CREATE INDEX "Discussion_userId_idx" ON "Discussion"("userId");

-- CreateIndex
CREATE INDEX "Discussion_materialId_idx" ON "Discussion"("materialId");

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE INDEX "Like_discussionId_idx" ON "Like"("discussionId");

-- CreateIndex
CREATE INDEX "Like_replyId_idx" ON "Like"("replyId");

-- CreateIndex
CREATE INDEX "Reply_userId_idx" ON "Reply"("userId");

-- CreateIndex
CREATE INDEX "Reply_discussionId_idx" ON "Reply"("discussionId");
