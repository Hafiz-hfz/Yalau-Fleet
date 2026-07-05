const prisma = require('../prisma/client')
  const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'yalau-recus',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
  },
})

const upload = multer({ storage })

exports.upload = upload.single('recu')


// Ajouter un ravitaillement
exports.create = async (req, res) => {
   console.log('body reçu:', req.body)
  console.log('fichier reçu:', req.file)
  try {
    const { camionId, chauffeurId, litres, type, ville, date, cout, livraisonId } = req.body
    const statut = type === 'station_externe' ? 'en_attente' : null  // AJOUTÉ
     const recu = req.file ? req.file.path : null // AJOUTÉ
    const camion = await prisma.camion.findUnique({ where: { id: parseInt(camionId) } })
    const chauffeur = await prisma.chauffeur.findUnique({ where: { id: parseInt(chauffeurId) } })
    const ravitaillement = await prisma.ravitaillement.create({
      data: {
        camionId: parseInt(camionId),
        chauffeurId: parseInt(chauffeurId),
        litres: parseFloat(litres),
        type,
        ville,
        date: new Date(date),
        cout: cout ? parseFloat(cout) : null,
        recu: recu || null,
        livraisonId: livraisonId ? parseInt(livraisonId) : null,
        statut  // pas besoin de || 'en_attente' maintenant
      }
    })
    // Activity
    await prisma.activite.create({
        data: {
          type: 'ravitaillement',
          action: 'created',
          titre: `${camion.immatriculation} — Ravitaillement ${type === 'stock_interne' ? 'Stock interne' : 'Station externe'}`,
          description: `${litres}L — ${ville} | ${chauffeur.nom}`,
          statut: type === 'station_externe' ? 'en_attente' : null
        }
      })
    res.status(201).json(ravitaillement)
  } catch (error) {
    console.log('Erreur create ravitaillement:', error.message)
    res.status(400).json({ error: error.message })
  }
}

