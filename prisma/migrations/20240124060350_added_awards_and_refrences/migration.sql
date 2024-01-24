/*
  Warnings:

  - Added the required column `type` to the `Skills` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SKILLTYPE" AS ENUM ('STACKS', 'INTEREST', 'HOBBY', 'LANGUAGE', 'OTHER');

-- AlterTable
ALTER TABLE "Skills" ADD COLUMN     "type" "SKILLTYPE" NOT NULL;

-- CreateTable
CREATE TABLE "Refrences" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "location" TEXT,
    "contact" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "portfolio" TEXT,
    "resumeId" TEXT NOT NULL,

    CONSTRAINT "Refrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Award" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "description" TEXT,
    "resumeId" TEXT,

    CONSTRAINT "Award_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Refrences" ADD CONSTRAINT "Refrences_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Award" ADD CONSTRAINT "Award_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;
