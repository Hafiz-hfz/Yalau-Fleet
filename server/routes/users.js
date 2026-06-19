const express = require('express')
const router = express.Router()
const usersController = require('../controllers/users.controller')

router.get('/', usersController.getAll)
router.post('/', usersController.create)
router.post('/login', usersController.login)
router.put('/:id', usersController.update)
router.delete('/:id', usersController.delete)

module.exports = router