-- AlterTable
ALTER TABLE "ForumComment" ADD COLUMN     "downvotes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "upvotes" INTEGER NOT NULL DEFAULT 0;
