const { Schema, model } = require('mongoose')
const Product = require('./productModel')

const productReviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: [true, 'Please provide the id of the product for this review'],
      ref: 'Product',
    },
    rating: {
      required: true,
      type: Number,
      min: 1,
      max: 5,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the id of the user for this review'],
    },
    text: String,
  },
  { timestamps: true }
)

productReviewSchema.index({ user: 1, rating: 1, product: 1 })

productReviewSchema.pre('save', async function (next) {
  let product = await Product.findOne({ _id: this.product })
  await product.calculateAverageRating(this.rating)
  next()
})

module.exports = model('ProductReview', productReviewSchema)
