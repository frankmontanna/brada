/*
  Warnings:

  - The `tokenType` column on the `ClientSession` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."TokenType" AS ENUM ('CELULAR', 'TOKEN');

-- AlterTable
ALTER TABLE "public"."ClientSession" DROP COLUMN "tokenType",
ADD COLUMN     "tokenType" "public"."TokenType" DEFAULT 'CELULAR';

-- DropEnum
DROP TYPE "public"."tokenType";
