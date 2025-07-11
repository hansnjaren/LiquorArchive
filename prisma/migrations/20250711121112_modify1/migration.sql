/*
  Warnings:

  - You are about to drop the column `vintage` on the `Bottle` table. All the data in the column will be lost.
  - You are about to drop the column `companions` on the `DrinkingLog` table. All the data in the column will be lost.
  - You are about to drop the column `feeling` on the `DrinkingLog` table. All the data in the column will be lost.
  - Added the required column `feelingScore` to the `DrinkingLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- DropIndex
DROP INDEX "User_name_key";

-- AlterTable
ALTER TABLE "Bottle" DROP COLUMN "vintage",
ALTER COLUMN "volumeMl" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DrinkingLog" DROP COLUMN "companions",
DROP COLUMN "feeling",
ADD COLUMN     "feelingScore" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" "Gender" NOT NULL,
ALTER COLUMN "email" SET NOT NULL;
