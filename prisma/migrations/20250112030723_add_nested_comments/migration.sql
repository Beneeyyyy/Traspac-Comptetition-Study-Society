-- AlterTable
ALTER TABLE "ForumComment" ADD COLUMN     "parentId" INTEGER;

-- CreateTable
CREATE TABLE "ForumCommentVote" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "commentId" INTEGER NOT NULL,
    "isUpvote" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ForumCommentVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ForumCommentVote_userId_idx" ON "ForumCommentVote"("userId");

-- CreateIndex
CREATE INDEX "ForumCommentVote_commentId_idx" ON "ForumCommentVote"("commentId");

-- CreateIndex
CREATE UNIQUE INDEX "ForumCommentVote_userId_commentId_key" ON "ForumCommentVote"("userId", "commentId");

-- CreateIndex
CREATE INDEX "ForumComment_userId_idx" ON "ForumComment"("userId");

-- CreateIndex
CREATE INDEX "ForumComment_postId_idx" ON "ForumComment"("postId");

-- CreateIndex
CREATE INDEX "ForumComment_answerId_idx" ON "ForumComment"("answerId");

-- CreateIndex
CREATE INDEX "ForumComment_parentId_idx" ON "ForumComment"("parentId");

-- AddForeignKey
ALTER TABLE "ForumComment" ADD CONSTRAINT "ForumComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ForumComment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumCommentVote" ADD CONSTRAINT "ForumCommentVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ForumCommentVote" ADD CONSTRAINT "ForumCommentVote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "ForumComment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
