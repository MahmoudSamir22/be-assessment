const router = require('express').Router()

const {signUp} = require('../controllers/userController')

router.post('/signup', signUp)

module.exports = router