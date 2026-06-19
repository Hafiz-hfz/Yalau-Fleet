 const prisma = require('../prisma/client')

// Ajouter une livraison
exports.create = async (req, res) => {
  try {
    const {  camionId, chauffeurId, villeDepart, villeDestination, date, statut } = req.body
    const camion = await prisma.camion.findUnique({ where: { id: parseInt(camionId) } })
    const chauffeur = await prisma.chauffeur.findUnique({ where: { id: parseInt(chauffeurId) } })
    const livraison = await prisma.livraison.create({
      data: {
        camionId: parseInt(camionId),
        chauffeurId: parseInt(chauffeurId),
        villeDepart,
        villeDestination,
        date: new Date(date),
        statut
      }
    })
    // activity
    await prisma.activite.create({
      data: {
        type: 'livraison',
        action: 'created',
        titre: `${camion.immatriculation} — Nouvelle livraison`,
        description: `${villeDepart} → ${villeDestination} | ${chauffeur.nom}`,
        statut: statut || 'en_attente'
      }
    })
    res.status(201).json(livraison)
  } catch (error) {
    console.log('Erreur create livraison:', error.message)
    res.status(400).json({ error: error.message })
  }
}

// Afficher toutes les livraisons
exports.getAll = async (req, res) => {
  try {
    const livraisons = await prisma.livraison.findMany({
      include: {
        camion: true,
        chauffeur: true
      }
    })
    res.json(livraisons)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Modifier le statut
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { camionId, chauffeurId, villeDepart, villeDestination, date, statut } = req.body
    const livraison = await prisma.livraison.update({
      where: { id: parseInt(id) },
      data: { 
        camionId: parseInt(camionId),
        chauffeurId: parseInt(chauffeurId),
        villeDepart,
        villeDestination,
        date: new Date(date),
        statut
      }
    })
    await prisma.activite.create({
      data: {
        type: 'livraison',
        action: 'updated',
        titre: `Livraison — Statut mis à jour`,
        description: `${livraison.villeDepart} → ${livraison.villeDestination}`,
        statut: livraison.statut
      }
    })
    res.json(livraison)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// Supprimer
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const livraison = await prisma.livraison.findUnique({ 
        where: { id: parseInt(id) },
        include: { camion: true }
      })

      await prisma.activite.create({
          data: {
            type: 'livraison',
            action: 'deleted',
            titre: `${livraison.camion.immatriculation} — Livraison supprimée`,
            description: `${livraison.villeDepart} → ${livraison.villeDestination}`,
            statut: 'deleted'
          }
        })
    await prisma.livraison.delete({
      where: { id: parseInt(id) },
      
    })
    res.json({ message: 'Livraison supprimée' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// KPI

exports.getKpiLivraisons = async (req, res) => {
  try {
    const now = new Date()
    const debutAujourdhui = new Date()
    debutAujourdhui.setHours(0, 0, 0, 0) // minuit ce matin

     const debutHier = new Date()
    debutHier.setDate(debutHier.getDate() - 1)
    debutHier.setHours(0, 0, 0, 0) // minuit hier
    // Livraisons Today (24h)

    const total24h = await prisma.livraison.count({
      where: { date: { gte: debutAujourdhui } }
    })

     // Livraisons hier (24h-48h)
    const totalHier = await prisma.livraison.count({
      where: { date: { gte: debutHier, lt: debutAujourdhui } }
    })

     // Calcul évolution
    let evolution = 0
    if (totalHier > 0) {
      evolution = Math.round(((total24h - totalHier) / totalHier) * 100)
    }

    // En cours

    const enCours = await prisma.livraison.count({
      where: { statut: 'en_cours' }
      })

    // Cout Du mois 

    const coutTotal = await prisma.ravitaillement.aggregate({
        where: { 
          type: 'station_externe',
          date: { gte: debutAujourdhui }
        },
        _sum: { cout: true },
        _count: { id: true }
      })

     

      // Cout carburant moyen
      const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)

      // Coût externe du mois
      const externe = await prisma.ravitaillement.aggregate({
        where: { type: 'station_externe', date: { gte: debutMois } },
        _sum: { cout: true }
      })

      // Litres internes du mois
      const interne = await prisma.ravitaillement.aggregate({
        where: { type: 'stock_interne', date: { gte: debutMois } },
        _sum: { litres: true }
      })

      // Prix par litre depuis Paramètres
      const params = await prisma.parametres.findFirst()
      const prixParLitre = params ? params.prixParLitre : 0

      // Coût interne = litres × prix/litre
      const coutInterne = (interne._sum.litres || 0) * prixParLitre
      const coutExterne = externe._sum.cout || 0
      const coutTotalMois = coutInterne + coutExterne

      // Nombre de livraisons du mois
      const nbLivraisons = await prisma.livraison.count({
        where: { date: { gte: debutMois } }
      })

      const coutMoyen = nbLivraisons > 0 ? Math.round(coutTotalMois / nbLivraisons) : 0

      // Taux de réussite

      const totalMois = await prisma.livraison.count({
        where: { date: { gte: debutMois } }
      })

      const livrees = await prisma.livraison.count({
        where: { date: { gte: debutMois }, statut: 'livree' }
      })

      const tauxReussite = totalMois > 0 ? Math.round((livrees / totalMois) * 100) : 0

      // Evolution cout moyen carburant
      const debutMoisPrecedent = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const finMoisPrecedent = new Date(now.getFullYear(), now.getMonth(), 1)

      const externePrecedent = await prisma.ravitaillement.aggregate({
        where: { type: 'station_externe', date: { gte: debutMoisPrecedent, lt: finMoisPrecedent } },
        _sum: { cout: true }
      })
      const internePrecedent = await prisma.ravitaillement.aggregate({
        where: { type: 'stock_interne', date: { gte: debutMoisPrecedent, lt: finMoisPrecedent } },
        _sum: { litres: true }
      })
      const coutTotalPrecedent = (externePrecedent._sum.cout || 0) + ((internePrecedent._sum.litres || 0) * prixParLitre)

      const nbLivraisonsPrecedent = await prisma.livraison.count({
        where: { date: { gte: debutMoisPrecedent, lt: finMoisPrecedent } }
      })

      const coutMoyenPrecedent = nbLivraisonsPrecedent > 0 ? Math.round(coutTotalPrecedent / nbLivraisonsPrecedent) : 0

      let evolutionCout = 0
      if (coutMoyenPrecedent > 0) {
        evolutionCout = Math.round(((coutMoyen - coutMoyenPrecedent) / coutMoyenPrecedent) * 100)
      }




    res.json({ total24h,  totalHier, evolution, enCours , coutMoyen ,tauxReussite, evolutionCout  })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
