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
    // let newCartItems = {

    // }

    let newCartItems = [
      // price_data: {
      //    currency: '',
      //    unit_amount: '',
      //     product_data: { name: 'test',images:'' },
      //   },
      // quantity: '',
    ]

    for (let i = 0; i < cartItems.length; i++) {
      const prod = await Product.findById(cartItems[i].product)
      newCartItems.push({
        price_data: {
          currency: 'gbp',
          unit_amount: 350,
          product_data: {
            name: prod.name,
            // images: prod.mainPhoto != '' ? prod.mainPhoto : null,
          },
        },
        quantity: cartItems[i].qty
      })
    }

    const checkoutSession = await stripeUtil.createCheckoutSession(
      buyer.email,
      newCartItems
    )
    res.status(200).json({
      status: 'success',
      message: 'check out session created',
      data: checkoutSession,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

module.exports = checkOut
