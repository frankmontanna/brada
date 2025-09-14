/*
  Warnings:

  - You are about to drop the column `pendingAction` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `requestedFactor` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `step` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `uiError` on the `ClientSession` table. All the data in the column will be lost.
  - You are about to drop the column `loginValid` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `token1Valid` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `tokenQrValid` on the `ClientUser` table. All the data in the column will be lost.
  - You are about to drop the column `tokenType` on the `ClientUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ClientSession" DROP COLUMN "pendingAction",
DROP COLUMN "requestedFactor",
DROP COLUMN "step",
DROP COLUMN "uiError";

-- AlterTable
ALTER TABLE "public"."ClientUser" DROP COLUMN "loginValid",
DROP COLUMN "token1Valid",
DROP COLUMN "tokenQrValid",
DROP COLUMN "tokenType",
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
ADD COLUMN     "step" INTEGER DEFAULT 1;

-- DropEnum
DROP TYPE "public"."RequestedFactor";

-- DropEnum
DROP TYPE "public"."TokenType";

-- DropEnum
DROP TYPE "public"."UiError";
