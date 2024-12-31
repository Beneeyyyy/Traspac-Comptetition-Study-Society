/*
  Warnings:

  - You are about to drop the column `content` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Material` table. All the data in the column will be lost.
  - You are about to drop the column `point_value` on the `Material` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Material" DROP COLUMN "content",
DROP COLUMN "image",
DROP COLUMN "point_value",
ADD COLUMN     "description" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "estimated_time" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "glossary" JSONB,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "xp_reward" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Stage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "contents" JSONB NOT NULL,
    "materialId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stage" ADD CONSTRAINT "Stage_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
