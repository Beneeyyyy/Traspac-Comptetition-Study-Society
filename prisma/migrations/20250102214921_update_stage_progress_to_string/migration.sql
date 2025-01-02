-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropIndex
DROP INDEX "Reply_parentId_idx";

-- AlterTable
ALTER TABLE "MaterialProgress" ADD COLUMN     "activeStage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "completedStages" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
ADD COLUMN     "stageProgress" TEXT NOT NULL DEFAULT '{}';

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");
