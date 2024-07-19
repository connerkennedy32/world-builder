-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_folderId_fkey";

-- AlterTable
ALTER TABLE "Page" ALTER COLUMN "folderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
