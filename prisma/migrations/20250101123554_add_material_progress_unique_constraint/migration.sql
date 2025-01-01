/*
  Warnings:

  - A unique constraint covering the columns `[userId,materialId]` on the table `MaterialProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MaterialProgress_userId_materialId_key" ON "MaterialProgress"("userId", "materialId");
