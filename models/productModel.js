const { model, Schema } = require('mongoose')

const productSchema = new Schema({
  store: {
    type: Schema.Types.ObjectId,
    required: [true, 'Please provide the id of the seller of this product'],
    ref: 'Store',
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please provide a category for this product'],
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
  briefDesc: {
    type: String,
  },
  weight: {
    type: Number,
    required: [true, 'please tell us the weight of this item'],
  },
  brand: {
    type: String,
  },
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
  returnPolicy: {
    type: String,
    required: true,
  },
  availableUnits: {
    type: Number,
  },
  sourceOfMaterial: {
    type: String,
  },
  ratingAvg: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
})

// productSchema.index({ name: 1, mainPhoto: 1, unitPrice: 1 })
// productSchema.index({ name: 1, category: 1 })

// productSchema.set('toObject', { virtuals: true })
// productSchema.set('toJSON', { virtuals: true })

productSchema.pre('save', function () {
  this.unitPrice = this.unitPrice + 20
})

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
