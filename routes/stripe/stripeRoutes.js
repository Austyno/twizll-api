const router = require('express').Router()
const express = require('express')
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')
const webHooks = require('../../controllers/stripe/webHooksController')
const path = require('path')
const {
  createSubscription,
  showSubpage,
  pubKey,
} = require('../../controllers/stripe/createSubController')
const startSub = require('../../controllers/stripe/startSub')
const checkOut = require('../../controllers/stripe/checkoutController')
const updateSubStatus = require('../../controllers/stripe/updateSubStatusController')

//subscription
router
  .route('/start-sub')
  .post(authenticated('seller'), authRole('seller'), startSub)
router.route('/subscribe').post(createSubscription)
router.route('/pay-sub').get(showSubpage)
router.route('/config').get(pubKey)
router.route('/updateSubStatus').post(updateSubStatus)

//checkout
router
  .route('/checkout')
  .post(authenticated('buyer'), authRole('buyer'), checkOut)

router.get('/subscribe/success', (req, res) => {
  res.render(path.join(__dirname, '../../public/views', 'success.ejs'))
})
router.get('/failed', (req, res) => {
  res.send('Payment Failed')
})

module.exports = router
