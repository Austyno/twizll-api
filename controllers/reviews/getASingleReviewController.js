const Error = require('../../utils/errorResponse')
const Order = require('../../models/orderModel')
const ProductReviewModel = require('../../models/productReviewModel')

const singleReview = async (req, res, next) => {
  const { reviewId } = req.params

  //check if review exist
  const reviewExist = await ProductReviewModel.findById(reviewId)

  if (!reviewExist) {
    return next(new Error('This review does not exist', 404))
  }

  try {
    const review = await ProductReviewModel.findById(reviewId).populate(
      'product',
      'name briefDesc mainPhoto ratingAvg'
    )
    //Todo : return product seperate from review
    res.status(200).json({
      status: 'success',
      message: 'review retrieved successfully',
      data: review,
    })
  } catch (e) {
    return next('some thing went wrong, please try again', 500)
  }
}

module.exports = singleReview
