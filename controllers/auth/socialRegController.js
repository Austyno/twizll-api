const User = require('../../models/userModel')
const Error = require('../../utils/errorResponse')
const sendMail = require('../../utils/sendMail')
const stripe = require('../../utils/stripe/Stripe')
const moment = require('moment')


const socialRegister = async (req, res, next) => {
  const { provider, socialId, email, role, fullName,phone } = req.body

  const user = await User.findOne({ email })
  if (user) {
    return next(new Error('A user with this email already exist'))
  }

  try {
    if (role === 'seller' || role === 'stylist') {
      let stripeCustomerId = ''
      let freeTrial = {}

      stripeCustomerId = await stripe.addNewCustomer(email)
      freeTrial.status = 'active'
      freeTrial.end_date = moment().add(30, 'days')

      if (stripeCustomerId.id !== '' || stripeCustomerId.id !== undefined) {
        const register = await User.create({
          stripe_customer_id: stripeCustomerId.id,
          free_trial: freeTrial,
          email,
          fullName,
          password: socialId,
          role,
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
          role,
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
          new Error('sorry we could not register you now, please try again', 400)
        )
      }
    } else {
      //create user
      const newUser = await User.create({
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
        role,
        phone: phone ? phone : null 
      }
      await sendMail.notifyAdmin('info@twizll.com', 'New User', userData)

      res.status(201).json({
        status: 'success',
        message: 'user signed up successfully',
        data: newUser,
      })
    }
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = socialRegister
