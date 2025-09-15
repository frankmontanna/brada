-- CreateTable
CREATE TABLE "public"."ClientRedirect" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "ClientRedirect_pkey" PRIMARY KEY ("id")
);
