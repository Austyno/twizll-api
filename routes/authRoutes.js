const router = require('express').Router()

const signUp = require('../controllers/auth/signUpController')
const verifyEmail = require('../controllers/auth/verifyEmailController')
const login = require('../controllers/auth/loginController')




router.route('/signup').post(signUp)

router.route('/signup/verifyemail/:code').get(verifyEmail)
router.route('/login').post(login)

module.exports = router