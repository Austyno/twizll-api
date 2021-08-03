const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const Store = require('../../models/storeModel')

const bestSelling = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store

  if (!seller) {
    return next(new Error('You need to sign in to view this page', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  try {
    const bestSellingProducts = await Product.find({ store: sellerStore._id })
      .sort({
        numberSold: -1,
      })
      .limit(10)

    res.status(200).json({
      status: 'success',
      message: 'Top 10 best selling products retrieved successfully',
      data: bestSellingProducts,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}

module.exports = bestSelling
