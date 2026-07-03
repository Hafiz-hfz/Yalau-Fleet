-- CreateTable
CREATE TABLE "HistoriqueStatutCamion" (
    "id" SERIAL NOT NULL,
    "camionId" INTEGER NOT NULL,
    "statut" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoriqueStatutCamion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HistoriqueStatutCamion" ADD CONSTRAINT "HistoriqueStatutCamion_camionId_fkey" FOREIGN KEY ("camionId") REFERENCES "Camion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
