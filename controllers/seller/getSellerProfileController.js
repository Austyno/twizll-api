const Seller = require('../../models/sellerModel')
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

  try{
    const user = await Seller.findById(req.user._id).populate(
      'store',
      'storeVisits totalSales totalOrders totalReturns docsUploaded storeVerified storeName logo storeAddress'
    )
    user.stripe_customer_id = undefined
    user.token= undefined
    user.__v = undefined
    
    res.status(200).json({
      status: 'success',
      message: 'Seller profile retrieved successfuly',
      data: user,
    })
  }catch(e){
    return next(new Error('There was an error geting your profile',500))
  }

  
}
module.exports = profile
