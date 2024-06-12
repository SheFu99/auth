/*
  Warnings:

  - You are about to drop the column `originAvatar` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `originTimeStamp` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `originUserId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `originUserName` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "originCommentId" TEXT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "originAvatar",
DROP COLUMN "originTimeStamp",
DROP COLUMN "originUserId",
DROP COLUMN "originUserName";

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Comment_postId_idx" ON "Comment"("postId");

-- CreateIndex
CREATE INDEX "Images_postId_idx" ON "Images"("postId");

-- CreateIndex
CREATE INDEX "Like_userId_idx" ON "Like"("userId");

-- CreateIndex
CREATE INDEX "Like_postId_idx" ON "Like"("postId");

-- CreateIndex
CREATE INDEX "Post_PostId_idx" ON "Post"("PostId");

-- CreateIndex
CREATE INDEX "Profile_shortName_idx" ON "Profile"("shortName");

-- CreateIndex
CREATE INDEX "Profile_userId_idx" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_firstName_idx" ON "Profile"("firstName");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_originPostId_fkey" FOREIGN KEY ("originPostId") REFERENCES "Post"("PostId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_originCommentId_fkey" FOREIGN KEY ("originCommentId") REFERENCES "Comment"("CommentId") ON DELETE CASCADE ON UPDATE CASCADE;
