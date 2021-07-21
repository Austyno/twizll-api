const Store = require('../../models/storeModel')
const Error = require('../../utils/errorResponse')
const { viewAllMyProducts } = require('../../permissions/seller/product')
require('../../models/productModel')

//get the logged in seller products only
const getAllProducts = async (req, res, next) => {
  const seller = req.user

  if (!seller) {
    return next(new Error('You need to sign in', 401))
  }

  try {

    //locate loggedin user store and populate with all products with his store id
    const storeProducts = await Store.find({owner:seller._id}).populate('products').populate('owner','fullName email photo')

    const totalProducts = storeProducts.products
    console.log(totalProducts)



    res.status(200).json({
      status: 'success',
      message: 'These are your products',
      data: storeProducts,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = getAllProducts
