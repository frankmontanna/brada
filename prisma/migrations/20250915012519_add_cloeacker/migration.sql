-- CreateTable
CREATE TABLE "public"."AppConfig" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "cloakerState" BOOLEAN NOT NULL DEFAULT false,
    "blockStranger" BOOLEAN NOT NULL DEFAULT false,
    "blockMobile" BOOLEAN NOT NULL DEFAULT false,
    "blockBot" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AppConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IpBlackList" (
    "id" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "reason" TEXT,
    "firstSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL,
    "appConfigId" TEXT NOT NULL,

    CONSTRAINT "IpBlackList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IpBlackList_ipAddress_idx" ON "public"."IpBlackList"("ipAddress");

-- CreateIndex
CREATE UNIQUE INDEX "IpBlackList_appConfigId_ipAddress_key" ON "public"."IpBlackList"("appConfigId", "ipAddress");

-- AddForeignKey
ALTER TABLE "public"."IpBlackList" ADD CONSTRAINT "IpBlackList_appConfigId_fkey" FOREIGN KEY ("appConfigId") REFERENCES "public"."AppConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
