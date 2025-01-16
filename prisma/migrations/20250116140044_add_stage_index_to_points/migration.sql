/*
  Warnings:

  - A unique constraint covering the columns `[userId,materialId,stageIndex]` on the table `Point` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stageIndex` to the `Point` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Point` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Point" ADD COLUMN     "stageIndex" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Point_userId_materialId_stageIndex_key" ON "Point"("userId", "materialId", "stageIndex");
