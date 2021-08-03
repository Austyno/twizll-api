const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
require('../../models/productModel')
require('../../models/productCategoryModel')

//get the logged in seller products only
const getAllProductsByCat = async (req, res, next) => {
  const { catId } = req.params
  const seller = req.user
  const sellerStore = req.store

  if (!seller) {
    return next(new Error('You need to sign in', 401))
  }
  if (!sellerStore) {
    return next(new Error('Only store owners can perform this action', 403))
  }

  try {
    //locate all products by the seller store where category id = catId
    const catProducts = await Product.find({
      $and: [{ store: sellerStore._id }, { category: catId }],
    })
      .populate('store', 'storeName')

    res.status(200).json({
      status: 'success',
      message: 'Products retrieved successfully',
      data: catProducts,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = getAllProductsByCat
