// const app = require('./app')
// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur le port ${PORT}`)
// })

console.log("ENV PORT =", process.env.PORT)
const app = require('./app')

const PORT = process.env.PORT || 8080

app.listen(PORT, "0.0.0.0", () => {
  console.log("Serveur démarré sur le port", PORT)
})
 