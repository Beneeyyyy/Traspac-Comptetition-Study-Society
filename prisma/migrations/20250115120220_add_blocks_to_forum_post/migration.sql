-- AlterTable
ALTER TABLE "ForumPost" ADD COLUMN     "blocks" JSONB;

-- CreateIndex
CREATE INDEX "ForumPost_userId_idx" ON "ForumPost"("userId");
