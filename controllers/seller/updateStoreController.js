const Seller = require('../../models/sellerModel')
const Store = require('../../models/storeModel')
const Error = require('../../utils/errorResponse')

const updateStore = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store
  const { postalCode, city, storeAddress } = req.body


  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  try {
    const store = await Store.findById({ _id: sellerStore.id })
    const updtStore = await Store.findOneAndUpdate(
      { _id: sellerStore.id },
      {
        $set: {
          postalCode: postalCode ? postalCode : store.postalCode,
          city: city ? city : store.city,
          storeAddress: storeAddress ? storeAddress : store.storeAddress,
        },
      },
      { new: true }
    )
    res.status(201).json({
      status:'success',
      message:"store updated successfully",
      data:updtStore
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = updateStore
