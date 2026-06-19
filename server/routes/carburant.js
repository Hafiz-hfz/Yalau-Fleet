const express = require('express')
const router = express.Router()
const carburantController = require('../controllers/carburant.controller')
const { upload } = require('../controllers/carburant.controller')

// Routes fixes en premier
router.get('/stock', carburantController.getStock)
router.get('/appro', carburantController.getAppros)
router.post('/appro', carburantController.createAppro)
router.get('/top-consommateurs', carburantController.getTopConsommateurs)
router.get('/stats-type', carburantController.getStatsByType)
router.get('/stock-evolution', carburantController.getStockEvolution)
router.get('/cout-mois', carburantController.getCoutMois)
router.get('/volume-mois', carburantController.getVolumeMois)
router.get('/stock-mois', carburantController.getStockMois)

// Routes générales
router.get('/', carburantController.getAll)
router.post('/', upload, carburantController.create)

// Routes avec paramètre en dernier
router.put('/:id', carburantController.update)
router.delete('/:id', carburantController.delete)

module.exports = router