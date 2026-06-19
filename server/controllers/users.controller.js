const prisma = require('../prisma/client')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Créer un utilisateur
exports.create = async (req, res) => {
  try {
    const { nom, telephone, email, password, role, statut } = req.body
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { nom, telephone, email, password: hash, role, statut }
    })
    const { password: _, ...userSansPassword } = user
    res.status(201).json(userSansPassword)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    if (user.statut === 'inactif') return res.status(403).json({ error: 'Compte désactivé' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ error: 'Email ou mot de passe incorrect' })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    const { password: _, ...userSansPassword } = user
    res.json({ token, user: userSansPassword })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Afficher tous les utilisateurs
exports.getAll = async (req, res) => {
  try {
     console.log('getAll users appelé')
    const users = await prisma.user.findMany({
      select: { id: true, nom: true, telephone: true, email: true, role: true, statut: true, createdAt: true }
    })
     console.log('users:', users)
    res.json(users)
  } catch (error) {
     console.log('Erreur getAll:', error.message)
    res.status(500).json({ error: error.message })
  }
}

// Modifier un utilisateur
exports.update = async (req, res) => {
  try {
    const { id } = req.params
    const { nom, telephone, email, role, statut } = req.body

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { nom, telephone, email, role, statut }
    })
    const { password: _, ...userSansPassword } = user
    res.json(userSansPassword)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Supprimer un utilisateur
exports.delete = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.user.delete({ where: { id: parseInt(id) } })
    res.json({ message: 'Utilisateur supprimé' })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}