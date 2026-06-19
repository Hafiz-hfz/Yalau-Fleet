const express = require('express')
const router = express.Router()
const livraisonsController = require('../controllers/livraisons.controller')


router.get('/kpi', livraisonsController.getKpiLivraisons)

// General
router.get('/', livraisonsController.getAll)
router.post('/', livraisonsController.create)
router.put('/:id', livraisonsController.update)
router.delete('/:id', livraisonsController.delete)

module.exports = router