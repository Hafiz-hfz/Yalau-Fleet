// const app = require('./app')
// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => {
//   console.log(`Serveur démarré sur le port ${PORT}`)
// })

console.log("START SERVER FILE")

const express = require("express")
const app = express()

app.get("/", (req, res) => {
  res.send("OK")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT)
})