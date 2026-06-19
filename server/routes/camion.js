const express = require('express')
const router = express.Router()
const camionsController = require('../controllers/camions.controller')

router.get('/kpi', camionsController.getKpiCamions)

router.post('/', camionsController.create)//insert
router.get('/', camionsController.getAll)//select
router.put('/:id', camionsController.update) // update
router.delete('/:id', camionsController.delete) // delete

module.exports = router