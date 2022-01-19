const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Error = require('../../utils/errorResponse')
const createAuthToken = require('../../utils/createAuthToken')

refreshAccessToken = async (req, res, next) => {
  const { role, refreshToken } = req.body

  if (role === undefined) {
    return next(new Error('Role is required', 400))
  }
  if (refreshToken === undefined) {
    return next(new Error('Please pass in a refresh token', 400))
  }

  switch (role) {
    case 'seller':
      const tokenExist = await Seller.findOne({
        'refreshToken._token': refreshToken,
      })

      if (tokenExist === null) {
        return next(new Error('refresh token does not exist'))
      }

      if (tokenExist.refreshToken.expiryDate < Date.now()) {
        return next(new Error('refresh token has exoired. please login again'))
      }

      try {
        return createAuthToken(
          tokenExist,
          'Access token refreshed successfully',
          200,
          res
        )
      } catch (e) {
        return next(new Error(e.message, 500))
      }
  }
}
module.exports = refreshAccessToken
