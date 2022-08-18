const Error = require('../../utils/errorResponse')
const Product = require('../../models/productModel')
const SubCategory = require('../../models/subcategoryModel')
const Category = require('../../models/categoryModel')

const viewProduct = async (req, res, next) => {
  const { productId } = req.params

  const pro = await Product.findById(productId)
  if (!pro) {
    return res.status(404).json({
      status: 'bad request',
      message: 'product does not exist',
      data: '',
    })
  }

  // try {
  const product = await Product.findById(productId).populate('subcategory')

  const similarProducts = await SubCategory.findById(
    product.sub_category
  ).populate('products')

  const productCategory = await SubCategory.findById(product.sub_category)

  //check if category views exist
  if (productCategory.views != null) {
    productCategory.views = Number(productCategory.views) + 1
    productCategory.save({ validateBeforeSave: false })
  }

  if (product.views != null) {
    product.views = Number(product.views) + 1
    product.save({ validateBeforeSave: false })
  }

  const youMayAlsoLike = similarProducts.products.filter(
    item => item._id != productId
  )

  res.status(200).json({
    status: 'success',
    message: 'product details retrieved successfully',
    data: {
      product,
      youMayAlsoLike,
    },
  })
  // } catch (e) {
  //   return next(e)
  // }
}
module.exports = viewProduct
