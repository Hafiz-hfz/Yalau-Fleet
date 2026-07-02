// const { PrismaClient } = require('@prisma/client')
// const prisma = new PrismaClient({
//   datasourceUrl: process.env.DATABASE_URL,
// })
// module.exports = prisma
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })

const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })
console.log('prisma client créé:', typeof prisma) // AJOUTÉ

module.exports = prisma
 
 


