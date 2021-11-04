const Error = require('../../utils/errorResponse')
const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Stylist = require('../../models/stylistModel')
const createAuthToken = require('../../utils/createAuthToken')

const socialLogin = async (req, res, next) => {
  const { provider, socialId, email, role } = req.body

  if (role === undefined) {
    return next(new Error('User role is required', 400))
  }

  switch (role) {
    case 'buyer':
      try {
        const buyerExist = await Buyer.findOne({ email })

        if (!buyerExist) {
          return next(new Error('buyer not found', 404))
        }

        if (
          buyerExist.social.provider === provider &&
          buyerExist.social.id === socialId
        ) {
          return createAuthToken(
            buyerExist,
            'user logged in successfully',
            200,
            res
          )
        } else {
          return next(new Error('incorrect credentials', 400))
        }
      } catch (e) {
        return next(new Error(e.message, 500))
      }
      break
    case 'seller':
      try {
        const seller = await Seller.findOne({ email })
        if (!seller) {
          return next(new Error('user does not exist', 404))
        }
        if (
          seller.social.provider === provider &&
          seller.social.id === socialId
        ) {
          if (seller.free_trial.status === 'active') {
            if (seller.free_trial.end_date < Date.now()) {
              seller.free_trial.status = 'completed'
              seller.save({ validateBeforeSave: false })
              return next(
                new Error(
                  'Your free trial period of 30 days has expired. Please choose a plan and subscribe',
                  403
                )
              )
              // prompt user to subscribe to a plan
            }
          } else if (seller.plan.status === 'active') {
            if (seller.plan.end_date < Date.now()) {
              seller.plan.status = 'expired'
              seller.save({ validateBeforeSave })
              return next(new Error('Your subscription plan has expired', 403))
            }
          }
        }
      } catch (e) {
        return next(new Error(e.message, 500))
      }
      break
    case 'stylist':
      try {
        const stylist = await Stylist.findOne({ email })
        if (!stylist) {
          return next(new Error('user does not exist', 404))
        }
        if (
          stylist.social.provider === provider &&
          stylist.social.id === socialId
        ) {
          if (stylist.free_trial.status === 'active') {
            if (stylist.free_trial.end_date < Date.now()) {
              stylist.free_trial.status = 'completed'
              stylist.save({ validateBeforeSave: false })
              return next(
                new Error(
                  'Your free trial period of 30 days has expired. Please choose a plan and subscribe',
                  403
                )
              )
              // prompt user to subscribe to a plan
            }
          } else if (stylist.plan.status === 'active') {
            if (stylist.plan.end_date < Date.now()) {
              stylist.plan.status = 'expired'
              stylist.save({ validateBeforeSave })
              return next(new Error('Your subscription plan has expired', 403))
            }
          }
        }
      } catch (e) {
        return next(new Error(e.message, 500))
      }
  }
}
module.exports = socialLogin
