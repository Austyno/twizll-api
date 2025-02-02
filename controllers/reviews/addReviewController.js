const Product = require('../../models/productModel')
const Error = require('../../utils/errorResponse')
const Order = require('../../models/orderModel')
const ProductReviewModel = require('../../models/productReviewModel')

const addProductReview = async (req, res, next) => {
  const { title, rating, text, product } = req.body
  const buyer = req.user
  req.body.buyer = buyer.id

  const productToReview = await Product.findById(product)
// ******** user should only be able to review products that they have bought
  if (!productToReview) {
    return next(new Error('The product no longer exist in our system', 404))
  }

  //check if user has bought this product
  const userHasBoughtProduct = await Order.find({
    $and: [
      { buyer: buyer.id },
      { orderItems: { $elemMatch: { product } } },
    ],
  })

  if (!userHasBoughtProduct || userHasBoughtProduct === null) {
    return next(
      new Error(
        'You can only review products that you have purchased in the past',
        400
      )
    )
  }
  //check if user has reviewed product before
  const hasReviedBefor = await ProductReviewModel.findOne({
    $and: [{ product: product }, { buyer: buyer.id }],
  })

  if (hasReviedBefor !== null) {
    return next(new Error('You have previously reviewed this product', 400))
  }
  try {
    const review = await ProductReviewModel.create(req.body)
    res.status(201).json({
      status: 'success',
      message: 'Product review created successfully',
      data: review,
    })
  } catch (e) {
    return next(new Error(e.message))
  }
}
module.exports = addProductReview
