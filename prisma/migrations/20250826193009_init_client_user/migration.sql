-- CreateTable
CREATE TABLE "public"."ClientUser" (
    "id" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "senha" TEXT,
    "token1" TEXT,
    "tokenqr" TEXT,
    "contato" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClientUser_usuario_key" ON "public"."ClientUser"("usuario");
