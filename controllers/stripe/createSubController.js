/*
 * external_account:{
 * type:bank_account,
 * country:"USA",
 * currency: USD,
 * account_holder_name: Austin Alozie
 * account_holder_type: individual or company,
 * routing_number: 12345,
 * account_number:1234567890
 * }
 */

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
    const uri = url.format({
      pathname: `http://localhost:5000/api/stripe/subscribe`,
      query: {
        subscriptionId: subscription.id,
        clientSecrete: subscription.latest_invoice.payment_intent.client_secret,
      },
    })

    const start =
      process.platform == 'darwin'
        ? 'open'
        : process.platform == 'win32'
        ? 'start'
        : 'xdg-open'

    // child.exec(start + ' ' + uri)
    open(uri)
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

const showSubpage = (req, res, next) => {
  const { subscriptionId, clientSecrete } = req.query
  res.render(path.join(__dirname, '../../public/views', 'subscribe.ejs'), {
    fullName: 'austyno',
    subscriptionId,
    clientSecrete,
  })
}

const pubKey = (req, res, next) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  })
}

module.exports = { createSubscription, showSubpage, pubKey }
