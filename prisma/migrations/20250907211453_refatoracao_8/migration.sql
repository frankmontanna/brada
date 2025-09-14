-- DropForeignKey
ALTER TABLE "public"."ClientEvent" DROP CONSTRAINT "ClientEvent_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClientUser" DROP CONSTRAINT "ClientUser_sessionId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ClientUser" ADD CONSTRAINT "ClientUser_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ClientSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClientEvent" ADD CONSTRAINT "ClientEvent_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "public"."ClientSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;
