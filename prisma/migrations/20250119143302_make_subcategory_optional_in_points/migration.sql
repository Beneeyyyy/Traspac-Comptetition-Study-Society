-- DropForeignKey
ALTER TABLE "Point" DROP CONSTRAINT "Point_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "Point" ALTER COLUMN "subcategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Point" ADD CONSTRAINT "Point_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
