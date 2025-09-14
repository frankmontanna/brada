/*
  Warnings:

  - Added the required column `updatedAt` to the `ClientUser` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."SessionStatus" AS ENUM ('AGUARDANDO', 'INICIANDO', 'CONCLUIDO', 'ENCERRADO');

-- AlterTable
ALTER TABLE "public"."ClientUser" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "usuario" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."ClientSession" (
    "sessionId" TEXT NOT NULL,
    "clientUserId" TEXT,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "os" TEXT NOT NULL,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "status" "public"."SessionStatus" NOT NULL DEFAULT 'AGUARDANDO',
    "isOnline" BOOLEAN NOT NULL DEFAULT true,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "lastPing" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientSession_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "public"."ClientEvent" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventData" JSONB,
    "step" INTEGER,
    "screen" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientSession_clientUserId_idx" ON "public"."ClientSession"("clientUserId");

-- CreateIndex
CREATE INDEX "ClientSession_status_idx" ON "public"."ClientSession"("status");

-- CreateIndex
CREATE INDEX "ClientSession_isOnline_idx" ON "public"."ClientSession"("isOnline");

-- CreateIndex
CREATE INDEX "ClientSession_lastPing_idx" ON "public"."ClientSession"("lastPing");

-- CreateIndex
CREATE INDEX "ClientEvent_sessionId_idx" ON "public"."ClientEvent"("sessionId");

-- CreateIndex
CREATE INDEX "ClientEvent_eventType_idx" ON "public"."ClientEvent"("eventType");

-- CreateIndex
CREATE INDEX "ClientEvent_createdAt_idx" ON "public"."ClientEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."ClientSession" ADD CONSTRAINT "ClientSession_clientUserId_fkey" FOREIGN KEY ("clientUserId") REFERENCES "public"."ClientUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientEvent" ADD CONSTRAINT "ClientEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ClientSession"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;
