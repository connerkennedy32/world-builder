-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('FOLDER', 'PAGE');

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "itemType" "ItemType" NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'new item',
    "content" TEXT,
    "userId" INTEGER NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
