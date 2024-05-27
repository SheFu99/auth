-- CreateEnum
CREATE TYPE "FriendStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'BLOCKED');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_galleryId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_commentId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_userId_fkey";

-- DropIndex
DROP INDEX "Post_text_key";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "originAvatar" TEXT,
ADD COLUMN     "originPostId" TEXT,
ADD COLUMN     "originTimeStamp" TIMESTAMP(3),
ADD COLUMN     "originUserId" TEXT,
ADD COLUMN     "originUserName" TEXT,
ADD COLUMN     "repostCount" INTEGER DEFAULT 0,
ADD COLUMN     "superText" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "image" TEXT,
ADD COLUMN     "shortName" TEXT;

-- CreateTable
CREATE TABLE "FriendShip" (
    "transactionId" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "adresseedId" TEXT NOT NULL,
    "status" "FriendStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FriendShip_pkey" PRIMARY KEY ("transactionId")
);

-- CreateIndex
CREATE INDEX "FriendShip_requesterId_idx" ON "FriendShip"("requesterId");

-- CreateIndex
CREATE INDEX "FriendShip_adresseedId_idx" ON "FriendShip"("adresseedId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendShip_requesterId_adresseedId_key" ON "FriendShip"("requesterId", "adresseedId");

-- AddForeignKey
ALTER TABLE "FriendShip" ADD CONSTRAINT "FriendShip_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendShip" ADD CONSTRAINT "FriendShip_adresseedId_fkey" FOREIGN KEY ("adresseedId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("imageId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("PostId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("CommentId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
