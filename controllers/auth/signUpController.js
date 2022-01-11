const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Stylist = require('../../models/stylistModel')
const crypto = require('crypto')
const Error = require('../../utils/errorResponse')
const sendMail = require('../../utils/sendMail')
const stripe = require('../../utils/stripe/Stripe')
const createAuthToken = require('../../utils/createAuthToken')
const moment = require('moment')
const jwt = require('jsonwebtoken')

const signUp = async (req, res, next) => {
  // seller,stylist,user
  // switch
  const { email, phone, password, fullName, role } = req.body

  const passCheck =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/

  if (!password.match(passCheck)) {
    return next(
      new Error(
        'Password must be minimum of eight (8) characters long, containing uppercase and lowercase letters,atleast a number and special characters',
        400
      )
    )
  }
  if (role === undefined) {
    return next(new Error('Role is required', 400))
  }

  switch (role) {
    case 'seller':
      const sellerExist = await Seller.findOne({ email })
      if (sellerExist) {
        return next(new Error('A seller with this email already exist', 400))
      }

      try {
        let stripeCustomerId = ''
        let freeTrial = {}
        stripeCustomerId = await stripe.addNewCustomer(email)
        freeTrial.status = 'active'
        freeTrial.end_date = moment().add(30, 'days')

        const url =
          process.env.NODE_ENV === 'production'
            ? process.env.PROD_ADDRESS
            : process.env.DEV_ADDRESS

        // const verificationCode = crypto.randomBytes(20).toString('hex')

        const verificationCode = jwt.sign(
          { role: 'seller' },
          process.env.JWT_SECRET
        )
        //create email verification link
        const verificationLink = `${
          url + req.originalUrl
        }/verifyemail/${verificationCode}`

        //send verification mail
        const verificationMail = await sendMail.withTemplate(
          { verificationLink, fullName },
          email,
          '/verify.ejs',
          'Please verify your email'
        )

        if (
          verificationMail &&
          (stripeCustomerId.id !== '' || stripeCustomerId.id !== undefined)
        ) {
          const newSeller = await Seller.create({
            emailVerificationCode: verificationCode,
            emailCodeTimeExpiry: moment().add(1, 'days'),
            stripe_customer_id: stripeCustomerId.id,
            free_trial: freeTrial,
            email,
            fullName,
            phone,
            password,
          })

          // send mail to admin
          const userData = {
            email,
            phone,
            fullName,
            role: 'seller',
          }
          await sendMail.notifyAdmin(
            'info@twizll.com',
            'New User',
            userData,
            'newUser'
          )

          res.status(201).json({
            status: 'success',
            message: 'seller signed up successfully',
            data: newSeller,
          })
        } else {
          return next(
            new Error(
              'sorry we could not register you now, please try again',
              400
            )
          )
        }
      } catch (e) {
        return next(new Error(e.message, 500))
      }
      break

    case 'buyer':
      const buyerExist = await Buyer.findOne({ email })
      if (buyerExist) {
        return next(new Error('A buyer with this email already exist', 400))
      }

      try {
        const url =
          process.env.NODE_ENV === 'production'
            ? process.env.PROD_ADDRESS
            : process.env.DEV_ADDRESS

        // const verificationCode = crypto.randomBytes(20).toString('hex')
        const verificationCode = jwt.sign(
          { role: 'buyer' },
          process.env.JWT_SECRET
        )

        //create email verification link
        const verificationLink = `${
          url + req.originalUrl
        }/verifyemail/${verificationCode}`

        //send verification mail
        const verificationMail = await sendMail.withTemplate(
          { verificationLink, fullName },
          email,
          '/verify.ejs',
          'Please verify your email'
        )

        if (verificationMail) {
          const newBuyer = await Buyer.create({
            emailVerificationCode: verificationCode,
            emailCodeTimeExpiry: moment().add(1, 'days'),
            email,
            fullName,
            phone,
            password,
          })

          // send mail to admin
          const userData = {
            email,
            phone,
            fullName,
            role: 'buyer',
          }
          await sendMail.notifyAdmin(
            'info@twizll.com',
            'New User',
            userData,
            'newUser'
          )

          res.status(201).json({
            status: 'success',
            message: 'user signed up successfully',
            data: newBuyer,
          })
        } else {
          return next(
            new Error(
              'sorry we could not register you now, please try again',
              400
            )
          )
        }
      } catch (e) {
        return next(new Error(e.message, 500))
      }

    case 'stylist':
      const stylistExist = await Stylist.findOne({ email })
      if (stylistExist) {
        return next(new Error('A stylist with this email already exist', 400))
      }

      try {
        let stripeCustomerId = ''
        let freeTrial = {}
        stripeCustomerId = await stripe.addNewCustomer(email)
        freeTrial.status = 'active'
        freeTrial.end_date = moment().add(30, 'days')

        const url =
          process.env.NODE_ENV === 'production'
            ? process.env.PROD_ADDRESS
            : process.env.DEV_ADDRESS

        // const verificationCode = crypto.randomBytes(20).toString('hex')
        const verificationCode = jwt.sign(
          { role: 'stylist' },
          process.env.JWT_SECRET
        )

        //create email verification link
        const verificationLink = `${
          url + req.originalUrl
        }/verifyemail/${verificationCode}`

        //send verification mail
        const verificationMail = await sendMail.withTemplate(
          { verificationLink, fullName },
          email,
          '/verify.ejs',
          'Please verify your email'
        )

        if (
          verificationMail &&
          (stripeCustomerId.id !== '' || stripeCustomerId.id !== undefined)
        ) {
          const newStylist = await Stylist.create({
            emailVerificationCode: verificationCode,
            emailCodeTimeExpiry: moment().add(1, 'days'),
            stripe_customer_id: stripeCustomerId.id,
            free_trial: freeTrial,
            email,
            fullName,
            phone,
            password,
          })

          // send mail to admin
          const userData = {
            email,
            phone,
            fullName,
            role: 'stylist',
          }
          await sendMail.notifyAdmin(
            'info@twizll.com',
            'New User',
            userData,
            'newUser'
          )

          res.status(201).json({
            status: 'success',
            message: 'stylist signed up successfully',
            data: newStylist,
          })
        } else {
          return next(
            new Error(
              'sorry we could not register you now, please try again',
              400
            )
          )
        }
      } catch (e) {
        return next(new Error(e.message, 500))
      }
      break
  }
}

module.exports = signUp
