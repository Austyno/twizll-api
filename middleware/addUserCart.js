const Buyer = require('../models/buyerModel')
const jwt = require('jsonwebtoken')

const addCartUser = async (req, res, next) => {
  try {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1]
    }else{
     return  next()
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await Buyer.findById(decoded.id)

   return next()
  } catch (e) {
   return  next(e)
  }
}
module.exports = addCartUser
