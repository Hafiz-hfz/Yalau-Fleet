// server/prisma/seed.js
//
// Script de seed — génère 6 semaines de données réalistes pour YALAU Fleet
// Usage : placer ce fichier dans server/prisma/ puis lancer :
//   node prisma/seed.js
//
// /!\ Ce script utilise upsert pour Camions/Chauffeurs/Users/Parametres (pas de doublon
// si relancé), mais Livraisons/Ravitaillements/Approvisionnements sont créés sans
// upsert -> si tu relances le script, décommente la section "NETTOYAGE" plus bas.

require('dotenv').config()
// const prisma = require('./client')
const prisma = require('./client')
const bcrypt = require('bcrypt')

function dateIlYA(joursAvant) {
  const d = new Date()
  d.setDate(d.getDate() - joursAvant)
  d.setHours(8 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 60), 0, 0)
  return d
}

async function main() {
  console.log('Démarrage du seed...')

  // ============================================
  // NETTOYAGE (décommenter si tu relances le seed)
  // ============================================
  // await prisma.activite.deleteMany()
  // await prisma.ravitaillement.deleteMany()
  // await prisma.livraison.deleteMany()
  // await prisma.approvisionnement.deleteMany()
  // await prisma.chauffeur.deleteMany()
  // await prisma.camion.deleteMany()
  // console.log('Anciennes données supprimées')

  // ============================================
  // 1. PARAMÈTRES
  // ============================================
  const existingParams = await prisma.parametres.findFirst()
  if (!existingParams) {
    await prisma.parametres.create({
      data: { seuilAlerte: 2000, prixParLitre: 700 }
    })
  } else {
    await prisma.parametres.update({
      where: { id: existingParams.id },
      data: { seuilAlerte: 2000, prixParLitre: 700 }
    })
  }
  console.log('Paramètres OK (seuil 2000L, prix 700 FCFA/L)')

  // ============================================
  // 2. UTILISATEUR ADMIN
  // ============================================
  const hashedPassword = await bcrypt.hash('yalau2024', 10)
  
  // Yalau Compte
  await prisma.user.upsert({
    where: { email: 'admin@yalau.com' },
    update: {},
    create: {
      nom: 'Admin YALAU',
      telephone: '0197000000',
      email: 'admin@yalau.com',
      password: hashedPassword,
      role: 'admin',
      statut: 'actif'
    }
  })


  console.log('Compte admin OK (admin@yalau.com / yalau2024)')

  // ============================================
  // 3. CAMIONS
  // ============================================
  const camionsData = [
    { immatriculation: 'BJ-1234', marque: 'Isuzu NPR', capaciteCharges: 5, statut: 'disponible', latitude: 6.3654, longitude: 2.4183 },
    { immatriculation: 'BJ-5678', marque: 'Mercedes Actros', capaciteCharges: 10, statut: 'en_route', latitude: 9.3372, longitude: 2.6303 },
    { immatriculation: 'BJ-9012', marque: 'Renault Premium', capaciteCharges: 8, statut: 'en_panne', latitude: 6.4969, longitude: 2.6283 },
    { immatriculation: 'BJ-3456', marque: 'Iveco Daily', capaciteCharges: 3, statut: 'disponible', latitude: 6.3703, longitude: 2.3912 },
    { immatriculation: 'BJ-7890', marque: 'Isuzu FRR', capaciteCharges: 6, statut: 'en_route', latitude: 10.3045, longitude: 1.3795 },
  ]

  const camions = []
  for (const c of camionsData) {
    const camion = await prisma.camion.upsert({
      where: { immatriculation: c.immatriculation },
      update: {},
      create: c
    })
    camions.push(camion)
  }
  console.log(`${camions.length} camions OK`)

  // ============================================
  // 4. CHAUFFEURS
  // ============================================
  const chauffeursData = [
    { nom: 'Kouadio Jean', telephone: '0197111111', numeroPermis: 'PM-001', statut: 'disponible', camionId: camions[0].id },
    { nom: 'Mensah Paul', telephone: '0197222222', numeroPermis: 'PM-002', statut: 'en_mission', camionId: camions[1].id },
    { nom: 'Adjovi Marc', telephone: '0197333333', numeroPermis: 'PM-003', statut: 'disponible', camionId: camions[2].id },
    { nom: 'Bio Tom', telephone: '0197444444', numeroPermis: 'PM-004', statut: 'disponible', camionId: camions[3].id },
    { nom: 'Sossou Eric', telephone: '0197555555', numeroPermis: 'PM-005', statut: 'en_mission', camionId: camions[4].id },
  ]

  const chauffeurs = []
  for (const ch of chauffeursData) {
    const chauffeur = await prisma.chauffeur.upsert({
      where: { numeroPermis: ch.numeroPermis },
      update: {},
      create: ch
    })
    chauffeurs.push(chauffeur)
  }
  console.log(`${chauffeurs.length} chauffeurs OK`)

  // ============================================
  // 5. APPROVISIONNEMENTS — 1 par semaine sur 6 semaines
  // ============================================
  for (let semaine = 6; semaine >= 0; semaine--) {
    const litres = 4000 + Math.floor(Math.random() * 2000) // 4000-6000L
    const prix = 680 + Math.floor(Math.random() * 40) // 680-720 FCFA/L
    await prisma.approvisionnement.create({
      data: {
        litres,
        prixParLitre: prix,
        coutTotal: litres * prix,
        date: dateIlYA(semaine * 7),
        fournisseur: 'SONACOP Cotonou',
        note: null
      }
    })
  }
  console.log('7 approvisionnements OK (1/semaine)')

  // ============================================
  // 6. LIVRAISONS + RAVITAILLEMENTS — sur 42 jours
  // ============================================
  const villesDestination = ['Parakou', 'Porto-Novo', 'Natitingou', 'Possotomé']
  let livraisonCount = 0
  let ravitaillementCount = 0

  for (let jour = 41; jour >= 0; jour--) {
    const date = dateIlYA(jour)
    const nbLivraisons = 1 + Math.floor(Math.random() * 3) // 1 à 3 par jour

    for (let i = 0; i < nbLivraisons; i++) {
      const camion = camions[Math.floor(Math.random() * camions.length)]
      const chauffeur = chauffeurs.find(c => c.camionId === camion.id) || chauffeurs[0]
      const villeDest = villesDestination[Math.floor(Math.random() * villesDestination.length)]

      // Statut selon ancienneté
      let statut = 'livree'
      if (jour === 0) statut = 'en_cours'
      else if (jour <= 2 && Math.random() > 0.7) statut = 'en_attente'
      else if (Math.random() > 0.95) statut = 'annulee'

      const livraison = await prisma.livraison.create({
        data: {
          camionId: camion.id,
          chauffeurId: chauffeur.id,
          villeDepart: 'Cotonou',
          villeDestination: villeDest,
          date,
          statut
        }
      })
      livraisonCount++

      // Pas de ravitaillement pour les livraisons annulées
      if (statut === 'annulee') continue

      const litres = 80 + Math.floor(Math.random() * 80) // 80-160L
      const isInterne = Math.random() > 0.4 // ~60% interne (Cotonou), ~40% externe

      if (isInterne) {
        await prisma.ravitaillement.create({
          data: {
            camionId: camion.id,
            chauffeurId: chauffeur.id,
            litres,
            type: 'stock_interne',
            ville: 'Cotonou',
            date,
            cout: null,
            statut: null,
            livraisonId: livraison.id
          }
        })
      } else {
        const prixStation = 700 + Math.floor(Math.random() * 50) // 700-750
        await prisma.ravitaillement.create({
          data: {
            camionId: camion.id,
            chauffeurId: chauffeur.id,
            litres,
            type: 'station_externe',
            ville: villeDest,
            date,
            cout: litres * prixStation,
            statut: Math.random() > 0.2 ? 'validé' : 'en_attente',
            livraisonId: livraison.id
          }
        })
      }
      ravitaillementCount++
    }
  }

  console.log(`${livraisonCount} livraisons OK`)
  console.log(`${ravitaillementCount} ravitaillements OK`)
  console.log('Seed terminé avec succès !')
}

main()
  .catch((e) => {
    console.error('Erreur seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
