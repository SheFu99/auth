/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `regionCode` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,access_token]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,provider]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[review_id]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shortName]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'WORKER';
ALTER TYPE "UserRole" ADD VALUE 'CLIENT';
ALTER TYPE "UserRole" ADD VALUE 'BLOCKED';

-- DropIndex
DROP INDEX "Profile_shortName_idx";

-- AlterTable
ALTER TABLE "Account" DROP CONSTRAINT "Account_pkey",
ADD CONSTRAINT "Account_pkey" PRIMARY KEY ("userId", "id");

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "coordsId" TEXT,
ADD COLUMN     "review_id" TEXT;

-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "coordsId" TEXT;

-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "alt" TEXT;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "regionCode",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ProfileSettings" (
    "userId" TEXT NOT NULL,
    "pirvate" BOOLEAN NOT NULL DEFAULT true,
    "showNumber" BOOLEAN NOT NULL DEFAULT false,
    "showEmail" BOOLEAN NOT NULL DEFAULT false,
    "updateDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileSettings_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Worker" (
    "userId" TEXT NOT NULL,
    "telegramId" TEXT,
    "watsAppId" TEXT,
    "viberId" TEXT,
    "driverLicenseNumber" TEXT,
    "department" TEXT NOT NULL,
    "primeRate" INTEGER,
    "balance" INTEGER,
    "experienceLevel" TEXT,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3),

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Vechicle" (
    "vechicleId" TEXT NOT NULL,
    "userId" TEXT,
    "vinCode" TEXT,
    "registerNumber" TEXT,

    CONSTRAINT "Vechicle_pkey" PRIMARY KEY ("vechicleId")
);

-- CreateTable
CREATE TABLE "Hour_rate" (
    "userId" TEXT NOT NULL,
    "from" INTEGER NOT NULL,
    "to" INTEGER NOT NULL,
    "createDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3),

    CONSTRAINT "Hour_rate_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "WorkingHours" (
    "workingHoursId" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,
    "day_of_week" "WeekDays" NOT NULL,
    "start_time" TIMESTAMP(3),
    "end_time" TIMESTAMP(3),
    "is_open" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkingHours_pkey" PRIMARY KEY ("workingHoursId")
);

-- CreateTable
CREATE TABLE "Reviews" (
    "review_id" TEXT NOT NULL,
    "worker_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3),

    CONSTRAINT "Reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "Client" (
    "userId" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3),

    CONSTRAINT "Client_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Contract" (
    "contractId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "budget" INTEGER,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3),

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("contractId")
);

-- CreateTable
CREATE TABLE "Stats" (
    "userId" TEXT NOT NULL,
    "commentsCount" INTEGER DEFAULT 0,
    "likesCount" INTEGER DEFAULT 0,
    "rating" INTEGER DEFAULT 0,
    "rewiewsCount" INTEGER DEFAULT 0,
    "contractCount" INTEGER DEFAULT 0,
    "partnersCount" INTEGER DEFAULT 0,

    CONSTRAINT "Stats_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Socialmedia" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "verifiedToken" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateDate" TIMESTAMP(3),

    CONSTRAINT "Socialmedia_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "deviceType" TEXT,
    "osInfo" TEXT,
    "browserInfo" TEXT,
    "ipAddress" TEXT,
    "fingerprint" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coords" (
    "coordsId" TEXT NOT NULL,
    "userId" TEXT,
    "adminId" TEXT,
    "placeName" TEXT,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "image" TEXT,
    "coverImage" TEXT,

    CONSTRAINT "Coords_pkey" PRIMARY KEY ("coordsId")
);

-- CreateTable
CREATE TABLE "_ProfileCoords" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProfileCoords_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "ProfileSettings_userId_idx" ON "ProfileSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_userId_key" ON "Worker"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_telegramId_key" ON "Worker"("telegramId");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_watsAppId_key" ON "Worker"("watsAppId");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_viberId_key" ON "Worker"("viberId");

-- CreateIndex
CREATE INDEX "Worker_userId_idx" ON "Worker"("userId");

-- CreateIndex
CREATE INDEX "Worker_telegramId_idx" ON "Worker"("telegramId");

-- CreateIndex
CREATE INDEX "Hour_rate_userId_idx" ON "Hour_rate"("userId");

-- CreateIndex
CREATE INDEX "WorkingHours_workingHoursId_idx" ON "WorkingHours"("workingHoursId");

-- CreateIndex
CREATE INDEX "WorkingHours_worker_id_idx" ON "WorkingHours"("worker_id");

-- CreateIndex
CREATE UNIQUE INDEX "Reviews_review_id_key" ON "Reviews"("review_id");

-- CreateIndex
CREATE INDEX "Reviews_review_id_idx" ON "Reviews"("review_id");

-- CreateIndex
CREATE INDEX "Reviews_worker_id_idx" ON "Reviews"("worker_id");

-- CreateIndex
CREATE INDEX "Reviews_client_id_idx" ON "Reviews"("client_id");

-- CreateIndex
CREATE UNIQUE INDEX "Client_userId_key" ON "Client"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_workerId_key" ON "Contract"("workerId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_clientId_key" ON "Contract"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "Stats_userId_key" ON "Stats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Socialmedia_userId_key" ON "Socialmedia"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_fingerprint_key" ON "Session"("fingerprint");

-- CreateIndex
CREATE INDEX "Session_fingerprint_userId_idx" ON "Session"("fingerprint", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Coords_userId_key" ON "Coords"("userId");

-- CreateIndex
CREATE INDEX "_ProfileCoords_B_index" ON "_ProfileCoords"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_access_token_key" ON "Account"("userId", "access_token");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_provider_key" ON "Account"("userId", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_review_id_key" ON "Comment"("review_id");

-- CreateIndex
CREATE INDEX "Comment_timestamp_idx" ON "Comment"("timestamp");

-- CreateIndex
CREATE INDEX "Post_timestamp_idx" ON "Post"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_shortName_key" ON "Profile"("shortName");

-- AddForeignKey
ALTER TABLE "ProfileSettings" ADD CONSTRAINT "ProfileSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Worker" ADD CONSTRAINT "Worker_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hour_rate" ADD CONSTRAINT "Hour_rate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Worker"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkingHours" ADD CONSTRAINT "WorkingHours_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "Worker"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "Contract"("contractId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "Worker"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contract" ADD CONSTRAINT "Contract_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stats" ADD CONSTRAINT "Stats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Socialmedia" ADD CONSTRAINT "Socialmedia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "Reviews"("review_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_coordsId_fkey" FOREIGN KEY ("coordsId") REFERENCES "Coords"("coordsId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_coordsId_fkey" FOREIGN KEY ("coordsId") REFERENCES "Coords"("coordsId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coords" ADD CONSTRAINT "Coords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Worker"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileCoords" ADD CONSTRAINT "_ProfileCoords_A_fkey" FOREIGN KEY ("A") REFERENCES "Coords"("coordsId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileCoords" ADD CONSTRAINT "_ProfileCoords_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
