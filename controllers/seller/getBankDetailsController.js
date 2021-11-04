const Store = require('../../models/storeModel')
const Error = require('../../utils/errorResponse')
const Bank = require('../../models/bankDetailsModel')

const getBankDetails = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 403))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  try {
    const details = await Bank.find({ store: sellerStore.id }).populate('store')

    if (details.length === 0) {
      return res.status(200).json({
        status: 'success',
        message:
          'You have not added any bank details yet. Please add your bank details',
        data: [],
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'bank details retrieved successfully',
      data: details,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = getBankDetails
