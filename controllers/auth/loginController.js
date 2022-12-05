const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Stylist = require('../../models/stylistModel')
const Error = require('../../utils/errorResponse')
const bcrypt = require('bcryptjs')
const createAuthToken = require('../../utils/createAuthToken')
const { detect } = require('detect-browser')
const browser = detect()
const setSession = require('../../middleware/setSession')

const login = async (req, res, next) => {
  const { email, password, role } = req.body

  if (role === undefined) {
    return next(new Error('Role is required', 400))
  }

  switch (role) {
    //seller
    case 'seller':
      const user = await Seller.findOne({ email }).select('+password')

      if (!user) {
        return res.status(400).json({
          status: 'failed',
          message: 'incorect credentials',
          data: [],
        })
      }

      const verifyPass = bcrypt.compareSync(password, user.password)

      if (!verifyPass) {
        return res.status(400).json({
          status: 'failed',
          message: 'incorect credentials',
          data: [],
        })
      }

      try {
        const loggedInUser = await Seller.findOne({ email })
        loggedInUser.emailCodeTimeExpiry = undefined
        loggedInUser.emailVerificationCode = undefined

        if (loggedInUser.free_trial.status === 'active') {
          if (loggedInUser.free_trial.end_date < Date.now()) {
            loggedInUser.free_trial.status = 'completed'
            loggedInUser.save({ validateBeforeSave: false })
            return next(
              new Error(
                'Your free trial period of 30 days has expired. Please choose a plan and subscribe',
                403
              )
            )
            // prompt user to subscribe to a plan
          }
          // get subscription end date from db and comapre to today if today > end date; subscription has expired. deny login
          //TODO:Update store active subscription to reflect current subscription status
        } else if (loggedInUser.plan.status === 'active') {
          if (loggedInUser.plan.end_date < Date.now()) {
            loggedInUser.plan.status = 'expired'
            loggedInUser.save({ validateBeforeSave: false })
            return next(new Error('Your subscription plan has expired', 403))
          }
        }

        return createAuthToken(
          loggedInUser,
          'user logged in successfully',
          200,
          res
        )
      } catch (e) {
        return next(new Error(e.message, 500))
      }
    //buyer
    case 'buyer':
      try {
        const buyer = await Buyer.findOne({ email }).select('+password')

        if (!buyer) {
          return next(new Error('incorrect credentials', 400))
        }

        const passwordValid = bcrypt.compareSync(password, buyer.password)

        if (!passwordValid) {
          return res.status(400).json({
            status: 'failed',
            message: 'incorect credentilas',
            data: [],
          })
        }

        const loggedInUser = await Buyer.findOne({ email })
        loggedInUser.emailCodeTimeExpiry = undefined
        loggedInUser.emailVerificationCode = undefined

        return createAuthToken(
          loggedInUser,
          'user logged in successfully',
          200,
          res
        )
      } catch (e) {
        return next(e)
      }

    case 'stylist':
      try {
        const stylist = await Stylist.findOne({ email }).select('+password')

        if (!stylist) {
          return res.status(400).json({
            status: 'Failed',
            message: 'incorrect credentials',
          })
        }

        const passwordValid = bcrypt.compareSync(password, stylist.password)

        if (!passwordValid) {
          return res.status(400).json({
            status: 'Failed',
            message: 'incorrect credentials',
          })
        }

        const loggedInUser = await Stylist.findOne({ email })
        loggedInUser.emailCodeTimeExpiry = undefined
        loggedInUser.emailVerificationCode = undefined

        return createAuthToken(
          loggedInUser,
          'user logged in successfully',
          200,
          res
        )
      } catch (e) {
        return next(e)
      }
  }
}
module.exports = login
