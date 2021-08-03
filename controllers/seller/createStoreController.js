const Store = require('../../models/storeModel')
const Wallet = require('../../models/walletModel')
const Error = require('../../utils/errorResponse')

const createStore = async (req, res, next) => {
  //seller must be logged in
  const seller = req.user
  const { storeName, storeAddress } = req.body

  if (!seller) {
    return next(new Error('You need to sign in to create a store', 403))
  }

  const session = await Store.startSession()
  session.startTransaction()
  let newStore

  try {
     newStore = await Store.create(
      [
        {
          storeName,
          storeAddress,
          owner: seller._id,
        },
      ],
      { session }
    )

    await newStore[0].save({ session })

    const storeWallet = await Wallet.create(
      [
        {
          store: newStore._id,
        },
      ],
      { session }
    )

    storeWallet[0].save({ session })

    await session.commitTransaction()
  } catch (e) {
    await session.abortTransaction()
    return next(new Error(e.message, 500))
  } finally {
    session.endSession()
  }

  res.status(201).json({
    status: 'success',
    message:
      'Store created successfully. You neeed to verify your store by uploading supporting documents',
    data: newStore,
  })
}
module.exports = createStore
