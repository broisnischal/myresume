/*
  Warnings:

  - A unique constraint covering the columns `[providerId]` on the table `Connection` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Connection_providerName_providerId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Connection_providerId_key" ON "Connection"("providerId");
