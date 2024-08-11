-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WordEntry" (
    "id" SERIAL NOT NULL,
    "wordCound" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "bookId" INTEGER NOT NULL,

    CONSTRAINT "WordEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WordEntry" ADD CONSTRAINT "WordEntry_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
