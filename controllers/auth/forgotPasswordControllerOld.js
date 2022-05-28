const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Error = require('../../utils/errorResponse')
const crypto = require('crypto')
const sendMail = require('../../utils/sendMail')
// use the flow in the design. sent code to email

const forgotPassword = async (req, res, next) => {
  const { email, role } = req.body

  if (role === undefined) {
    return next(new Error('Role is required', 400))
  }

  switch (role) {
    case 'seller':
      const user = await Seller.findOne({ email })
      if (!user) {
        return next(new Error('we could not find a user with this email', 404))
      }

      const resetToken = crypto.randomBytes(20).toString('hex')
      const tokenExpiresIn = Date.now() + 60 * 60 * 60 - 1000

      const resetLink = `${
        req.protocol +
        '://' +
        req.get('host') +
        req.originalUrl +
        '/' +
        resetToken
      }`

      try {
        user.passwordResetToken = resetToken
        user.passwordResetExpires = tokenExpiresIn

        await user.save()
        await sendMail.withTemplate(
          { resetLink, fullName: user.fullName },
          user.email,
          'reset.ejs',
          'Password reset link'
        )

        res.status(200).json({
          status: 'success',
          message:
            'A reset link has been sent to your email. Please click on the link to reset your password',
          data: '',
        })
      } catch (e) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined

        await user.save()
        return next(new Error(e.message, 500))
      }

      break
    case 'buyer':
      const buyer = await Buyer.findOne({ email })
      if (!buyer) {
        return next(new Error('we could not find a user with this email', 404))
      }

      const buyerResetToken = crypto.randomBytes(20).toString('hex')
      const buyerTokenExpiresIn = Date.now() + 60 * 60 * 60 - 1000

      const buyeResetLink = `${
        req.protocol +
        '://' +
        req.get('host') +
        req.originalUrl +
        '/' +
        buyerResetToken
      }`

      try {
        buyer.passwordResetToken = buyerResetToken
        buyer.passwordResetExpires = buyerTokenExpiresIn

        await buyer.save()
        await sendMail.withTemplate(
          { buyeResetLink, fullName: buyer.fullName },
          buyer.email,
          'reset.ejs',
          'Password reset link'
        )

        res.status(200).json({
          status: 'success',
          message:
            'A reset link has been sent to your email. Please click on the link to reset your password',
          data: '',
        })
      } catch (e) {
        buyer.passwordResetToken = undefined
        buyer.passwordResetExpires = undefined

        await buyer.save()
        return next(new Error(e.message, 500))
      }
  }

  // async verifyEmail(req, res, next) {
  //   try {
  //     const { verificationcode } = req.params;

  //     const user = await User.findOne({
  //       where: {
  //         verification_token_expires: {
  //           [Sequelize.Op.gt]: Time.startOfDay(),
  //         },
  //         verification_token: verificationcode,
  //       },
  //     });

  //     if (user === null) {
  //       return res.status(422).json({
  //         status: 'not-found',
  //         message: 'Your verification token is either invalid or expired.',
  //       });
  //     }

  //     const data = {
  //       is_verified: true,
  //       verification_token: null,
  //       verification_token_expires: null,
  //     };
  //     await User.update(data, {
  //       where: {
  //         email: user.email,
  //       },
  //     });

  //     return res.status(201).json({
  //       status: 'ok',
  //       message: 'email verified successfully',
  //     });
  //   } catch (e) {
  //     return next(e);
  //   }
  },






}
module.exports = forgotPassword
