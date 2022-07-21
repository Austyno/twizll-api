const stripeUtil = require('../../utils/stripe/Stripe')
const Product = require('../../models/productModel')
const CheckoutSession = require('../../models/checkoutSession')

const checkoutSession = async (req, res, next) => {
  const { cartTotal, shippingAddress, cartItems } = req.body

  const buyer = req.user
  const errors = {}

  if (!buyer) {
    return next(
      new Error('You need to be logged in to perform this action', 403)
    )
  }

  if (!shippingAddress) {
    errors.shippingAddress = `please provide a shipping address with 
    ${(address, country, contactPerson, postalCode, city, countryCode)}`
  }

  if (!cartItems || cartItems.length < 1) {
    errors.cartItems = 'You cart cant be empty'
  }

  if (!cartTotal || cartTotal == 0) {
    errors.cartTotal = 'your cart total cant be 0'
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: 'Please provide all required fields.',
      error: errors,
    })
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
    //save session id to use later to retrieve line items
    await CheckoutSession.create({
      session_id: checkoutSession.id,
      email: buyer.email,
    })

    res.status(200).json({
      status: 'success',
      message: 'check out session created',
      data: checkoutSession.url,
    })
  } catch (e) {
    return next(e)
  }
}

module.exports = checkoutSession
