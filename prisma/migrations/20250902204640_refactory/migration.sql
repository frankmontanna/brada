/*
  Warnings:

  - You are about to drop the column `step` on the `ClientEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ClientEvent" DROP COLUMN "step";

-- AlterTable
ALTER TABLE "public"."ClientSession" ADD COLUMN     "step" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "public"."ClientUser" ADD COLUMN     "loginValid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "token1Valid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tokenQrValid" BOOLEAN NOT NULL DEFAULT false;
