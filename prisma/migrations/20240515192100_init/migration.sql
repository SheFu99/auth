/*
  Warnings:

  - You are about to drop the column `image` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "Images" (
    "url" TEXT NOT NULL,
    "postId" TEXT,
    "CommentId" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_CommentId_fkey" FOREIGN KEY ("CommentId") REFERENCES "Comment"("CommentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Images" ADD CONSTRAINT "Images_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("PostId") ON DELETE CASCADE ON UPDATE CASCADE;
