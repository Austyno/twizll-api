const path = require('path')
const Buyer = require('../../models/buyerModel')
const Seller = require('../../models/sellerModel')
const Error = require('../../utils/errorResponse')
const crypto = require('crypto')

//reset password
const resetPassword = async (req, res, next) => {
  const { otp, password } = req.body

  try {
    let msg = ''
    const seller = await Seller.findOne({
      $and: [
        { passwordResetToken: otp },
        { passwordResetExpires: { $gt: Date.now() } },
      ],
    })

    const buyer = await Buyer.findOne({
      $and: [
        { passwordResetToken: otp },
        { passwordResetExpires: { $gt: Date.now() } },
      ],
    })

    if (buyer != null) {
      buyer.password = password
      buyer.passwordResetToken = null
      buyer.passwordResetExpires = null

      buyer.save()

      return res.status(200).json({
        status: 'success',
        message: 'password reset successfully',
        data: '',
      })
    } else {
      msg = 'Your code is either invalid or it has expired'
    }

    if (seller != null) {
      seller.password = password
      seller.passwordResetToken = null
      seller.passwordResetExpires = null
      seller.save()

     return res.status(200).json({
        status: 'success',
        message: 'password reset successfully',
        data: '',
      })
    } else {
      msg = 'Your code is either invalid or it has expired'
    }

    if (msg != '') {
      return next(new Error(msg, 400))
    }
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

module.exports = resetPassword
