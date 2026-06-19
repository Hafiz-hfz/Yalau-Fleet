const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboard.controller')
router.get('/activites', dashboardController.getActivites)
router.get('/kpi', dashboardController.getKpi)
router.get('/ravitaillements-jour', dashboardController.getRavitaillementsParJour)
router.get('/statut-flotte', dashboardController.getStatutFlotte)

module.exports = router