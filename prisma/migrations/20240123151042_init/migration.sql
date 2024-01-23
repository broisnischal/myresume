/*
  Warnings:

  - Added the required column `field` to the `Education` table without a default value. This is not possible if the table is not empty.
  - Made the column `resumeId` on table `Education` required. This step will fail if there are existing NULL values in that column.
  - Made the column `resumeId` on table `Works` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Education" DROP CONSTRAINT "Education_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "Works" DROP CONSTRAINT "Works_resumeId_fkey";

-- AlterTable
ALTER TABLE "Education" ADD COLUMN     "field" TEXT NOT NULL,
ALTER COLUMN "resumeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Works" ADD COLUMN     "location" TEXT,
ALTER COLUMN "startDate" SET DATA TYPE TEXT,
ALTER COLUMN "endDate" SET DATA TYPE TEXT,
ALTER COLUMN "resumeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Works" ADD CONSTRAINT "Works_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
