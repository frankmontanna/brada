/*
  Warnings:

  - You are about to drop the column `screen` on the `ClientEvent` table. All the data in the column will be lost.
  - The `screen` column on the `ClientSessionData` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Screens" AS ENUM ('TELA_DE_LOGIN', 'CARREGANDO_TELA_DE_LOGIN', 'TELA_DE_TOKEN', 'CARREGANDO_TELA_DE_TOKEN', 'TELA_DE_QRCODE', 'CARREGANDO_TELA_DE_QRCODE');

-- AlterTable
ALTER TABLE "public"."ClientEvent" DROP COLUMN "screen";

-- AlterTable
ALTER TABLE "public"."ClientSessionData" DROP COLUMN "screen",
ADD COLUMN     "screen" "public"."Screens";
