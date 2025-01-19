/*
  Warnings:

  - The `role` column on the `SquadMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');

-- DropForeignKey
ALTER TABLE "SquadDiscussionReply" DROP CONSTRAINT "SquadDiscussionReply_parentId_fkey";

-- DropForeignKey
ALTER TABLE "SquadMember" DROP CONSTRAINT "SquadMember_userId_fkey";

-- DropIndex
DROP INDEX "SquadDiscussion_squadId_idx";

-- DropIndex
DROP INDEX "SquadDiscussion_userId_idx";

-- DropIndex
DROP INDEX "SquadDiscussionReply_discussionId_idx";

-- DropIndex
DROP INDEX "SquadDiscussionReply_parentId_idx";

-- DropIndex
DROP INDEX "SquadDiscussionReply_userId_idx";

-- DropIndex
DROP INDEX "SquadMember_userId_idx";

-- AlterTable
ALTER TABLE "Squad" ADD COLUMN IF NOT EXISTS "about" TEXT,
ADD COLUMN IF NOT EXISTS "rules" TEXT[],
ADD COLUMN IF NOT EXISTS "settings" JSONB,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "memberCount" SET DEFAULT 1;

-- AlterTable
ALTER TABLE "SquadMember" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create temporary column
ALTER TABLE "SquadMember" ADD COLUMN "temp_role" "Role";

-- Convert existing role values to enum
UPDATE "SquadMember" 
SET temp_role = CASE 
    WHEN role = 'admin' THEN 'ADMIN'::"Role"
    WHEN role = 'moderator' THEN 'MODERATOR'::"Role"
    ELSE 'MEMBER'::"Role"
END;

-- Drop old role column and rename temp_role
ALTER TABLE "SquadMember" DROP COLUMN "role";
ALTER TABLE "SquadMember" RENAME COLUMN "temp_role" TO "role";
ALTER TABLE "SquadMember" ALTER COLUMN "role" SET NOT NULL;
ALTER TABLE "SquadMember" ALTER COLUMN "role" SET DEFAULT 'MEMBER'::"Role";

-- AddForeignKey
ALTER TABLE "SquadMember" ADD CONSTRAINT "SquadMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadDiscussionReply" ADD CONSTRAINT "SquadDiscussionReply_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SquadDiscussionReply"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
