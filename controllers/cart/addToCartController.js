const Cart = require('../../models/cartModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')

const addToCart = async (req, res, next) => {
  let { productId, qty } = req.body
  qty = Number(qty)

  if (!productId || !qty) {
    return next(new Error('one or more required parameters are missing', 400))
  }

  const productDetails = await Product.findById({ _id: productId })

  if (!productDetails) {
    return next(new Error('no product exist with this product ID', 400))
  }

  if (qty === 0) {
    return next(new Error('Quantity to be added cannot be 0.', 400))
  }

  let cart = await Cart.findOne({ _id: req.session.cartId })

  const productExistInCart = cart.cartItems.findIndex(
    item => item.product == productId
  )

  if (productExistInCart !== -1) {
    cart.cartItems[productExistInCart].qty =
      Number(cart.cartItems[productExistInCart].qty) + Number(qty)
    cart.cartItems[productExistInCart].totalPrice =
      Number(productDetails.unitPrice) *
      Number(cart.cartItems[productExistInCart].qty)

    cart.cartTotalPrice = cart.cartItems
      .map(item => Number(item.totalPrice))
      .reduce((a, b) => a + b)
  } else if (productExistInCart === -1) {
    cart.cartItems.push({
      product: productId,
      qty: qty,
      totalPrice: Number(qty * productDetails.unitPrice),
    })
    cart.totalPrice = cart.cartItems
      .map(item => Number(item.totalPrice))
      .reduce((a, b) => a + b)
  }
  if (cart.cartItems.length == 1) {
    cart.totalPrice = cart.cartItems.totalPrice
  }

  await cart.save({ validateBeforeSave: false, new: true })

  const newCart = await Cart.findOne({ _id: req.session.cartId }).populate(
    'cartItems.product'
  )

  res.status(200).json({
    status: 'success',
    items_in_cart: cart.cartItems.length,
    message: 'product added to cart successfully',
    // data:newCart
  })
}
module.exports = addToCart
