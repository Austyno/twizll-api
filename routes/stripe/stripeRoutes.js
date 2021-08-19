const router = require('express').Router()
const express = require('express')
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')
const webHooks = require('../../controllers/stripe/webHooksController')
const subscribe = require('../../controllers/stripe/createSubController')
const stripe = require('stripe')

const Stripe = stripe(process.env.STRIPE_SECRET_KEY)

router.route('/subscribe').post(authenticated, authRole('seller'), subscribe)

router.get('/success', (req, res) => {
  res.send('Payment successful')
})
router.get('/failed', (req, res) => {
  res.send('Payment successful')
})

module.exports = router
