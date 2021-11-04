const Seller = require('../../models/sellerModel')
const Buyer = require('../../models/buyerModel')
const Stylist = require('../../models/stylistModel')
const Error = require('../../utils/errorResponse')
const sendMail = require('../../utils/sendMail')
const stripe = require('../../utils/stripe/Stripe')
const moment = require('moment')

const socialRegister = async (req, res, next) => {
  const { provider, socialId, email, role, fullName, phone } = req.body

  if (role === undefined) {
    return next(new Error('User role is required', 400))
  }

  switch (role) {
    case 'buyer':
      const user = await Buyer.findOne({ email })
      if (user) {
        return next(new Error('A user with this email already exist. Please login instead',400))
      }
      try {
        //create user
        const newUser = await Buyer.create({
          email,
          fullName,
          password: socialId,
          social: { provider, id: socialId },
          role,
          emailVerified: true,
        })

        //email socialId to user to use as temp password then change it latter
        await sendMail.withTemplate(
          { socialId, fullName },
          email,
          '/temp-password.ejs',
          'Your temporary password'
        )

        // send mail to admin
        const userData = {
          email,
          fullName,
          role: 'buyer',
          phone: phone ? phone : null,
        }
        await sendMail.notifyAdmin('info@twizll.com', 'New User', userData)

        res.status(201).json({
          status: 'success',
          message: 'user signed up successfully.',
          data: newUser,
        })
      } catch (e) {
        return next(new Error(e.message, 500))
      }
      break

    case 'seller':
      const seller = await Seller.findOne({ email })
      if (seller) {
        return next(new Error('A user with this email already exist'))
      }

      try {
        let stripeCustomerId = ''
        let freeTrial = {}

        stripeCustomerId = await stripe.addNewCustomer(email)
        freeTrial.status = 'active'
        freeTrial.end_date = moment().add(30, 'days')

        if (stripeCustomerId.id !== '' || stripeCustomerId.id !== undefined) {
          const register = await Seller.create({
            stripe_customer_id: stripeCustomerId.id,
            free_trial: freeTrial,
            email,
            fullName,
            password: socialId,
            emailVerified: true,
            social: { provider, id: socialId },
          })
          //email socialId to user to use as temp password then change it latter
          await sendMail.withTemplate(
            { socialId, fullName },
            email,
            '/temp-password.ejs',
            'Your temporary password'
          )

          // send mail to admin
          const userData = {
            email,
            fullName,
            role:'seller',
            phone: phone ? phone : null,
          }
          await sendMail.notifyAdmin('info@twizll.com', 'New User', userData)

          res.status(201).json({
            status: 'success',
            message: 'user signed up successfully',
            data: register,
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
      case 'stylist':
        const stylist = await Stylist.findOne({ email })
      if (stylist) {
        return next(new Error('A user with this email already exist. Please login instead',400))
      }

      try {
        let stripeCustomerId = ''
        let freeTrial = {}

        stripeCustomerId = await stripe.addNewCustomer(email)
        freeTrial.status = 'active'
        freeTrial.end_date = moment().add(30, 'days')

        if (stripeCustomerId.id !== '' || stripeCustomerId.id !== undefined) {
          const register = await Stylist.create({
            stripe_customer_id: stripeCustomerId.id,
            free_trial: freeTrial,
            email,
            fullName,
            password: socialId,
            emailVerified: true,
            social: { provider, id: socialId },
          })
          //email socialId to user to use as temp password then change it latter
          await sendMail.withTemplate(
            { socialId, fullName },
            email,
            '/temp-password.ejs',
            'Your temporary password'
          )

          // send mail to admin
          const userData = {
            email,
            fullName,
            role:'stylist',
            phone: phone ? phone : null,
          }
          await sendMail.notifyAdmin('info@twizll.com', 'New User', userData)

          res.status(201).json({
            status: 'success',
            message: 'user signed up successfully',
            data: register,
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
module.exports = socialRegister
