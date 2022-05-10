const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const Order = require('../../models/orderModel')
const ProductReviewModel = require('../../models/productReviewModel')

const getProductReviews = async (req, res, next) => {
  const { product } = req.params

  try {
    // const reviews = Product.find({_id:product}).populate('reviews','title text rating').populate()
    const reviews = await ProductReviewModel.find({ product: product })

      .populate('user', 'fullName')
      .populate('product','mainPhoto rating name attributes')
      
    res.status(200).json({
      status: 'success',
      message: 'product reviews retrieved successfully',
      data: reviews,
    })
  } catch (e) {
    return next(
      new Error('Sorry we couldnt retrieve the reviews at this moment', 500)
    )
  }
}

module.exports = getProductReviews
