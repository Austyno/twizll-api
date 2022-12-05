const Seller = require('../../models/sellerModel')
const crypto = require('crypto')
const Store = require('../../models/storeModel')
const VerificationDoc = require('../../models/verificationDocsModel')
const isValidPassword = require('../../utils/checkPassword')
const stripe = require('../../utils/stripe/Stripe')
const sendMail = require('../../utils/sendMail')
const moment = require('moment')
const generateOtp = require('../../utils/generateOtp')



const signUpSeller = async (req, res, next) => {
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
      data: [],
    })
  }
  try {
    let regErrors = {}
    const sellerExist = await Seller.findOne({ email })
    if (sellerExist) {
      const sellerStore = await Store.findOne({ owner: sellerExist._id })
      if (sellerStore) {
        const docs = await VerificationDoc.findOne({ store: sellerStore._id })
        if (docs) {
          if (docs.proofOfId == null) {
            regErrors.proofOfId = 'please up load proof of ID'
          }
          if (docs.proofOfAddress == null) {
            regErrors.proofOfAddress = 'please up load proof of address'
          }

          return res.status(400).json({
            status: 'failed',
            message: 'user registered already.',
            errors: regErrors ? regErrors : '',
            data: sellerExist,
          })
        } else {
          return res.status(200).json({
            status: 'success',
            message: 'user registered already. Docs required',
            flag: 'docs required',
            data: sellerExist,
          })
        }
      } else {
        return res.status(200).json({
          status: 'success',
          message: 'user registered already. store required',
          flag: 'store required',
          data: sellerExist,
        })
      }
    } else {
      //registere user
      console.log('we are here')
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
          data: [],
        })
      }
    }
  } catch (e) {
    return next(e)
  }
}
module.exports = signUpSeller
