const Cart = require('../../models/cartModel')
const Error = require('../../utils/errorResponse')

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({
      _id: req.session.cartId,
    }).populate('cartItems.product', 'name unitPrice mainPhoto briefDetails')

    res.status(200).json({
      status: 'success',
      itemsInCart: cart.cartItems.length,
      message: 'Cart retrieved successfully',
      data: cart,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = getCart
