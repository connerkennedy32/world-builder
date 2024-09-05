/*
  Warnings:

  - A unique constraint covering the columns `[userId,parentId,index]` on the table `Item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `index` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "index" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Item_userId_parentId_index_key" ON "Item"("userId", "parentId", "index");
