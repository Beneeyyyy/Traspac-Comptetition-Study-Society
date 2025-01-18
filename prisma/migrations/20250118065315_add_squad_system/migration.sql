-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "squadId" INTEGER,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'regular',
ALTER COLUMN "subcategoryId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Squad" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "banner" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "memberCount" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Squad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquadMember" (
    "id" SERIAL NOT NULL,
    "squadId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SquadMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquadDiscussion" (
    "id" SERIAL NOT NULL,
    "squadId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SquadDiscussion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SquadDiscussionReply" (
    "id" SERIAL NOT NULL,
    "discussionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SquadDiscussionReply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SquadMember_squadId_userId_key" ON "SquadMember"("squadId", "userId");

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Material" ADD CONSTRAINT "Material_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadMember" ADD CONSTRAINT "SquadMember_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadMember" ADD CONSTRAINT "SquadMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadDiscussion" ADD CONSTRAINT "SquadDiscussion_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadDiscussion" ADD CONSTRAINT "SquadDiscussion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadDiscussionReply" ADD CONSTRAINT "SquadDiscussionReply_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "SquadDiscussion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SquadDiscussionReply" ADD CONSTRAINT "SquadDiscussionReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
