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
const stripe = require('stripe')

const Stripe = stripe(process.env.STRIPE_SECRET_KEY)

router.route('/subscribe').post(createSubscription)
router.route('/pay-sub').get(showSubpage)
router.route('/config').get(pubKey)

router.get('/subscribe/success', (req, res) => {
  res.render(path.join(__dirname, '../../public/views', 'success.ejs'))
})
router.get('/failed', (req, res) => {
  res.send('Payment Failed')
})

module.exports = router
