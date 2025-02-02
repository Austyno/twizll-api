const Store = require('../../models/storeModel')
const Wallet = require('../../models/walletModel')
const Error = require('../../utils/errorResponse')
const checkCountry = require('../../utils/checkCountry')
const Stripe = require('../../utils/stripe/Stripe')
const open = require('open')

const createStore = async (req, res, next) => {
  //seller must be logged in
  const seller = req.user
  const { storeName, storeAddress, postalCode, city, country } = req.body

  if (!seller) {
    return res.status(403).json({
      status: 'failed',
      message: 'You need to be signed in to create a store',
      data: [],
    })
  }

  const storeExist = await Store.findOne({ owner: seller.id })

  if (storeExist) {
    return res.status(400).json({
      status: 'failed',
      message: 'You already have a store created',
      data: [],
    })
  }
  //activeSubscription
  try {

    const store = await Store.create({
      owner: seller.id,
      storeName,
      storeAddress,
      city,
      postalCode,
      country,
      activeSubscription : seller.free_trial.status == 'active' ? true : false
    })
    if (store) {
      const wallet = await Wallet.create({
        store: store.id,
      })

      res.status(200).json({
        status: 'Success',
        message:
          'Store created successfully. You neeed to verify your store by uploading supporting documents.Only products of verified stores are displayed to buyers',
        data: store,
      })
    }
  } catch (e) {
    return next(new Error(e.message, 500))
  }

  // try {
  //   newStore = await Store.create(
  //     [{ storeName, storeAddress, owner: seller._id, country }],
  //     { session }
  //   )

  //   await newStore[0].save({ session })

  //   //check if store is in a stripe supported country for on boarding
  //   const isValidCountry = checkCountry(country)

  //   //send to stripe onboarding if true
  //   if (isValidCountry !== false) {
  //     const accountId = await Stripe.createAccount(country)

  //     const accountLink = await Stripe.createAccountLink(accountId)

  //     await session.commitTransaction()
  //     session.endSession()

  //     const data = {
  //       newStore,
  //       onBoardingLink: accountLink,
  //     }

  //     res.status(201).json({
  //       status: 'success',
  //       message:
  //         'Store created successfully. You neeed to verify your store by uploading supporting documents. Also follow the link and provide all required info to enable us easily pay you',
  //       data,
  //     })
  //   } else {
  //     //create a wallet if false
  //     const storeWallet = await Wallet.create(
  //       [
  //         {
  //           store: newStore._id,
  //         },
  //       ],
  //       { session }
  //     )
  //     storeWallet[0].save({ session })

  //     await session.commitTransaction()
  //     session.endSession()

  //     res.status(200).json({
  //       status: 'Success',
  //       message:
  //         'Store created successfully. You neeed to verify your store by uploading supporting documents.',
  //       data: newStore,
  //     })
  //   }
  // } catch (e) {
  //   await session.abortTransaction()
  //   session.endSession()
  //   return next(new Error(e.message, 500))
  // }
}
module.exports = createStore
