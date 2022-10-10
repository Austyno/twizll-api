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
const Wallet = require('../../models/walletModel')
const generateOtp = require('../../utils/generateOtp')
const isValidPassword = require('../../utils/checkPassword')

const signUp = async (req, res, next) => {
  const { role } = req.body

  if (role == undefined) {
    return res.status(400).json({
      status: 'failed',
      message: 'Role is required',
    })
  }
  switch (role) {
    case 'seller':
      const { email, phone, fullName, password } = req.body
      let errors = {}
      if (!fullName) {
        errors.fullName = 'please add your full name'
      }
      if (!email) {
        errors.email = 'Please add an email'
      }
      if (!password) {
        errors.password = 'please add your password'
      }
      if (!phone) {
        errors.phone = 'please add your phone number'
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          status: 'failed',
          message: 'Please fix the error/s and try again',
          data: errors,
        })
      }

      const passCheck = isValidPassword(password)

      if (!passCheck) {
        return res.status(400).json({
          status: 'failed',
          message:
            'Password must be minimum of eight (8) characters long, containing uppercase and lowercase letters,atleast a number and a special character',
        })
      }

      const sellerExist = await Seller.findOne({ email })
      if (sellerExist) {
        return res.status(400).json({
          status: 'failed',
          message: 'A seller with this email already exist',
        })
      }

      try {
        let stripeCustomerId = ''
        let freeTrial = {}
        stripeCustomerId = await stripe.addNewCustomer(email)
        freeTrial.status = 'active'
        freeTrial.end_date = moment().add(30, 'days')

        //create otp
        const otp = generateOtp()

        if (stripeCustomerId.id !== '' || stripeCustomerId.id !== undefined) {
          const newSeller = await Seller.create({
            emailVerificationCode: otp,
            emailCodeTimeExpiry: moment().add(1, 'days'),
            stripe_customer_id: stripeCustomerId.id,
            free_trial: freeTrial,
            email,
            fullName,
            phone,
            password,
          })

          //send verification mail
          await sendMail.withTemplate(
            { otp, fullName },
            email,
            '/verify.ejs',
            'Please verify your email'
          )

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
          await sendMail.notifyAdmin(
            'sales@twizll.com',
            'New User',
            userData,
            'newUser'
          )

          return res.status(201).json({
            status: 'success',
            message:
              'seller signed up successfully. check your mail for your verification code',
            data: newSeller,
          })
        } else {
          return res.status(500).json({
            status: 'failed',
            message: 'sorry we could not register you now, please try again',
          })
        }
      } catch (e) {
        return next(e)
      }
      break

    case 'buyer':
      const {
        email: buyerEmail,
        phone: buyerPhone,
        fullName: buyerName,
        password: buyerPass,
      } = req.body
      let validationErrors = {}
      if (!buyerName) {
        validationErrors.fullName = 'please add your full name'
      }
      if (!buyerEmail) {
        validationErrors.email = 'Please add an email'
      }
      if (!buyerPass) {
        validationErrors.password = 'please add your password'
      }
      if (!buyerPhone) {
        errors.phone = 'please add your phone number'
      }

      if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({
          status: 'failed',
          message: 'Please fix the error/s and try again',
          data: validationErrors,
        })
      }

      const passChecker = isValidPassword(buyerPass)

      if (!passChecker) {
        return res.status(400).json({
          status: 'failed',
          message:
            'Password must be minimum of eight (8) characters long, containing uppercase and lowercase letters,atleast a number and a special character',
        })
      }

      const buyerExist = await Buyer.findOne({ email: buyerEmail })
      if (buyerExist) {
        return res.status(400).json({
          status: 'failed',
          message: 'A buyer with this email already exist',
          data: [],
        })
      }

      try {
        //create otp
        const otp = generateOtp()

        //send verification mail

        const newBuyer = await Buyer.create({
          emailVerificationCode: otp,
          emailCodeTimeExpiry: moment().add(1, 'days'),
          email: buyerEmail,
          fullName: buyerName,
          phone: buyerPhone,
          password: buyerPass,
        })

        if (newBuyer) {
          await sendMail.withTemplate(
            { otp, fullName: buyerName },
            buyerEmail,
            '/verify.ejs',
            'Please verify your email'
          )
          // send mail to admin
          const userData = {
            email: buyerEmail,
            phone: buyerPhone,
            fullName: buyerName,
            role: 'buyer',
          }
          await sendMail.notifyAdmin(
            'info@twizll.com',
            'New User',
            userData,
            'newUser'
          )
          await sendMail.notifyAdmin(
            'sales@twizll.com',
            'New User',
            userData,
            'newUser'
          )

          return res.status(201).json({
            status: 'success',
            message:
              'user signed up successfully. check your mail for your verification code ',
            data: newBuyer,
          })
        } else {
          return res.status(500).json({
            status: 'failed',
            message: 'sorry we could not register you now, please try again',
          })
        }
      } catch (e) {
        return next(e)
      }

    case 'stylist':
      console.log('sign up stylist')

      const {
        email: stylistMail,
        phone: stylistPhone,
        fullName: stylistName,
        password: stylistPass,
        social_handle,
        style_name,
        country,
      } = req.body
      let validate = {}
      if (!stylistName) {
        validate.fullName = 'please add your full name'
      }
      if (!stylistMail) {
        validate.email = 'Please add an email'
      }
      if (!stylistPass) {
        validate.password = 'please add your password'
      }
      if (!stylistPhone) {
        validate.phone = 'please add your phone number'
      }
      if (!social_handle){
        validate.social_media_handle = 'please add a social media handle eg www.linkedin.com/in/austyno'
      }
      if(!style_name){
        validate.style_name = "please add your style name"
      }
      if(!country){
        validate.country = "your country is required"
      }
        if (Object.keys(validate).length > 0) {
          return res.status(400).json({
            status: 'failed',
            message: 'Please fix the error/s and try again',
            data: validate,
          })
        }

      const check = isValidPassword(stylistPass)

      if (!check) {
        return res.status(400).json({
          status: 'failed',
          message:
            'Password must be minimum of eight (8) characters long, containing uppercase and lowercase letters,atleast a number and a special character',
        })
      }

      const stylistExist = await Stylist.findOne({ email:stylistMail })


      if (stylistExist != null) {
        return res.status(400).json({
          status: 'Failed',
          message: 'A stylist with this email already exist',
          data: '',
        })
      }

      try {
        let stripeCustomerId = ''
        let freeTrial = {}
        stripeCustomerId = await stripe.addNewCustomer(stylistMail)
        freeTrial.status = 'active'
        freeTrial.end_date = moment().add(30, 'days')

        //create otp
        const otp = generateOtp()

        if (stripeCustomerId.id !== '' || stripeCustomerId.id !== undefined) {
          const newStylist = await Stylist.create({
            emailVerificationCode: otp,
            emailCodeTimeExpiry: moment().add(1, 'days'),
            stripe_customer_id: stripeCustomerId.id,
            free_trial: freeTrial,
            email: stylistMail,
            fullName:stylistName,
            phone:stylistPhone,
            password:stylistPass,
            social_handle,
            country,
            style_name,
          })

          if (newStylist) {
            Wallet.create({ style: newStylist.id })
          }
          //send verification mail
          await sendMail.withTemplate(
            { otp, fullName:stylistName },
            stylistMail,
            '/verify.ejs',
            'Please verify your email'
          )

          // send mail to admin
          const userData = {
            email:stylistMail,
            phone:stylistPhone,
            fullName:stylistName,
            role: 'stylist',
          }
          await sendMail.notifyAdmin(
            'info@twizll.com',
            'New User',
            userData,
            'newUser'
          )
          await sendMail.notifyAdmin(
            'sales@twizll.com',
            'New User',
            userData,
            'newUser'
          )

          return res.status(201).json({
            status: 'success',
            message:
              'stylist signed up successfully. Please verify your email by copying the code in the email we sent you',
            data: newStylist,
          })
        } else {
          return res.status(500).json({
            status: 'failed',
            message: 'sorry we could not register you now, please try again',
          })
        }
      } catch (e) {
        return next(e)
      }
      break
  }
}

module.exports = signUp
