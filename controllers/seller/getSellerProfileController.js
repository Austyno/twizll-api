const User = require('../../models/userModel')
const Error = require('../../utils/errorResponse')

const profile = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  res.status(200).json({
    status: 'success',
    message: 'Seller profile retrieved successfuly',
    data: req.user,
  })
}
module.exports = profile
