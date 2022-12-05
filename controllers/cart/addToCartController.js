const Cart = require('../../models/cartModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')

const addToCart = async (req, res, next) => {
  let { productId, qty } = req.body
  qty = Number(qty)

  if (!productId || !qty) {
    return res.status(400).json({
      status: 'failed',
      message: 'one or more required parameters are missing',
      data: [],
    })
  }
  if (qty == 0) {
    return res.status(400).json({
      status: 'failed',
      message: 'Quantity to be added cannot be 0.',
      data: [],
    })
  }
  try {
    const productDetails = await Product.findById({ _id: productId })

    if (!productDetails) {
      return res.status(400).json({
        status: 'failed',
        message: 'no product exist with this product ID',
        data: [],
      })
    }

    let cart = await Cart.findOne({ _id: req.session.cartId })

    const productIndexInCart = cart.cartItems.findIndex(
      item => item.product == productId
    )

    if (productIndexInCart !== -1 && qty <= 0) {
      cart.cartItems.splice(productIndexInCart, 1)
      if (cart.cartItems.length == 0) {
        cart.total = 0
      } else {
        cart.total = cart.cartItems
          .map(item => Number(item.total))
          .reduce((a, b) => a + b)
      }
    }

    if (productIndexInCart !== -1 && qty > 0) {
      cart.cartItems[productIndexInCart].qty =
        Number(cart.cartItems[productIndexInCart].qty) + Number(qty)
      cart.cartItems[productIndexInCart].total =
        Number(productDetails.unitPrice) *
        Number(cart.cartItems[productIndexInCart].qty)

      cart.cartTotal = cart.cartItems
        .map(item => Number(item.total))
        .reduce((a, b) => a + b)
    } else if (productIndexInCart === -1) {
      cart.cartItems.push({
        product: productId,
        qty: qty,
        total: Number(qty * productDetails.unitPrice),
      })
      cart.total = cart.cartItems
        .map(item => Number(item.total))
        .reduce((a, b) => a + b)
    }
    if (cart.cartItems.length == 1) {
      cart.total = cart.cartItems.total
    }

    await cart.save({ validateBeforeSave: false, new: true })

    const newCart = await Cart.findOne({ _id: req.session.cartId }).populate(
      'cartItems.product',
      'name unitPrice mainPhoto briefDetails'
    )

    res.status(200).json({
      status: 'success',
      itemsInCart: cart.cartItems.length,
      message: 'product added to cart successfully',
      data: newCart,
    })
  } catch (e) {
    return next(e)
  }
}
module.exports = addToCart
