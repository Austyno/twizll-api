const Order = require('../../models/orderModel')
const Error = require('../../utils/errorResponse')

const trackOrder = async (req, res, next) => {
  const { trackingId } = req.params
  const seller = req.user
  const sellerStore = req.store
  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  //track order by store
  const trackingIdExist = await Order.findOne({ trackingId })

  if (!trackingIdExist) {
    return next(new Error('This tracking id does not exist', 404))
  }

  try {
    const order = await Order.find({
      $and: [{ store: sellerStore.id }, { trackingId }],
    }).populate('buyer', 'fullName address email phone')

    res.status(200).json({
      status: 'success',
      message: 'this is your order',
      data: order,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = trackOrder
