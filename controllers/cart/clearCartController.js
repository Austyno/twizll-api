const Cart = require('../../models/cartModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')

const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ _id: req.session.cartId })

    cart.cartItems = []
    cart.cartTotal = '0'
    cart.cartDiscount = '0'

    await cart.save({ validateBeforeSave: false })
    res.status(200).json({
      status: 'success',
      message: 'cart cleared successfully',
      data: [],
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

module.exports = clearCart
