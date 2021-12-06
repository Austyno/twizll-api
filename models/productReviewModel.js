const { Schema, model } = require('mongoose')
const Product = require('./productModel')

const productReviewSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: [true, 'Please provide the id of the product for this review'],
      ref: 'Product',
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'Buyer',
      required: [true, 'Please provide the id of the user for this review'],
    },
  },
  { timestamps: true }
)

productReviewSchema.index({ user: 1, rating: 1, product: 1 }, { unique: true })

productReviewSchema.statics.calculateRatingAverage = async function (
  productId
) {
  console.log('calculating avarage')
  const obj = await this.aggregate([
    {
      $match: {
        product: productId,
      },
    },
    {
      $group: {
        _id: '$product',
        ratingAvg: {
          $avg: '$rating',
        },
      },
    },
  ])
  console.log(obj)
  try {
    await this.model('Product').findByIdAndUpdate(productId, {
     $set: {ratingAvg: obj[0].ratingAvg}
    })
  } catch (e) {
    console.log(e)
  }
}

productReviewSchema.pre('save', async function () {
  this.constructor.calculateRatingAverage(this.product)
})

productReviewSchema.pre('remove', async function () {
  this.constructor.calculateRatingAverage(this.product)
})

module.exports = model('ProductReview', productReviewSchema)
