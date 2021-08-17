const router = require('express').Router()
const express = require('express')
const authRole = require('../../middleware/authRole')
const authenticated = require('../../middleware/authenticated')
const webHooks = require('../../controllers/stripe/webHooksController')
const subscribe = require('../../controllers/stripe/createSubController')
const stripe = require('stripe')

const Stripe = stripe(process.env.STRIPE_SECRET_KEY)

router
  .route('/seller/subscribe')
  .post(authenticated, authRole('seller'), subscribe)

// router.post(
//   '/webhook',
//   express.raw({ type: 'application/json' }),
//   (req, res) => {
//     const sig = req.headers['stripe-signature']

//     let event
//     try {
//       event = Stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_TEST_WEBHOK_SECRET
//       )
//     } catch (err) {
//       // On error, log and return the error message
//       console.log(`❌ Error message: ${err.message}`)
//       return res.status(400).send(`Webhook Error: ${err.message}`)
//     }

//     // Successfully constructed event
//     console.log('✅ Success:', event.id)
//     console.log(event.data.object)

//     // Return a response to acknowledge receipt of the event
//     res.json({ received: true })
//   }
// )

module.exports = router
