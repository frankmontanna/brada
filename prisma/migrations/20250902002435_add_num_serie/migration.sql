/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- AlterTable
ALTER TABLE "public"."ClientUser" ADD COLUMN     "numSerie" TEXT,
ADD COLUMN     "operatedById" TEXT;

-- DropTable
DROP TABLE "public"."sessions";

-- AddForeignKey
ALTER TABLE "public"."ClientUser" ADD CONSTRAINT "ClientUser_operatedById_fkey" FOREIGN KEY ("operatedById") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
