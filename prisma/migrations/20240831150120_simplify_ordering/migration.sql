/*
  Warnings:

  - You are about to drop the column `nestedOrder` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `folderId` on the `Page` table. All the data in the column will be lost.
  - You are about to drop the column `nestedOrder` on the `Page` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,order,parentId]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,parentId,title]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,parentId,order]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_folderId_fkey";

-- DropIndex
DROP INDEX "Folder_order_key";

-- DropIndex
DROP INDEX "Page_folderId_order_key";

-- DropIndex
DROP INDEX "Page_folderId_title_key";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "nestedOrder";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "folderId",
DROP COLUMN "nestedOrder",
ADD COLUMN     "parentId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Folder_userId_order_parentId_key" ON "Folder"("userId", "order", "parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Page_userId_parentId_title_key" ON "Page"("userId", "parentId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Page_userId_parentId_order_key" ON "Page"("userId", "parentId", "order");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
