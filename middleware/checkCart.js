const Cart = require('../models/cartModel')

const checkCart = async (req, res, next) => {

  if (!req.session.cartId || req.session.cartId === null) {
    //check if there is a logged in user
    if (req.session.userId || req.user) {

      //get the cart for this user
      const availableCart = await Cart.findOne({owner: req.session.userId || req.user.id })

      if (availableCart) {
        req.session.cartId = availableCart._id
      }else {
        let newCarts = await Cart.create([
          { owner: req.session.userId || req.user.id },
        ])
        await newCarts[0].save()

        req.session.cartId = newCarts[0]._id
      }
    } else {
      let newCarts = await Cart.create([{}])
      await newCarts[0].save()

      req.session.cartId = newCarts[0]._id
    }
    return next()
  } else {
    //cart exist in session
    let targetCart = await Cart.findOne({ _id: req.session.cartId })

    if (!targetCart) {
      let cartBody = {}

      if (req.session.userId){ cartBody.owner = req.session.userId}

      let newTargetCart = await Cart.create([cartBody])
      await newTargetCart[0].save()

      req.session.cartId = newTargetCart[0]._id
    } else if (
      (targetCart.owner === null || !targetCart.owner) &&
      req.session.userId
    ) {
      await Cart.findOneAndUpdate(
        { _id: targetCart._id },
        { owner: req.session.userId }
      )
    }
    return next()
  }
}

module.exports = checkCart
