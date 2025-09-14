/*
  Warnings:

  - The primary key for the `ClientSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `clientUserId` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `isLoginS1Error` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `isLoginS1Loading` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `isLoginS1Valid` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenQrDone` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenQrError` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenQrLoading` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenS2Error` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenS2Loading` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenS2Valid` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `screen` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `step` on the `ClientUser` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionId]` on the table `ClientSession` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sessionId]` on the table `ClientUser` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `sessionId` on the `ClientEvent` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `sessionId` to the `ClientUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ClientEvent" DROP CONSTRAINT "ClientEvent_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClientSession" DROP CONSTRAINT "ClientSession_clientUserId_fkey";

-- DropIndex
DROP INDEX "public"."ClientSession_clientUserId_idx";

-- AlterTable
ALTER TABLE "public"."ClientEvent" DROP COLUMN "sessionId",
ADD COLUMN     "sessionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."ClientSession" DROP CONSTRAINT "ClientSession_pkey",
DROP COLUMN "clientUserId",
ADD COLUMN     "currentSession" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "isLoginS1Error" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLoginS1Loading" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLoginS1Valid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTokenQrDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTokenQrError" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTokenQrLoading" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTokenS2Error" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTokenS2Loading" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isTokenS2Valid" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "screen" TEXT,
ADD COLUMN     "step" INTEGER DEFAULT 1,
ADD CONSTRAINT "ClientSession_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."ClientUser" DROP COLUMN "isLoginS1Error",
DROP COLUMN "isLoginS1Loading",
DROP COLUMN "isLoginS1Valid",
DROP COLUMN "isTokenQrDone",
DROP COLUMN "isTokenQrError",
DROP COLUMN "isTokenQrLoading",
DROP COLUMN "isTokenS2Error",
DROP COLUMN "isTokenS2Loading",
DROP COLUMN "isTokenS2Valid",
DROP COLUMN "screen",
DROP COLUMN "step",
ADD COLUMN     "sessionId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "ClientEvent_sessionId_idx" ON "public"."ClientEvent"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientSession_sessionId_key" ON "public"."ClientSession"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientUser_sessionId_key" ON "public"."ClientUser"("sessionId");

-- AddForeignKey
ALTER TABLE "public"."ClientUser" ADD CONSTRAINT "ClientUser_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ClientSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientEvent" ADD CONSTRAINT "ClientEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ClientSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
