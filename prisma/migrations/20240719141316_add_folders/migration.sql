/*
  Warnings:

  - A unique constraint covering the columns `[folderId,title]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[folderId,order]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `folderId` to the `Page` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Page` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Page_id_key";

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "folderId" INTEGER NOT NULL,
ADD COLUMN     "order" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Folder_order_key" ON "Folder"("order");

-- CreateIndex
CREATE UNIQUE INDEX "Page_folderId_title_key" ON "Page"("folderId", "title");

-- CreateIndex
CREATE UNIQUE INDEX "Page_folderId_order_key" ON "Page"("folderId", "order");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
