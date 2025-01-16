-- Add stageIndex column with a default value
ALTER TABLE "Point" ADD COLUMN "stageIndex" INTEGER DEFAULT 0;

-- Add updatedAt column with current timestamp as default
ALTER TABLE "Point" ADD COLUMN "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Remove the defaults after adding the columns
ALTER TABLE "Point" ALTER COLUMN "stageIndex" DROP DEFAULT;
ALTER TABLE "Point" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- Add unique constraint
ALTER TABLE "Point" ADD CONSTRAINT "Point_userId_materialId_stageIndex_key" UNIQUE ("userId", "materialId", "stageIndex"); 