const Error = require('../../utils/errorResponse')
const stripeUtil = require('../../utils/stripe/Stripe')
const Seller = require('../../models/sellerModel')
const path = require('path')

const createSubscription = async (req, res, next) => {
  const { price, stripeid } = req.body

  const user = await Seller.findOne({ stripe_customer_id: stripeid })

  try {
    const subscription = await stripeUtil.createSubscriptionSession(
      stripeid,
      price
    )
    const data = {
      subscriptionId: subscription.id,
      clientSecrete: subscription.latest_invoice.payment_intent.client_secret,
      amount: subscription.latest_invoice.payment_intent.amount,
      currency: subscription.latest_invoice.currency,
      fullName: user.fullName,
      email:user.email
    }
    res.status(200).json({
      status: 'success',
      message: 'subscription started',
      data,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

const showSubpage = (req, res, next) => {
  res.render(path.join(__dirname, '../../public/views', 'paySub.ejs'))
}

const pubKey = (req, res, next) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  })
}

module.exports = { createSubscription, showSubpage, pubKey }
