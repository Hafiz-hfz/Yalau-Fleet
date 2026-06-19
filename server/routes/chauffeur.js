const express = require('express')
const router = express.Router()
const chauffeursController = require('../controllers/chauffeurs.controller')


router.get('/kpi', chauffeursController.getKpiChauffeurs)


router.get('/', chauffeursController.getAll)
router.post('/', chauffeursController.create)
router.put('/:id', chauffeursController.update)
router.delete('/:id', chauffeursController.delete)

module.exports = router