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
    const line_items = []

    for (let i = 0; i < cartItems.length; i++) {
      const prod = await Product.findById(cartItems[i].product)
      line_items.push({
        price: prod.price_id,
        quantity: cartItems[i].qty,
        
      })
    }

    const checkoutSession = await stripeUtil.createCheckoutSession(
      buyer.email,
      line_items
    )


    res.status(200).json({
      status: 'success',
      message: 'check out session created',
      data: checkoutSession.url,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

module.exports = checkOut
