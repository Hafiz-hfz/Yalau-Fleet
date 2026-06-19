-- CreateTable
CREATE TABLE "Camion" (
    "id" SERIAL NOT NULL,
    "immatriculation" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "capaciteCharges" DOUBLE PRECISION NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'disponible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Camion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chauffeur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "numeroPermis" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'actif',
    "camionId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chauffeur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Livraison" (
    "id" SERIAL NOT NULL,
    "numeroLivraison" TEXT NOT NULL,
    "camionId" INTEGER NOT NULL,
    "chauffeurId" INTEGER NOT NULL,
    "villeDepart" TEXT NOT NULL,
    "villeDestination" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'en_attente',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Livraison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ravitaillement" (
    "id" SERIAL NOT NULL,
    "camionId" INTEGER NOT NULL,
    "chauffeurId" INTEGER NOT NULL,
    "litres" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "cout" DOUBLE PRECISION,
    "recu" TEXT,
    "livraisonId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ravitaillement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Approvisionnement" (
    "id" SERIAL NOT NULL,
    "litres" DOUBLE PRECISION NOT NULL,
    "prixParLitre" DOUBLE PRECISION NOT NULL,
    "coutTotal" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Approvisionnement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Camion_immatriculation_key" ON "Camion"("immatriculation");

-- CreateIndex
CREATE UNIQUE INDEX "Chauffeur_numeroPermis_key" ON "Chauffeur"("numeroPermis");

-- CreateIndex
CREATE UNIQUE INDEX "Livraison_numeroLivraison_key" ON "Livraison"("numeroLivraison");

-- AddForeignKey
ALTER TABLE "Chauffeur" ADD CONSTRAINT "Chauffeur_camionId_fkey" FOREIGN KEY ("camionId") REFERENCES "Camion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livraison" ADD CONSTRAINT "Livraison_camionId_fkey" FOREIGN KEY ("camionId") REFERENCES "Camion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Livraison" ADD CONSTRAINT "Livraison_chauffeurId_fkey" FOREIGN KEY ("chauffeurId") REFERENCES "Chauffeur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ravitaillement" ADD CONSTRAINT "Ravitaillement_camionId_fkey" FOREIGN KEY ("camionId") REFERENCES "Camion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ravitaillement" ADD CONSTRAINT "Ravitaillement_chauffeurId_fkey" FOREIGN KEY ("chauffeurId") REFERENCES "Chauffeur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ravitaillement" ADD CONSTRAINT "Ravitaillement_livraisonId_fkey" FOREIGN KEY ("livraisonId") REFERENCES "Livraison"("id") ON DELETE SET NULL ON UPDATE CASCADE;
