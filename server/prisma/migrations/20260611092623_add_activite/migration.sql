-- CreateTable
CREATE TABLE "Activite" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "statut" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Activite_pkey" PRIMARY KEY ("id")
);
