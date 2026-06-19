const prisma = require('../prisma/client')
exports.getKpi = async (req, res) => {
    try {
         const now = new Date()
         const debutJour = new Date()
         debutJour.setHours(0, 0, 0, 0)
         const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
          // Card 1 — Camions actifs
         const totalCamions = await prisma.camion.count()
         const camionsActifs = await prisma.camion.count({
         where: { statut: { in: ['disponible', 'en_route'] } }
         })
          // Card 2 — Livraisons du jour
        const livraisonsJour = await prisma.livraison.count({
        where: { date: { gte: debutJour } }
        })

         // Card 3 — Volume carburant du mois
        const volumeMois = await prisma.ravitaillement.aggregate({
        where: { date: { gte: debutMois } },
        _sum: { litres: true }
        })

          // Card 4 — Coût carburant du mois
    const externe = await prisma.ravitaillement.aggregate({
      where: { type: 'station_externe', date: { gte: debutMois } },
      _sum: { cout: true }
    })
    const interne = await prisma.ravitaillement.aggregate({
      where: { type: 'stock_interne', date: { gte: debutMois } },
      _sum: { litres: true }
    })
    const params = await prisma.parametres.findFirst()
    const prixParLitre = params ? params.prixParLitre : 0
    const coutMois = (externe._sum.cout || 0) + ((interne._sum.litres || 0) * prixParLitre)
    res.json({
      camionsActifs,
      totalCamions,
      livraisonsJour,
      volumeMois: volumeMois._sum.litres || 0,
      coutMois
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }

}

exports.getActivites = async (req, res) => {
  try {
    const activites = await prisma.activite.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    res.json(activites)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getRavitaillementsParJour = async (req, res) => {
  try {
    const il_y_a_7_jours = new Date()
    il_y_a_7_jours.setDate(il_y_a_7_jours.getDate() - 7)

    const ravitaillements = await prisma.ravitaillement.findMany({
      where: { date: { gte: il_y_a_7_jours } },
      select: { date: true }
    })

    const compteurs = {}
    ravitaillements.forEach(r => {
      const jour = new Date(r.date).toLocaleDateString('fr-FR', { weekday: 'short' })
     
      compteurs[jour] = (compteurs[jour] || 0) + 1
    })

    res.json(compteurs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// flottes statuts

exports.getStatutFlotte = async (req, res) => {
  try {
    const enRoute = await prisma.camion.count({ where: { statut: 'en_route' } })
    const disponible = await prisma.camion.count({ where: { statut: 'disponible' } })
    const enPanne = await prisma.camion.count({ where: { statut: 'en_panne' } })
    const total = enRoute + disponible + enPanne

    res.json({ enRoute, disponible, enPanne, total })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}