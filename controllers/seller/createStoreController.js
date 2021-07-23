const Store = require('../../models/storeModel')
const Error = require('../../utils/errorResponse')

const createStore = async (req, res, next) => {
  //seller must be logged in
  const seller = req.user
  const { storeName, storeAddress } = req.body

  if (!seller) {
    return next(new Error('You need to sign in to create a store', 403))
  }

  try {
    const store = await Store.create({
      storeName,
      storeAddress,
      owner:seller._id,
    })

    res.status(201).json({
      status: 'success',
      message: 'Store created successfully. You neeed to verify your store by uploading supporting documents',
      data: store,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = createStore
