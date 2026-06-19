const prisma = require('../prisma/client') //importe l'instance Prisma qu'on a créée , ca    connecte à PostgreSQL

// insertion dans chauffeur (insert into)
exports.create = async (req, res) => { // create est importer pour etre utiliser 
     console.log('body reçu:', req.body) // ← ici
  try {
    const {  nom, telephone, numeroPermis, statut, camionId  } = req.body // ce que reat envoie 
    const chauffeur = await prisma.chauffeur.create({ // insère une nouvelle ligne dans la table chauffeur avec ces données.
      data: { 
        nom, 
        telephone, 
        numeroPermis, 
        statut, 
        camionId: camionId ? parseInt(camionId) : null  
    } //ce qu'on renvoie à React.
    })

    // Activity
        await prisma.activite.create({
      data: {
        type: 'chauffeur',
        action: 'created',
        titre: `${nom} — Nouveau chauffeur ajouté`,
        description: `Tél: ${telephone}`,
        statut: statut || 'actif'
      }
    })
    res.status(201).json(chauffeur) 
  } catch (error) {
    console.log('Erreur create chauffeur:', error.message)
    res.status(400).json({ error: error.message })
  }
}



// Affichage
exports.getAll = async (req, res) => {
  try {
    const chauffeurs = await prisma.chauffeur.findMany({
      include: { camion: true } // inclut les infos du camion assigné
    })

    res.json(chauffeurs)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { nom, telephone, numeroPermis, statut, camionId } = req.body
    const chauffeur = await prisma.chauffeur.update({
      where: { id: parseInt(id) },
      data: { 
        nom, 
        telephone, 
        numeroPermis, 
        statut,
        camionId: camionId ? parseInt(camionId) : null
      }
    })

    // Après la mise à jour
    await prisma.activite.create({
      data: {
        type: 'chauffeur',
        action: 'updated',
        titre: `${chauffeur.nom} — Chauffeur modifié`,
        description: `Statut : ${chauffeur.statut}`,
        statut: chauffeur.statut
      }
    })
    res.json(chauffeur)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Delete
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    const chauffeur = await prisma.chauffeur.findUnique({ where: { id: parseInt(id) } })
await prisma.activite.create({
  data: {
    type: 'chauffeur',
    action: 'deleted',
    titre: `${chauffeur.nom} — Chauffeur supprimé`,
    description: `Permis : ${chauffeur.numeroPermis}`,
    statut: 'deleted'
  }
})
    await prisma.chauffeur.delete({
      where: { id: parseInt(id) }
    })
    res.json({ message: 'Chauffeur supprimé' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


// Kpi

// Disponible (11 juin)

exports.getKpiChauffeurs = async (req, res) => {
  try {
    const total = await prisma.chauffeur.count()
    const disponibles = await prisma.chauffeur.count({
      where: { statut: 'disponible' }
    })
    const disponibilite = total > 0 ? Math.round((disponibles / total) * 100) : 0

    const debutHier = new Date()
    debutHier.setDate(debutHier.getDate() - 1)
    debutHier.setHours(0, 0, 0, 0)

    const debutAujourdhui = new Date()
    debutAujourdhui.setHours(0, 0, 0, 0)

    const totalHier = await prisma.chauffeur.count({
      where: { createdAt: { lt: debutAujourdhui } }
    })
    const disponiblesHier = await prisma.chauffeur.count({
      where: { statut: 'disponible', createdAt: { lt: debutAujourdhui } }
    })
    const disponibiliteHier = totalHier > 0 ? Math.round((disponiblesHier / totalHier) * 100) : 0
    const evolutionDispo = disponibilite - disponibiliteHier

    const enMission = await prisma.chauffeur.count({
  where: { statut: 'en_mission' }
})

    res.json({ disponibilite, disponibles, total, evolutionDispo, enMission })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// 

