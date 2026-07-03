const prisma = require('../prisma/client') //importe l'instance Prisma qu'on a créée , ca    connecte à PostgreSQL


// insertion dans camion (insert into)
exports.create = async (req, res) => { // create est importer pour etre utiliser 
  try {
    console.log("POST reçu :", req.body);
    const {  immatriculation, marque, capaciteCharges,statut,  latitude, longitude } = req.body // ce que reat envoie 
    const camion = await prisma.camion.create({ // insère une nouvelle ligne dans la table Camion avec ces données.
      data: { immatriculation, marque, capaciteCharges,statut, 
              latitude: latitude ? parseFloat(latitude) : null,
              longitude: longitude ? parseFloat(longitude) : null
       } //ce qu'on renvoie à React.
    })

    // AJOUTÉ : log activité
    await prisma.activite.create({
      data: {
        type: 'camion',
        action: 'created',
        titre: `${immatriculation} — Nouveau véhicule ajouté`,
        description: `${marque} — ${capaciteCharges} tonnes`,
        statut: statut || 'disponible'
      }
    })
    res.status(201).json(camion)
  } catch (error) {
    console.log('Erreur create camion:', error.message)
    res.status(400).json({ error: error.message })
  }
}

// Affichage : (Select all = findMany())

exports.getAll = async (req, res) => {
  try {
     const camions = await prisma.camion.findMany({
      include: { chauffeurs: true } // AJOUTÉ
    })
    res.json(camions)

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update (edit)

exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { immatriculation, marque, capaciteCharges, statut, latitude, longitude  } = req.body
    const camion = await prisma.camion.update({
      
      where: { id: parseInt(id) },
      data: { immatriculation, marque, capaciteCharges, statut, 
         latitude: latitude ? parseFloat(latitude) : null,
         longitude: longitude ? parseFloat(longitude) : null
       }
    })
    // pour calculer les taux disponibiliter cam
    await prisma.historiqueStatutCamion.create({
    data: { camionId: camion.id, statut: camion.statut }
    })

    // AJOUTÉ : log activité
      await prisma.activite.create({
        data: {
          type: 'camion',
          action: 'updated',
          titre: `${camion.immatriculation} — Véhicule modifié`,
          description: `Statut : ${camion.statut}`,
          statut: camion.statut
        }
      })
    res.json(camion)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete 

exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    // AJOUTÉ : log activité (avant la suppression)
    const camion = await prisma.camion.findUnique({ where: { id: parseInt(id) } })
    await prisma.activite.create({
      data: {
        type: 'camion',
        action: 'deleted',
        titre: `${camion.immatriculation} — Véhicule supprimé`,
        description: `${camion.marque}`,
        statut: 'deleted'
      }
    })
     
    
    await prisma.camion.delete({
      where: { id: parseInt(id) }
    })
    res.json({ message: 'Camion supprimé' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// Kpis

exports.getKpiCamions = async (req, res) => {
  try {
    const total = await prisma.camion.count()
    const operationnels = await prisma.camion.count({
       where: { statut: { in: ['disponible', 'en_route'] } }
    })
    const enMaintenance = await prisma.camion.count({
      where: { statut: 'en_panne' }
    })

    const enRoute = await prisma.camion.count({
      where: { statut: 'en_route' }
    })

    


    res.json({ 
          total, 
          operationnels,
          enMaintenance,
          enRoute,
         
     })
    
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Taux de utilisation et dispo

exports.getTauxSemaine = async (req, res) => {
  try {
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
    const camions = await prisma.camion.findMany()
    const resultat = []

    for (let i = 6; i >= 0; i--) {
      const debut = new Date()
      debut.setDate(debut.getDate() - i)
      debut.setHours(0, 0, 0, 0)
      const fin = new Date(debut)
      fin.setHours(23, 59, 59, 999)

      let enPanne = 0, enRoute = 0

      for (const camion of camions) {
        const dernierStatut = await prisma.historiqueStatutCamion.findFirst({
          where: { camionId: camion.id, date: { lte: fin } },
          orderBy: { date: 'desc' }
        })
        const statut = dernierStatut ? dernierStatut.statut : camion.statut
        if (statut === 'en_panne') enPanne++
        if (statut === 'en_route') enRoute++
      }

      const total = camions.length
      const disponibles = total - enPanne
      resultat.push({
        jour: jours[debut.getDay() === 0 ? 6 : debut.getDay() - 1],
        tauxDispo: total > 0 ? Math.round((disponibles / total) * 100) : 0,
        tauxUtilisation: disponibles > 0 ? Math.round((enRoute / disponibles) * 100) : 0
      })
    }

    res.json(resultat)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}