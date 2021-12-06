const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Stylist = require('../../models/stylistModel')
const Error = require('../../utils/errorResponse')
const path = require('path')
const jwt = require('jsonwebtoken')

//TODO:create beautifull ejs pages for error and thank you pages

//this verifys email when a user clicks on the email verification link in email
const verifyEmail = async (req, res, next) => {
  const { code } = req.params

  const decoded = jwt.verify(code, process.env.JWT_SECRET)

  switch (decoded.role) {
    case 'seller':
      const user = await Seller.find({
        $and: [
          { emailVerificationCode: code },
          { emailCodeTimeExpiry: { $gt: Date.now() } },
        ],
      })

      if (!user) {
        //Render ejs page showing error
        res.render(path.join(__dirname, '../../public/views', 'error.ejs'), {
          message: 'the verification code does not exist or has expired',
        })
      }

      try {
        //get user with this code and update db
        const verifyUser = await Seller.findOne({ emailVerificationCode: code })

        verifyUser.emailVerificationCode = ''
        verifyUser.emailCodeTimeExpiry = ''
        verifyUser.emailVerified = true

        await verifyUser.save()

        //render thank you page after updating db
        const template = path.join(
          __dirname,
          '../../public/views',
          'thank-you.ejs'
        )
        res.render(template, {
          message: 'thank you, your email has been verified',
        })
      } catch (e) {
        return res.render(
          path.join(__dirname, '../../public/views', 'error.ejs'),
          {
            message: e.message,
          }
        )
      }
      break;
    case 'buyer':
        const buyer = await Buyer.find({
        $and: [
          { emailVerificationCode: code },
          { emailCodeTimeExpiry: { $gt: Date.now() } },
        ],
      })

      if (!buyer) {
        //Render ejs page showing error
        res.render(path.join(__dirname, '../../public/views', 'error.ejs'), {
          message: 'the verification code does not exist or has expired',
        })
      }

      try {
        //get user with this code and update db
        const verifyUser = await Buyer.findOne({ emailVerificationCode: code })

        verifyUser.emailVerificationCode = ''
        verifyUser.emailCodeTimeExpiry = ''
        verifyUser.emailVerified = true

        await verifyUser.save()

        //render thank you page after updating db
        const template = path.join(
          __dirname,
          '../../public/views',
          'thank-you.ejs'
        )
        res.render(template, {
          message: 'thank you, your email has been verified',
        })
      } catch (e) {
        return res.render(
          path.join(__dirname, '../../public/views', 'error.ejs'),
          {
            message: e.message,
          }
        )
      }
      break
    case 'stylist':
      const stylist = await Stylist.find({
        $and: [
          { emailVerificationCode: code },
          { emailCodeTimeExpiry: { $gt: Date.now() } },
        ],
      })

      if (!stylist) {
        //Render ejs page showing error
        res.render(path.join(__dirname, '../../public/views', 'error.ejs'), {
          message: 'the verification code does not exist or has expired',
        })
      }

      try {
        //get user with this code and update db
        const verifyUser = await Stylist.findOne({ emailVerificationCode: code })

        verifyUser.emailVerificationCode = ''
        verifyUser.emailCodeTimeExpiry = ''
        verifyUser.emailVerified = true

        await verifyUser.save()

        //render thank you page after updating db
        const template = path.join(
          __dirname,
          '../../public/views',
          'thank-you.ejs'
        )
        res.render(template, {
          message: 'thank you, your email has been verified',
        })
      } catch (e) {
        return res.render(
          path.join(__dirname, '../../public/views', 'error.ejs'),
          {
            message: e.message,
          }
        )
      }
      break
        

  }
}

module.exports = verifyEmail
