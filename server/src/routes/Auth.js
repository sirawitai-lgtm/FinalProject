const express    = require('express')
const router     = express.Router()
const controller = require('../controllers/Auth')

router.post('/login',    controller.login)
router.post('/register', controller.register)
router.get('/users',     controller.getUsers)

module.exports = router
