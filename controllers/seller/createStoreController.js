const Store = require('../../models/storeModel')
const Wallet = require('../../models/walletModel')
const Error = require('../../utils/errorResponse')
const checkCountry = require('../../utils/checkCountry')
const Stripe = require('../../utils/stripe/Stripe')
const open = require('open')

const createStore = async (req, res, next) => {
  //seller must be logged in
  const seller = req.user
  const { storeName, storeAddress, country } = req.body

  if (!seller) {
    return next(new Error('You need to sign in to create a store', 403))
  }

  const session = await Store.startSession()
  session.startTransaction()
  let newStore


  try {
    newStore = await Store.create(
      [{ storeName, storeAddress, owner: seller._id, country }],
      { session }
    )

    await newStore[0].save({ session })

    //check if store is in a stripe supported country
    const isValidCountry = checkCountry(country)
    //send to stripe onboarding if true
    if (isValidCountry !== false) {
      const accountId = await Stripe.createAccount(country)

      const accountLink = await Stripe.createAccountLink(accountId)

      return open(accountLink)
    } else {
      //create a wallet if false
      const storeWallet = await Wallet.create(
        [
          {
            store: newStore._id,
          },
        ],
        { session }
      )
      storeWallet[0].save({ session })
    }

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({
      status: 'success',
      message:
        'Store created successfully. You neeed to verify your store by uploading supporting documents',
      data: newStore,
    })
  } catch (e) {
    await session.abortTransaction()
    session.endSession()
    return next(new Error(e.message, 500))
  }
}
module.exports = createStore
