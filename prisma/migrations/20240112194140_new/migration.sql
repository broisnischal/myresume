/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "github_bio" TEXT,
ADD COLUMN     "github_username" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "twitter_username" TEXT,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
