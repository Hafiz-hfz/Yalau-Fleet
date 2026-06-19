-- CreateTable
CREATE TABLE "Parametres" (
    "id" SERIAL NOT NULL,
    "seuilAlerte" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "prixParLitre" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parametres_pkey" PRIMARY KEY ("id")
);
