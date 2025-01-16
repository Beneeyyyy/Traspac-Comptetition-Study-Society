-- DropForeignKey
ALTER TABLE "Discussion" DROP CONSTRAINT "Discussion_materialId_fkey";

-- DropForeignKey
ALTER TABLE "MaterialProgress" DROP CONSTRAINT "MaterialProgress_materialId_fkey";

-- AddForeignKey
ALTER TABLE "MaterialProgress" ADD CONSTRAINT "MaterialProgress_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("id") ON DELETE CASCADE ON UPDATE CASCADE;
