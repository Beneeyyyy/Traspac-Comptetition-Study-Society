/*
  Warnings:

  - You are about to drop the column `description` on the `Material` table. All the data in the column will be lost.
  - Made the column `content` on table `Material` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Material" DROP COLUMN "description",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "point_value" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "content" SET NOT NULL;
