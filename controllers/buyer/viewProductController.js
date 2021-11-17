const Error = require('../../utils/errorResponse')
const Product = require('../../models/productModel')
const SubCategory = require('../../models/subcategoryModel')
const Category = require('../../models/categoryModel')

const viewProduct = async (req, res, next) => {
  const { productId } = req.params

  const pro = await Product.findById(productId)
  if (!pro) {
    return next(new Error('This product does not exist', 400))
  }

  try {
    const product = await Product.findById(productId).populate('subcategory')

    const similarProducts = await SubCategory.findById(product.sub_category).populate(
      'products'
    )
    const productCategory = await SubCategory.findById(product.sub_category)

    //update ctegory views
    productCategory.views = Number(productCategory.views) + 1
    productCategory.save({ validateBeforeSave: false })

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
