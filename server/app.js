require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
const path = require('path')
// app.use(cors({ origin: 'http://localhost:3000' }))
// app.use(cors({ 
//   origin: process.env.CLIENT_URL || "*"
// }))
app.use(cors())
// Probleme  Cors
console.log("CLIENT_URL =", process.env.CLIENT_URL)
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// routes (à ajouter au fur et à mesure)
app.use('/api/dashboard', require('./routes/dashboard'))
app.use('/api/camions', require('./routes/camion'))
app.use('/api/chauffeurs', require('./routes/chauffeur'))
app.use('/api/livraisons', require('./routes/livraison'))
app.use('/api/carburant', require('./routes/carburant'))
console.log('route carburant chargée')

app.use('/api/users', require('./routes/users'))

// app.use('/api/auth', require('./routes/auth'))
app.use('/api/parametres', (req, res, next) => {
  console.log('requête parametres reçue:', req.method, req.url)
  next()
}, require('./routes/parametres'))
console.log('route parametres chargée')
app.get('/test', (req, res) => res.json({ ok: true }))

app.get("/", (req, res) => {
  res.send("API OK");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
 
module.exports = app


// temporaire
const bcrypt = require('bcrypt')

app.get('/seed-users', async (req, res) => {
  try {
    const prisma = require('./prisma/client')
    const hashedPassword = await bcrypt.hash('yalau2024', 10)
    
    const existing = await prisma.parametres.findFirst()
    if (!existing) {
      await prisma.parametres.create({ data: { seuilAlerte: 2000, prixParLitre: 700 } })
    }

    await prisma.user.upsert({
      where: { email: 'admin@yalau.com' },
      update: {},
      create: { nom: 'Admin YALAU', telephone: '0197000000', email: 'admin@yalau.com', password: hashedPassword, role: 'admin', statut: 'actif' }
    })

    res.json({ message: 'Users + Paramètres OK' })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/seed-camions', async (req, res) => {
  try {
    const prisma = require('./prisma/client')
    const camionsData = [
      { immatriculation: 'BJ-1234', marque: 'Isuzu NPR', capaciteCharges: 5, statut: 'disponible', latitude: 6.3654, longitude: 2.4183 },
      { immatriculation: 'BJ-5678', marque: 'Mercedes Actros', capaciteCharges: 10, statut: 'en_route', latitude: 9.3372, longitude: 2.6303 },
      { immatriculation: 'BJ-9012', marque: 'Renault Premium', capaciteCharges: 8, statut: 'en_panne', latitude: 6.4969, longitude: 2.6283 },
      { immatriculation: 'BJ-3456', marque: 'Iveco Daily', capaciteCharges: 3, statut: 'disponible', latitude: 6.3703, longitude: 2.3912 },
      { immatriculation: 'BJ-7890', marque: 'Isuzu FRR', capaciteCharges: 6, statut: 'en_route', latitude: 10.3045, longitude: 1.3795 },
    ]
    const chauffeursData = [
      { nom: 'Kouadio Jean', telephone: '0197111111', numeroPermis: 'PM-001', statut: 'disponible' },
      { nom: 'Mensah Paul', telephone: '0197222222', numeroPermis: 'PM-002', statut: 'en_mission' },
      { nom: 'Adjovi Marc', telephone: '0197333333', numeroPermis: 'PM-003', statut: 'disponible' },
      { nom: 'Bio Tom', telephone: '0197444444', numeroPermis: 'PM-004', statut: 'disponible' },
      { nom: 'Sossou Eric', telephone: '0197555555', numeroPermis: 'PM-005', statut: 'en_mission' },
    ]

    const camions = []
    for (const c of camionsData) {
      const camion = await prisma.camion.upsert({ where: { immatriculation: c.immatriculation }, update: {}, create: c })
      camions.push(camion)
    }
    for (let i = 0; i < chauffeursData.length; i++) {
      await prisma.chauffeur.upsert({
        where: { numeroPermis: chauffeursData[i].numeroPermis },
        update: {},
        create: { ...chauffeursData[i], camionId: camions[i].id }
      })
    }

    res.json({ message: '5 camions + 5 chauffeurs OK' })
  } catch (e) { res.status(500).json({ error: e.message }) }
})

app.get('/seed-data', async (req, res) => {
  try {
    const prisma = require('./prisma/client')
    const camions = await prisma.camion.findMany()
    const chauffeurs = await prisma.chauffeur.findMany()
    const villesDestination = ['Parakou', 'Porto-Novo', 'Natitingou', 'Possotomé']

    // Appros
    for (let semaine = 6; semaine >= 0; semaine--) {
      const litres = 4000 + Math.floor(Math.random() * 2000)
      const prix = 680 + Math.floor(Math.random() * 40)
      const d = new Date(); d.setDate(d.getDate() - semaine * 7)
      await prisma.approvisionnement.create({ data: { litres, prixParLitre: prix, coutTotal: litres * prix, date: d, fournisseur: 'SONACOP Cotonou', note: null } })
    }

    // Livraisons + ravitaillements (14 jours seulement pour éviter timeout)
    for (let jour = 7; jour >= 0; jour--) {
      const d = new Date(); d.setDate(d.getDate() - jour)
      const camion = camions[Math.floor(Math.random() * camions.length)]
      const chauffeur = chauffeurs.find(c => c.camionId === camion.id) || chauffeurs[0]
      const villeDest = villesDestination[Math.floor(Math.random() * villesDestination.length)]
      const statut = jour === 0 ? 'en_cours' : 'livree'

      const livraison = await prisma.livraison.create({
        data: { camionId: camion.id, chauffeurId: chauffeur.id, villeDepart: 'Cotonou', villeDestination: villeDest, date: d, statut }
      })

      const litres = 80 + Math.floor(Math.random() * 80)
      await prisma.ravitaillement.create({
        data: { camionId: camion.id, chauffeurId: chauffeur.id, litres, type: 'stock_interne', ville: 'Cotonou', date: d, cout: null, statut: null, livraisonId: livraison.id }
      })
    }

    res.json({ message: 'Appros + Livraisons + Ravitaillements OK' })
  } catch (e) { res.status(500).json({ error: e.message }) }
})