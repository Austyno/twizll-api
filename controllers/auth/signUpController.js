const User = require('../../models/userModel')
const crypto = require('crypto')
const Error = require('../../utils/errorResponse')
const sendMail = require('../../utils/sendMail')
const stripe = require('../../utils/stripe/Stripe')
const createAuthToken = require('../../utils/createAuthToken')
const moment = require('moment')

const signUp = async (req, res, next) => {
  // seller,stylist,user
  // switch
  const {
    email,
    phone,
    password,
    fullName,
    role,
    provider,
    socialId,
  } = req.body

  const userExist = await User.findOne({ email })

  if (userExist) {
    return next(new Error('A user with this email already exist', 400))
  }

  //get stripe customer id and store for subsequent use and activate 30 days free trial
  if(role === 'seller' || role === 'stylist'){

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

      const verificationCode = crypto.randomBytes(20).toString('hex')
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
        const newuser = await User.create({
          emailVerificationCode: verificationCode,
          emailCodeTimeExpiry: moment().add(1, 'days'),
          stripe_customer_id: stripeCustomerId.id,
          free_trial: freeTrial,
          email,
          fullName,
          phone,
          password,
          role,
        })

        // send mail to admin
        const userData = {
          email,
          phone,
          fullName,
          role,
        }
        await sendMail.notifyAdmin('info@twizll.com', 'New User', userData)

        res.status(201).json({
          status: 'success',
          message: 'user signed up successfully',
          data: newuser,
        })
      } else {
        return next(
          new Error('sorry we could not register now, please try again', 400)
        )
      }
    } catch (e) {
      return next(new Error(e.message, 500))
    }

  }else{

    try{
      const url =
        process.env.NODE_ENV === 'production'
          ? process.env.PROD_ADDRESS
          : process.env.DEV_ADDRESS

      const verificationCode = crypto.randomBytes(20).toString('hex')
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
        const reg = await User.create({
          emailVerificationCode: verificationCode,
          emailCodeTimeExpiry: moment().add(1, 'days'),
          email,
          fullName,
          phone,
          password,
          role,
        })

        // send mail to admin
        const userData = {
          email,
          phone,
          fullName,
          role,
        }
        await sendMail.notifyAdmin('info@twizll.com', 'New User', userData)

        res.status(201).json({
          status: 'success',
          message: 'user signed up successfully',
          data: reg,
        })
      } else {
        return next(
          new Error('sorry we could not register now, please try again', 400)
        )
      }

    }catch(e){
      return next(new Error(e.message,500))
    }

  }
}


module.exports = signUp
