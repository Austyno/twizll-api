const Store = require('../../models/storeModel')
const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
require('../../models/productModel')
require('../../models/productCategoryModel')

const inventory = async (req, res, next) => {
  const seller = req.user
  const sellerStore = req.store

  try {
    //get all products for the logged in seller
    const products = await Product.find({
      store: sellerStore._id,
    }).populate('category', 'name')


    res.status(200).json({
      status:'success',
      message:'your inventory',
      total:products.length,
      data:products
    })
  } catch (e) {
    return next(new Error(e.message,500))
  }
}

module.exports = inventory
