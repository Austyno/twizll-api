const Cart = require('../../models/cartModel')
const Product = require('../../models/productModel')

// route to add multiple favourites for a user

const addMultipleProducts = async (req, res, next) => {
  let { products } = req.body

  let userCart = await Cart.findOne({ _id: req.session.cartId })
  try {
    if (Array.isArray(products)) {
      // locate product
      userCart.cartItems.map(async (item, index) => {
        const productDetails = await Product.findById({
          _id: item.product,
        })

        for (let pro of products) {
          if (item.product == pro.productId) {
            //update qty in cart
            userCart.cartItems[index].qty =
              Number(userCart.cartItems[index].qty) + Number(pro.qty)

            // //update total in cart
            userCart.cartItems[index].total =
              Number(productDetails.unitPrice) *
              Number(userCart.cartItems[index].qty)

            // updatecart total based on cart items
            userCart.cartTotal = userCart.cartItems
              .map(item => Number(item.total))
              .reduce((a, b) => a + b)
          } else {
            userCart.cartItems.push({
              product: pro.productId,
              qty: pro.qty,
              total: Number(pro.qty) * Number(productDetails.unitPrice),
            })
          }
        }
        // await userCart.save({ validateBeforSave: false })
        await Cart.findOneAndUpdate({ _id: req.session.cartId },userCart)
      })
      // await userCart.save({ validateBeforSave: false })

      // const newCart = await Cart.findOne({ _id: req.session.cartId }).populate(
      //   'cartItems.product',
      //   'name unitPrice mainPhoto briefDetails'
      // )
      const newCart = await Cart.findOne({ _id: req.session.cartId })

      return res.status(200).json({
        status: 'success',
        itemsInCart: newCart.cartItems.length,
        message: 'products added to cart successfully',
        data: newCart,
      })
    } else {
      return res.status(400).json({
        status: 'failed',
        message: 'The payload must be an array of objects',
        data: [],
      })
    }
  } catch (e) {
    return next(e)
  }
}

module.exports = addMultipleProducts
