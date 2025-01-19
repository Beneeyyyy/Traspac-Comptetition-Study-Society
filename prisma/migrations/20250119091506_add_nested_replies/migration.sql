-- AlterTable
ALTER TABLE "SquadDiscussionReply" ADD COLUMN     "parentId" INTEGER;

-- CreateIndex
CREATE INDEX "SquadDiscussionReply_parentId_idx" ON "SquadDiscussionReply"("parentId");

-- AddForeignKey
ALTER TABLE "SquadDiscussionReply" ADD CONSTRAINT "SquadDiscussionReply_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SquadDiscussionReply"("id") ON DELETE CASCADE ON UPDATE CASCADE;
