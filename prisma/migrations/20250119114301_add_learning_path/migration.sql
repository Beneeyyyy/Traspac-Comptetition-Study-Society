-- CreateTable
CREATE TABLE "LearningPath" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "squadId" INTEGER NOT NULL,
    "order" JSONB,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LearningPathToMaterial" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LearningPathToMaterial_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "LearningPath_squadId_idx" ON "LearningPath"("squadId");

-- CreateIndex
CREATE INDEX "LearningPath_createdById_idx" ON "LearningPath"("createdById");

-- CreateIndex
CREATE INDEX "_LearningPathToMaterial_B_index" ON "_LearningPathToMaterial"("B");

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_squadId_fkey" FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningPathToMaterial" ADD CONSTRAINT "_LearningPathToMaterial_A_fkey" FOREIGN KEY ("A") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LearningPathToMaterial" ADD CONSTRAINT "_LearningPathToMaterial_B_fkey" FOREIGN KEY ("B") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
