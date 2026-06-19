const express = require('express')
const router = express.Router()
const parametresController = require('../controllers/parametres.controller')

router.get('/', parametresController.get)
router.put('/', parametresController.update)

module.exports = router