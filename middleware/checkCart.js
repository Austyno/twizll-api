const Cart = require('../models/cartModel')

const checkCart = async (req, res, next) => {
  try {
    if (!req.session.cartId || req.session.cartId === null) {
      if (req.user) {
        const availableCart = await Cart.findOne({ owner: req.user._id })

        if (availableCart) {
          req.session.cartId = availableCart._id
        } else {
          let newCart = await Cart.create({ owner: req.user._id })

          req.session.cartId = newCart._id
        }
      } else {
        let newCart = await Cart.create({})
        req.session.cartId = newCart._id
      }
      return next()
    } else {
      let targetCart = await Cart.findOne({ _id: req.session.cartId })

      if (!targetCart) {
        let cartBody = {}

        if (req.user) {
          cartBody.owner = req.user._id
        }

        let newTargetCart = await Cart.create(cartBody)

        req.session.cartId = newTargetCart._id
      }

      if ((targetCart.owner === null || !targetCart.owner) && req.user) {
        // await Cart.findOneAndUpdate({ _id: targetCart._id }, { owner: req.user._id })
        targetCart.owner = req.user._id
        targetCart.save({ validateBeforeSave: false })
      }
      return next()
    }
  } catch (e) {
    return next(e)
  }
}

module.exports = checkCart
