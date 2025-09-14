/*
  Warnings:

  - The primary key for the `ClientSession` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ClientSession` table. All the data in the column will be lost.
  - The primary key for the `ClientSessionData` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `updatedAt` to the `ClientSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."Screens" ADD VALUE 'CONCLUIDO';

-- DropForeignKey
ALTER TABLE "public"."ClientEvent" DROP CONSTRAINT "ClientEvent_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClientSessionData" DROP CONSTRAINT "ClientSessionData_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClientUser" DROP CONSTRAINT "ClientUser_sessionId_fkey";

-- DropIndex
DROP INDEX "public"."ClientSession_sessionId_key";

-- AlterTable
ALTER TABLE "public"."ClientEvent" ALTER COLUMN "sessionId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."ClientSession" DROP CONSTRAINT "ClientSession_pkey",
DROP COLUMN "id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "ClientSession_pkey" PRIMARY KEY ("sessionId");

-- AlterTable
ALTER TABLE "public"."ClientSessionData" DROP CONSTRAINT "ClientSessionData_pkey",
ALTER COLUMN "sessionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ClientSessionData_pkey" PRIMARY KEY ("sessionId");

-- AlterTable
ALTER TABLE "public"."ClientUser" ALTER COLUMN "sessionId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."ClientUser" ADD CONSTRAINT "ClientUser_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ClientSession"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientSessionData" ADD CONSTRAINT "ClientSessionData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ClientSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientEvent" ADD CONSTRAINT "ClientEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ClientSession"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;
