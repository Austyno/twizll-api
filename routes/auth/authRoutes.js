const router = require('express').Router()

const signUp = require('../../controllers/auth/signUpController')
const socialReg = require('../../controllers/auth/socialRegController')
const verifyEmail = require('../../controllers/auth/verifyEmailController')
const login = require('../../controllers/auth/loginController')
const forgotPassword = require('../../controllers/auth/forgotPasswordControllerOld')
const logOut = require('../../controllers/auth/logoutController')
const socialLogin = require('../../controllers/auth/socialLoginController')
const refreshAccess = require('../../controllers/auth/refreshAccessToken')
const getAuth = require('../../middleware/getAuth')
const verifyOtp = require('../../controllers/auth/verifyOtp')
const getOtp = require('../../controllers/auth/sendOtp')

const {
  resetPassWordForm,
  resetPassword,
} = require('../../controllers/auth/resetPasswordController')
const changePassword = require('../../controllers/auth/changePasswordController')

router.route('/signup').post(signUp)
router.route('/signup/social').post(socialReg)
router.route('/login').post(login)
router.route('/login/social').post(socialLogin)
router.route('/signup/verifyemail/:code').get(verifyEmail)
router.route('/forgotpassword').post(forgotPassword)
router
  .route('/forgotpassword/:resetCode')
  .get(resetPassWordForm)
  .post(resetPassword)

router.route('/refresh-access').post(refreshAccess)

// router.route('/google').get(googleAuth)
// router.route('/me').get(userInfo)
// router.route('/test').get(showLogin)
router.route('/change-password').post(getAuth, changePassword)

router.route('/logout').post(logOut)
router.route('/verify-otp').post(verifyOtp)
router.route('/send-otp').post(getOtp)

module.exports = router
