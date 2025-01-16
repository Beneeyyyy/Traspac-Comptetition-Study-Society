-- DropForeignKey
ALTER TABLE "Point" DROP CONSTRAINT "Point_materialId_fkey";

-- AlterTable
ALTER TABLE "ForumAnswer" ADD COLUMN     "blocks" JSONB;

-- AlterTable
ALTER TABLE "Point" ALTER COLUMN "value" DROP DEFAULT;

-- CreateIndex
CREATE INDEX "ForumAnswer_userId_idx" ON "ForumAnswer"("userId");

-- CreateIndex
CREATE INDEX "ForumAnswer_postId_idx" ON "ForumAnswer"("postId");

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
