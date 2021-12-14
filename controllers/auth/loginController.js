const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Error = require('../../utils/errorResponse')
const bcrypt = require('bcryptjs')
const createAuthToken = require('../../utils/createAuthToken')

const login = async (req, res, next) => {
  const { email, password, role } = req.body

  if(role === undefined){
    return next(new Error('Role is required',400))
  }

  switch (role) {
    //seller
    case 'seller':
      const user = await Seller.findOne({ email }).select('+password')

      if (!user) {
        return next(new Error('incorrect credentials', 400))
      }

      const verifyPass = bcrypt.compareSync(password, user.password)
      if (!verifyPass) {
        return next(new Error('incorrect credentials', 400))
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
            loggedInUser.save({ validateBeforeSave })
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
      const buyer = await Buyer.findOne({ email }).select('+password')

      if (!buyer) {
        return next(new Error('incorrect credentials', 400))
      }

      const passwordValid = bcrypt.compareSync(password, buyer.password)

      if (!passwordValid) {
        return next(new Error('incorrect credentials', 400))
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
  }
}
module.exports = login
