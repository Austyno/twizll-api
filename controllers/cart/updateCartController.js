const Cart = require('../../models/cartModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')

const updateCart = async (req, res, next) => {
  const { productId } = req.params
  const { action } = req.query

  const productDetails = await Product.findById({ _id: productId })
  let cart = await Cart.findOne({ _id: req.session.cartId })

  const productInCartIndex = cart.cartItems.findIndex(
    item => item.product == productId
  )

  if (productInCartIndex === -1) {
    return next(new Error('cant find the product in the cart', 400))
  }
  switch (action) {
    case 'increment':
      try {
        cart.cartItems[productInCartIndex].qty =
          cart.cartItems[productInCartIndex].qty + 1

        //update total price
        cart.cartItems[productInCartIndex].totalPrice =
          Number(cart.cartItems[productInCartIndex].qty) *
          Number(productDetails.unitPrice)

        //update cart total price
        cart.cartTotalPrice = cart.cartItems
          .map(item => Number(item.totalPrice))
          .reduce((a, b) => a + b)

        await cart.save()

        const newCart = await Cart.findOne({
          _id: req.session.cartId,
        }).populate('cartItems.product')
        res.status(200).json({
          status: 'success',
          message: 'Product quantity incremented successfully',
          data: newCart,
        })
      } catch (e) {
        return next(new Error(e.message, 500))
      }

      break
    case 'decrement':
      try {
        cart.cartItems[productInCartIndex].qty =
          cart.cartItems[productInCartIndex].qty - 1

        if (cart.cartItems[productInCartIndex].qty === 0) {
          cart.cartItems.splice(productInCartIndex, 1)
        }

        //update total price
        cart.cartItems[productInCartIndex].totalPrice =
          Number(cart.cartItems[productInCartIndex].qty) *
          Number(productDetails.unitPrice)

        //update cart total price
        cart.cartTotalPrice = cart.cartItems
          .map(item => Number(item.totalPrice))
          .reduce((a, b) => a + b)

        await cart.save()

        const decCart = await Cart.findOne({
          _id: req.session.cartId,
        }).populate('cartItems.product')
        res.status(200).json({
          status: 'success',
          message: 'Product quantity decremented successfully',
          data: decCart,
        })
      } catch (e) {
        return next(new Error(e.message, 500))
      }
      break
    case 'remove':
      try {
        cart.cartItems.splice(productInCartIndex, 1)

        const updated = await Cart.findOne({
          _id: req.session.cartId,
        }).populate('cartItems.product')
        res.status(200).json({
          status: 'success',
          message: 'Product removed successfully',
          data: updated,
        })
      } catch (e) {
        return next(new Error(e.message, 500))
      }
      break
    default:
  }
}
module.exports = updateCart
