/*
  Warnings:

  - You are about to drop the column `name` on the `Folder` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Page` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[folderId,name]` on the table `Page` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Folder` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Page_folderId_title_key";

-- AlterTable
ALTER TABLE "Folder" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Page" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'new page';

-- CreateIndex
CREATE UNIQUE INDEX "Page_folderId_name_key" ON "Page"("folderId", "name");
