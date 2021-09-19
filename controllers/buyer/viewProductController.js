const Error = require('../../utils/errorResponse')
const Product = require('../../models/productModel')
const Category = require('../../models/productCategoryModel')
const RecentlyViewed = require('../../models/recentlyViewedModel')

const viewProduct = async (req, res, next) => {
  const { productId } = req.params

  const pro = await Product.findById(productId)
  if (!pro) {
    return next(new Error('This product does not exist', 400))
  }

  try {
    const product = await Product.findById(productId)
      .populate('category')

    const similarProducts = await Category.findById(product.category).populate(
      'products'
    )

    const youMayAlsoLike = similarProducts.products.filter(
      item => item._id != productId
    )

      product.views = Number(product.views) + 1


      await product.save({ validateBeforeSave: false })
      res.status(200).json({
        status: 'success',
        message: 'product details retrieved successfully',
        data: {
          product,
          youMayAlsoLike,
        },
      })

  } catch (e) {
    return next(new Error(e.message, 500))
  }
}
module.exports = viewProduct
