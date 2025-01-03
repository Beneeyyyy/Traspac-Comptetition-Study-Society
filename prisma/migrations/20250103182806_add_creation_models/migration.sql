-- CreateTable
CREATE TABLE "Creation" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "author" TEXT NOT NULL,
    "tags" TEXT[],
    "image" TEXT,
    "fileUrl" TEXT,
    "userId" INTEGER NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'published',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Creation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreationComment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "creationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreationComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreationLike" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "creationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreationLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreationLike_userId_creationId_key" ON "CreationLike"("userId", "creationId");

-- AddForeignKey
ALTER TABLE "Creation" ADD CONSTRAINT "Creation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreationComment" ADD CONSTRAINT "CreationComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreationComment" ADD CONSTRAINT "CreationComment_creationId_fkey" FOREIGN KEY ("creationId") REFERENCES "Creation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreationLike" ADD CONSTRAINT "CreationLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreationLike" ADD CONSTRAINT "CreationLike_creationId_fkey" FOREIGN KEY ("creationId") REFERENCES "Creation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
