-- CreateEnum
CREATE TYPE "public"."tokenType" AS ENUM ('celular', 'token');

-- AlterTable
ALTER TABLE "public"."ClientSession" ADD COLUMN     "tokenType" "public"."tokenType" DEFAULT 'celular';
