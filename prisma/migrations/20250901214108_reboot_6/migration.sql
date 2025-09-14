/*
  Warnings:

  - You are about to drop the column `numSerie` on the `ClientUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ClientSession" ADD COLUMN     "origin" TEXT;

-- AlterTable
ALTER TABLE "public"."ClientUser" DROP COLUMN "numSerie";
