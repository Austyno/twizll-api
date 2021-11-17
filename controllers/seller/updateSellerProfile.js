const Seller = require('../../models/sellerModel')
const Error = require('../../utils/errorResponse')

const updateProfile = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store
  const { fullName, address } = req.body

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  try {
    const update = await Seller.findOneAndUpdate(
      seller.id,
      {
        fullName: req.body.fullName === undefined ? seller.fullName : req.body.fullName,
        address: req.body.address === undefined ? seller.address : req.body.address,
      },
      { new: true }
    )
update.token = undefined
    res.status(201).json({
      status: 'success',
      message: 'seller profile updated successfully',
      data: update,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = updateProfile
