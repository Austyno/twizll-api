const Error = require('../../utils/errorResponse')
const CollectionProduct = require('../../models/collectionProductsModel')
const Product = require('../../models/productModel')

const collectionCategoryProducts = async (req, res, next) => {
  const { categoryId } = req.params
  if (!categoryId) {
    return next(new Error('category id is required', 400))
  }
  try {
    const prod = await CollectionProduct.find({
      collectionCategories: categoryId,
    }).populate('product')

    res.status(200).json({
      status: 'success',
      message: 'collection category products successfully retrieved',
      data: prod,
    })

  } catch (e) {
    return next(e.message, 500)
  }
}
module.exports = collectionCategoryProducts
