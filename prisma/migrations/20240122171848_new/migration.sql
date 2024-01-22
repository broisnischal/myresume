/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Resume` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Resume` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "THEME" AS ENUM ('DEFAULT', 'LIGHT', 'DARK');

-- CreateEnum
CREATE TYPE "RESUMETYPE" AS ENUM ('BASIC', 'PRO', 'CODE', 'EDITOR', 'PREMIUM');

-- AlterEnum
ALTER TYPE "UserType" ADD VALUE 'SUPERADMIN';

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "resumetype" "RESUMETYPE" NOT NULL DEFAULT 'BASIC',
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "theme" "THEME" NOT NULL DEFAULT 'DEFAULT',
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- CreateTable
CREATE TABLE "NewsLetter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subscribed" BOOLEAN NOT NULL DEFAULT false,
    "hash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsLetter_email_key" ON "NewsLetter"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Resume_slug_key" ON "Resume"("slug");
