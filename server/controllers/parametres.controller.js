const prisma = require('../prisma/client')
console.log('prisma.parametres:', typeof prisma.parametres)

// Récupérer les paramètres
exports.get = async (req, res) => {
    console.log('get parametres appelé, prisma.parametres:', typeof prisma.parametres)
  try {
    let params = await prisma.parametres.findFirst()
    if (!params) {
      params = await prisma.parametres.create({
        data: { seuilAlerte: 0, prixParLitre: 0 }
      })
    }
    res.json(params)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Mettre à jour les paramètres
exports.update = async (req, res) => {
  try {
    const { seuilAlerte, prixParLitre } = req.body
    let params = await prisma.parametres.findFirst()
    if (!params) {
      params = await prisma.parametres.create({
        data: { seuilAlerte: parseFloat(seuilAlerte), prixParLitre: parseFloat(prixParLitre) }
      })
    } else {
      params = await prisma.parametres.update({
        where: { id: params.id },
        data: { seuilAlerte: parseFloat(seuilAlerte), prixParLitre: parseFloat(prixParLitre) }
      })
    }
    res.json(params)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}