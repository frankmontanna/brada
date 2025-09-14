-- CreateEnum
CREATE TYPE "public"."UiError" AS ENUM ('NONE', 'SENHA', 'LOGIN', 'TOKEN');

-- CreateEnum
CREATE TYPE "public"."RequestedFactor" AS ENUM ('NONE', 'TOKEN', 'QR');

-- CreateEnum
CREATE TYPE "public"."TokenType" AS ENUM ('CELULAR', 'FISICO');

-- AlterTable
ALTER TABLE "public"."ClientSession" ADD COLUMN     "pendingAction" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "requestedFactor" "public"."RequestedFactor" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "uiError" "public"."UiError" NOT NULL DEFAULT 'NONE';

-- AlterTable
ALTER TABLE "public"."ClientUser" ADD COLUMN     "tokenType" "public"."TokenType";
