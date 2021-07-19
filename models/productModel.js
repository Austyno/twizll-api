const { model, Schema } = require('mongoose')

const productSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: [true, 'Please provide the id of the seller of this product'],
      ref: 'User',
    },
    name: {
      required: [true, 'Product name not provided'],
      type: String,
      unique: true,
    },
    unitPrice: {
      required: [true, 'Product unitPrice not provided'],
      type: Schema.Types.Decimal128,
    },
    photos: [String],
    briefDesc: String,
    description: {
      required: [true, 'Product description not provided'],
      type: String,
    },
    mainPhoto: {
      required: [true, 'Product mainPhoto not provided'],
      type: String,
    },
    numberSold: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    totalNoOfUnits: {
      required: [true, 'Product total Number Of Units not provided'],
      type: Number,
    },
    attributes: {
      type: Array,
    },
    availableUnits: Number,
    categoryID: {
      type: Schema.Types.ObjectId,
      ref: 'ProductCategory',
      required: true,
    },
    ratingAvg: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
)

productSchema.index({ name: 1, mainPhoto: 1, unitPrice: 1 })
productSchema.index({ name: 1, categoryID: 1 })

productSchema.methods.calculateAverageRating = async function (defaultRating) {
  let productReviewsAvg = await ProductReview.db
    .model('ProductReview')
    .aggregate([
      { $match: { product: this._id } },
      {
        $group: {
          _id: null,
          ratingAvg: { $avg: '$rating' },
        },
      },
    ])

  if (productReviewsAvg.length === 0) {
    this.ratingAvg = defaultRating
    await this.save()
  } else {
    this.ratingAvg = productReviewsAvg[0].ratingAvg
    await this.save()
  }
}

module.exports = model('Product', productSchema)
