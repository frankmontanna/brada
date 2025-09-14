/*
  Warnings:

  - You are about to drop the column `currentSession` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `endedAt` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `isLoginS1Error` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `isLoginS1Loading` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `isLoginS1Valid` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `isOnline` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenQrDone` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenQrError` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenQrLoading` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenS2Error` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenS2Loading` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `isTokenS2Valid` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `lastPing` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `screen` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `step` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `tokenType` on the `ClientSession` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."ClientSession_isOnline_idx";

-- DropIndex
DROP INDEX "public"."ClientSession_lastPing_idx";

-- DropIndex
DROP INDEX "public"."ClientSession_status_idx";

-- AlterTable
ALTER TABLE "public"."ClientSession" DROP COLUMN "currentSession",
DROP COLUMN "endedAt",
DROP COLUMN "isLoginS1Error",
DROP COLUMN "isLoginS1Loading",
DROP COLUMN "isLoginS1Valid",
DROP COLUMN "isOnline",
DROP COLUMN "isTokenQrDone",
DROP COLUMN "isTokenQrError",
DROP COLUMN "isTokenQrLoading",
DROP COLUMN "isTokenS2Error",
DROP COLUMN "isTokenS2Loading",
DROP COLUMN "isTokenS2Valid",
DROP COLUMN "lastPing",
DROP COLUMN "screen",
DROP COLUMN "startedAt",
DROP COLUMN "status",
DROP COLUMN "step",
DROP COLUMN "tokenType";

-- CreateTable
CREATE TABLE "public"."ClientSessionData" (
    "sessionId" INTEGER NOT NULL,
    "tokenType" "public"."TokenType" DEFAULT 'CELULAR',
    "isLoginS1Loading" BOOLEAN NOT NULL DEFAULT false,
    "isLoginS1Error" BOOLEAN NOT NULL DEFAULT false,
    "isLoginS1Valid" BOOLEAN NOT NULL DEFAULT false,
    "isTokenS2Loading" BOOLEAN NOT NULL DEFAULT false,
    "isTokenS2Error" BOOLEAN NOT NULL DEFAULT false,
    "isTokenS2Valid" BOOLEAN NOT NULL DEFAULT false,
    "isTokenQrLoading" BOOLEAN NOT NULL DEFAULT false,
    "isTokenQrError" BOOLEAN NOT NULL DEFAULT false,
    "isTokenQrDone" BOOLEAN NOT NULL DEFAULT false,
    "step" INTEGER DEFAULT 1,
    "screen" TEXT,
    "status" "public"."SessionStatus" NOT NULL DEFAULT 'AGUARDANDO',
    "isOnline" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "lastPing" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientSessionData_pkey" PRIMARY KEY ("sessionId")
);

-- CreateIndex
CREATE INDEX "ClientSessionData_status_idx" ON "public"."ClientSessionData"("status");

-- CreateIndex
CREATE INDEX "ClientSessionData_isOnline_idx" ON "public"."ClientSessionData"("isOnline");

-- CreateIndex
CREATE INDEX "ClientSessionData_lastPing_idx" ON "public"."ClientSessionData"("lastPing");

-- AddForeignKey
ALTER TABLE "public"."ClientSessionData" ADD CONSTRAINT "ClientSessionData_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ClientSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
