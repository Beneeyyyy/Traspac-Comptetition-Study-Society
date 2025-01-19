-- AlterTable
ALTER TABLE "Squad" ALTER COLUMN "memberCount" SET DEFAULT 0;

-- CreateIndex
CREATE INDEX "SquadDiscussion_userId_idx" ON "SquadDiscussion"("userId");

-- CreateIndex
CREATE INDEX "SquadDiscussion_squadId_idx" ON "SquadDiscussion"("squadId");

-- CreateIndex
CREATE INDEX "SquadDiscussionReply_userId_idx" ON "SquadDiscussionReply"("userId");

-- CreateIndex
CREATE INDEX "SquadDiscussionReply_discussionId_idx" ON "SquadDiscussionReply"("discussionId");

-- CreateIndex
CREATE INDEX "SquadMember_userId_idx" ON "SquadMember"("userId");
