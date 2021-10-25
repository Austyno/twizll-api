const router = require('express').Router()
const authenticated = require('../../middleware/authenticated')

const signUp = require('../../controllers/auth/signUpController')
const socialReg = require('../../controllers/auth/socialRegController')
const verifyEmail = require('../../controllers/auth/verifyEmailController')
const login = require('../../controllers/auth/loginController')
const forgotPassword = require('../../controllers/auth/forgotPasswordController')
const logOut = require('../../controllers/auth/logoutController')

const {
  resetPassWordForm,
  resetPassword,
} = require('../../controllers/auth/resetPasswordController')

const googleAuth = require('../../controllers/auth/googleLogin')
const showLogin = require('../../controllers/auth/testGoogle')
const userInfo = require('../../controllers/auth/userInfo')

router.route('/signup').post(signUp)
router.route('/signup/social').post(socialReg)
router.route('/login').post(login)
router.route('/signup/verifyemail/:code').get(verifyEmail)
router.route('/forgotpassword').post(forgotPassword)
router
  .route('/forgotpassword/:resetCode')
  .get(resetPassWordForm)
  .post(resetPassword)

router.route('/google').get(googleAuth)
router.route('/me').get(userInfo)
router.route('/test').get(showLogin)

router.route('/logout').post(authenticated,logOut)

module.exports = router
