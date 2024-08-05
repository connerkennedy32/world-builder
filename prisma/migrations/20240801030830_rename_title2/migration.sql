/*
  Warnings:

  - You are about to drop the column `name` on the `Page` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[folderId,title]` on the table `Page` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Page_folderId_name_key";

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'new page';

-- CreateIndex
CREATE UNIQUE INDEX "Page_folderId_title_key" ON "Page"("folderId", "title");
