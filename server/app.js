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

app.get('/seed-historique', async (req, res) => {
  try {
    const prisma = require('./prisma/client')
    const camions = await prisma.camion.findMany()
    
    for (let j = 6; j >= 0; j--) {
      for (const camion of camions) {
        const d = new Date()
        d.setDate(d.getDate() - j)
        await prisma.historiqueStatutCamion.create({
          data: { camionId: camion.id, statut: camion.statut, date: d }
        })
      }
    }
    res.json({ message: `Historique OK pour ${camions.length} camions` })
  } catch (e) { res.status(500).json({ error: e.message }) }
})
 
module.exports = app


 