const stripeUtil = require('../../utils/stripe/Stripe')
const Product = require('../../models/productModel')
const CheckoutSession = require('../../models/checkoutSession')

const checkoutSession = async (req, res, next) => {
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
    //save session id to use later to retrieve line items
    await CheckoutSession.create({
      session_id: checkoutSession.id,
      email:buyer.email
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
