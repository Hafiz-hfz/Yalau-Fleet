const prisma = require('../prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' })

    const valide = await bcrypt.compare(password, user.password)
    if (!valide) return res.status(401).json({ error: 'Email ou mot de passe incorrect' })

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({ token, user: { id: user.id, nom: user.nom, email: user.email, role: user.role } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}