// Afficher tous les ravitaillements
exports.getAll = async (req, res) => {
  try {
    const ravitaillements = await prisma.ravitaillement.findMany({
      include: {
        camion: true,
        chauffeur: true,
        livraison: true
      },
      orderBy: { date: 'desc' }
    })
    res.json(ravitaillements)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Modifier un ravitaillement
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { camionId, chauffeurId, litres, type, ville, date, cout, recu, livraisonId } = req.body
    const ravitaillement = await prisma.ravitaillement.update({
      where: { id: parseInt(id) },
      data: {
        camionId: parseInt(camionId),
        chauffeurId: parseInt(chauffeurId),
        litres: parseFloat(litres),
        type,
        ville,
        date: new Date(date),
        cout: cout ? parseFloat(cout) : null,
        recu: recu || null,
        livraisonId: livraisonId ? parseInt(livraisonId) : null,
      }
    })

    await prisma.activite.create({
      data: {
        type: 'ravitaillement',
        action: 'updated',
        titre: `${ravitaillement.camionId} — Ravitaillement modifié`,
        description: `${ravitaillement.litres}L — ${ravitaillement.ville}`,
        statut: ravitaillement.statut
      }
    })
    res.json(ravitaillement)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Supprimer un ravitaillement
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const ravitaillement = await prisma.ravitaillement.findUnique({
        where: { id: parseInt(id) },
        include: { camion: true }
      })
    await prisma.activite.create({
      data: {
        type: 'ravitaillement',
        action: 'deleted',
        titre: `${ravitaillement.camion.immatriculation} — Ravitaillement supprimé`,
        description: `${ravitaillement.litres}L — ${ravitaillement.ville}`,
        statut: 'deleted'
      }
    })
    await prisma.ravitaillement.delete({
      where: { id: parseInt(id) }
    })
    res.json({ message: 'Ravitaillement supprimé' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Stock actuel Cotonou
exports.getStock = async (req, res) => {
  try {
    const appros = await prisma.approvisionnement.findMany()
    const ravitaillements = await prisma.ravitaillement.findMany({
      where: { type: 'stock_interne' }
    })
    const totalAchete = appros.reduce((sum, a) => sum + a.litres, 0)
    const totalDistribue = ravitaillements.reduce((sum, r) => sum + r.litres, 0)
    const stockActuel = totalAchete - totalDistribue

    res.json({ totalAchete, totalDistribue, stockActuel })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Ajouter un approvisionnement
exports.createAppro = async (req, res) => {
  try {
    const { litres, prixParLitre, date,fournisseur, note  } = req.body
    const appro = await prisma.approvisionnement.create({
      data: {
        litres: parseFloat(litres),
        prixParLitre: parseFloat(prixParLitre),
        coutTotal: parseFloat(litres) * parseFloat(prixParLitre),
        date: new Date(date),
        fournisseur: fournisseur || null,
        note: note || null
      }
    })
    await prisma.activite.create({
      data: {
        type: 'approvisionnement',
        action: 'created',
        titre: `Approvisionnement stock Cotonou`,
        description: `${litres}L à ${prixParLitre} FCFA/L — Total: ${parseFloat(litres) * parseFloat(prixParLitre)} FCFA`,
        statut: 'validé'
      }
    })
    res.status(201).json(appro)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Historique des approvisionnements
exports.getAppros = async (req, res) => {
  try {
    const appros = await prisma.approvisionnement.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(appros)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}



// Top Conso

exports.getTopConsommateurs = async (req, res) => {
  try {
    const now = new Date()
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1) // AJOUTÉ
     const result = await prisma.ravitaillement.groupBy({
      by: ['camionId'],
      where: { date: { gte: debutMois } }, // AJOUTÉ
      _sum: { litres: true },
      orderBy: { _sum: { litres: 'desc' } },
      take: 3
    })


     const formatted = await Promise.all(result.map(async (r) => {
      const camion = await prisma.camion.findUnique({
        where: { id: r.camionId }
      })
      return {
        immatriculation: camion.immatriculation,
        totalLitres: r._sum.litres
      }
    }))

    res.json(formatted)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


// Calcule du stock par type ( interne et exter,e)
exports.getStatsByType = async (req, res) => {
  try {
    const now = new Date()
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1) // AJOUTÉ
    const interne = await prisma.ravitaillement.aggregate({
       where: { type: 'stock_interne', date: { gte: debutMois } }, // MODIFIÉ
      _sum: { litres: true }
    })

    const externe = await prisma.ravitaillement.aggregate({
     where: { type: 'station_externe', date: { gte: debutMois } }, // MODIFIÉ
      _sum: { litres: true, cout: true }
    })

    // AJOUTÉ : récupère le prix par litre depuis Paramètres
    const params = await prisma.parametres.findFirst()
    console.log('params:', params)
    console.log('prixParLitre:', params?.prixParLitre)
    console.log('litres interne:', interne._sum.litres)
    const prixParLitre = params ? params.prixParLitre : 0
    const coutInterne = (interne._sum.litres || 0) * prixParLitre
    console.log('coutInterne:', coutInterne)

    res.json({
      interne: {
        litres: interne._sum.litres || 0,
        cout: coutInterne
      },
      externe: {
        litres: externe._sum.litres || 0,
        cout: externe._sum.cout || 0,
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Endpoint pour les cards

// Stock actual

exports.getStockEvolution = async (req, res) => {
  try {
    const now = new Date()
    const debutSemaineActuelle = new Date(now)
    debutSemaineActuelle.setDate(now.getDate() - 7)
    
    const debutSemainePrecedente = new Date(now)
    debutSemainePrecedente.setDate(now.getDate() - 14)

    // Appros semaine actuelle
    const approActuelle = await prisma.approvisionnement.aggregate({
      where: { date: { gte: debutSemaineActuelle } },
      _sum: { litres: true }
    })

    // Appros semaine précédente
    const approPrecedente = await prisma.approvisionnement.aggregate({
      where: { date: { gte: debutSemainePrecedente, lt: debutSemaineActuelle } },
      _sum: { litres: true }
    })

    const actuelle = approActuelle._sum.litres || 0
    const precedente = approPrecedente._sum.litres || 0

    let evolution = 0
    if (precedente > 0) {
      evolution = ((actuelle - precedente) / precedente) * 100
    }

    res.json({ evolution: Math.round(evolution) })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Cout du mois 

exports.getCoutMois = async (req, res) => {
  try {
    const now = new Date()
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)

    // Coût appros du mois
    const appros = await prisma.approvisionnement.aggregate({
      where: { date: { gte: debutMois } },
      _sum: { coutTotal: true }
    })

    // Coût stations externes du mois
    const externe = await prisma.ravitaillement.aggregate({
      where: { type: 'station_externe', date: { gte: debutMois } },
      _sum: { cout: true }
    })

    const coutTotal = (appros._sum.coutTotal || 0) + (externe._sum.cout || 0)

    res.json({ coutTotal })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// total littres mois 

exports.getVolumeMois = async (req, res) => {
  try {
    const now = new Date()
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1) // MODIFIÉ


    const result = await prisma.ravitaillement.aggregate({
       where: { date: { gte: debutMois } }, // MODIFIÉ
      _sum: { litres: true }
    })

    res.json({ volumeTotal: result._sum.litres || 0 })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 

exports.getStockMois = async (req, res) => {
  try {
    const now = new Date()
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)

    // Total acheté ce mois
    const appros = await prisma.approvisionnement.aggregate({
      where: { date: { gte: debutMois } },
      _sum: { litres: true }
    })

    // Total distribué ce mois (stock interne uniquement)
    const distribue = await prisma.ravitaillement.aggregate({
      where: { type: 'stock_interne', date: { gte: debutMois } },
      _sum: { litres: true }
    })

    const totalAchete = appros._sum.litres || 0
    const totalDistribue = distribue._sum.litres || 0
    const stockRestant = totalAchete - totalDistribue

    res.json({ totalAchete, totalDistribue, stockRestant })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

