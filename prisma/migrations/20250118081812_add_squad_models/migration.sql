-- DropForeignKey
ALTER TABLE "SquadDiscussion" DROP CONSTRAINT "SquadDiscussion_squadId_fkey";

-- DropForeignKey
ALTER TABLE "SquadDiscussionReply" DROP CONSTRAINT "SquadDiscussionReply_discussionId_fkey";

-- DropForeignKey
ALTER TABLE "SquadMember" DROP CONSTRAINT "SquadMember_squadId_fkey";

-- AddForeignKey
ALTER TABLE "SquadMember" ADD CONSTRAINT "SquadMember_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadDiscussion" ADD CONSTRAINT "SquadDiscussion_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadDiscussionReply" ADD CONSTRAINT "SquadDiscussionReply_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "SquadDiscussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
