const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const {
  viewAllMyProducts,
  viewMyProduct,
  canDeleteMyProduct,
  canUpdateMyProduct,
} = require('../../permissions/seller/product')

//get the logged in seller products only
const getAllProducts = async (req, res, next) => {
  const user = req.user

  if (!user) {
    return next(new Error('You need to sign in', 401))
  }

  try {
    const products = await Product.find({ owner: user._id })

    //get the logged in seller products only
    // const myProducts = viewAllMyProducts(user._d, products)
    // const myProducts = products.filter(product => product.owner === user._id)

    res.status(200).json({
      status: 'success',
      total: products.length,
      message: 'These are your products',
      data: products,
    })
  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = getAllProducts
