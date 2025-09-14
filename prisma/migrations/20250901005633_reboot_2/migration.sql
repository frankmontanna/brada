-- AlterTable
ALTER TABLE "public"."ClientEvent" ALTER COLUMN "eventData" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."ClientUser" ADD COLUMN     "numSerie" TEXT;
