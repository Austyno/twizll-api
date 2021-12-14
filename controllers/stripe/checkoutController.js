const Error = require('../../utils/errorResponse')
const Buyer = require('../../models/buyerModel')
const Seller = require('../../models/sellerModel')
const Product = require('../../models/productModel')
const Store = require('../../models/storeModel')
const _ = require('lodash')
const stripeUtil = require('../../utils/stripe/Stripe')

const checkOut = async (req, res, next) => {
  const { cartTotal, shippingAddress, cartItems } = req.body

  const buyer = req.user

  if (!buyer) {
    return next(
      new Error('You need to be logged in to perform this action', 403)
    )
  }
  try {
    const intent = await stripeUtil.paymentIntent(
      cartTotal,
      'items purchased from twizll',
      buyer.email
    )
    res.status(200).json({
      status: 'success',
      message: 'client secrete retrieved',
      data: intent,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

module.exports = checkOut
