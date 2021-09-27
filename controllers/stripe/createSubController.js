const Error = require('../../utils/errorResponse')
const stripeUtil = require('../../utils/stripe/Stripe')
const User = require('../../models/userModel')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const path = require('path')
const url = require('url')
const child = require('child_process')
const ejs = require('ejs')
const open = require('open')

const createSubscription = async (req, res, next) => {
  const { price, token } = req.body

  const verify = jwt.verify(token, process.env.JWT_SECRET)

  if (!verify) {
    return next(new Error('token is invalid', 400))
  }

  const user = await User.findOne({ token })

  try {
    const subscription = await stripeUtil.createSubscriptionSession(
      user.stripe_customer_id,
      price
    )
    const data = {
      subscriptionId: subscription.id,
      clientSecrete: subscription.latest_invoice.payment_intent.client_secret,
      amount: subscription.latest_invoice.payment_intent.amount,
      currency: subscription.latest_invoice.currency,
      fullName: user.fullName,
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
