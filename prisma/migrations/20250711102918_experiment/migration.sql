/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BottleCategory" AS ENUM ('WHISKY', 'WINE', 'BRANDY', 'RUM', 'TEQUILA', 'SAKE', 'TRADITIONAL', 'CHINESE', 'OTHER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bottle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "BottleCategory" NOT NULL,
    "country" TEXT,
    "vintage" INTEGER,
    "volumeMl" INTEGER NOT NULL,
    "abv" DECIMAL(5,2),
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bottle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bottleId" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "price" INTEGER,
    "place" TEXT,
    "memo" TEXT,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrinkType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "standardMl" DECIMAL(6,2) NOT NULL,
    "abv" DECIMAL(5,2) NOT NULL,
    "caloriesKcal" DECIMAL(6,2),
    "iconUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrinkType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrinkingLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "locationName" TEXT,
    "locationLat" DECIMAL(9,6),
    "locationLng" DECIMAL(9,6),
    "companions" TEXT[],
    "feeling" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DrinkingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DrinkingLogDrinkType" (
    "drinkingLogId" TEXT NOT NULL,
    "drinkTypeId" TEXT NOT NULL,
    "amountMl" DECIMAL(8,2),

    CONSTRAINT "DrinkingLogDrinkType_pkey" PRIMARY KEY ("drinkingLogId","drinkTypeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Purchase_purchaseDate_idx" ON "Purchase"("purchaseDate");

-- CreateIndex
CREATE UNIQUE INDEX "DrinkType_name_key" ON "DrinkType"("name");

-- CreateIndex
CREATE INDEX "DrinkingLog_date_idx" ON "DrinkingLog"("date");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_bottleId_fkey" FOREIGN KEY ("bottleId") REFERENCES "Bottle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrinkingLog" ADD CONSTRAINT "DrinkingLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrinkingLogDrinkType" ADD CONSTRAINT "DrinkingLogDrinkType_drinkingLogId_fkey" FOREIGN KEY ("drinkingLogId") REFERENCES "DrinkingLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DrinkingLogDrinkType" ADD CONSTRAINT "DrinkingLogDrinkType_drinkTypeId_fkey" FOREIGN KEY ("drinkTypeId") REFERENCES "DrinkType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
