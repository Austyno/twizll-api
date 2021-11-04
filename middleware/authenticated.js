const jwt = require('jsonwebtoken')
const Error = require('../utils/errorResponse')
const User = require('../models/userModel')
const Store = require('../models/storeModel')
const Buyer = require('../models/buyerModel')
const Seller = require('../models/sellerModel')
const Stylist = require('../models/stylistModel')

// Protect routes
const authenticated =  (role) => {


  return async (req, res, next) => {
    let token

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Set token from Bearer token in header
      token = req.headers.authorization.split(' ')[1]
    } else if (req.cookies.token) {
      token = req.cookies.token
    }

    // Make sure token exists
    if (token === null) {
      return next(new Error('You need to sign in', 403))
    }

    //get db from role
    const db =
      role === 'buyer'
        ? Buyer
        : role === 'seller'
        ? Seller
        : role === 'stylist'
        ? Stylist
        : null

    //ensure token  is in the db
    const userToken = await db.findOne({ token })
    if (!userToken) {
      return next(
        new Error('you are logged out, please login to continue', 400)
      )
    }
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await db.findById(decoded.id)


      if (role === 'seller') {
        //locate seller store and add to request object
        req.store = await Store.findOne({ owner: decoded.id })
      }

      next()
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        return next(
          new Error('Your session has expired. Please log in again.', 403)
        )
      }
      if (e.message === 'jwt malformed') {
        return next(new Error('Invalid token. Please log in again.', 403))
      }
      if (e.message === 'jwt must be provided') {
        return next(new Error('You need to login to access this resource', 403))
      }
    }
  }
}
module.exports = authenticated
