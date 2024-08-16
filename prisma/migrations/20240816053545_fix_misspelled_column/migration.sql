/*
  Warnings:

  - You are about to drop the column `wordCound` on the `WordEntry` table. All the data in the column will be lost.
  - Added the required column `wordCount` to the `WordEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WordEntry" DROP COLUMN "wordCound",
ADD COLUMN     "wordCount" INTEGER NOT NULL;
