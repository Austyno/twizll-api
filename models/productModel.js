const { model, Schema } = require('mongoose')

const productSchema = new Schema({
  store: {
    type: Schema.Types.ObjectId,
    required: [true, 'Please provide the id of the seller of this product'],
    ref: 'Store',
  },
  sub_category: {
    type: Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: [true, 'Please provide a subcategory for this product'],
  },
  twizll_collection: {
    type: Schema.Types.ObjectId,
    ref: 'Collection',
  },
  name: {
    required: [true, 'Product name not provided'],
    type: String,
    unique: true,
  },
  unitPrice: {
    required: [true, 'Product unitPrice not provided'],
    type: Number,
  },
  originalPrice:{
    type:Number,
    required:true
  },
  photos: [String],
  briefDesc: {
    type: String,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
    required: true,
  },
  width: {
    type: Number,
    required: true,
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
  availableQty: {
    required: [true, 'Product total Number available for sale'],
    type: Number,
  },
  attributes: {
    colors: [String],
    sizes: [String],
  },
  returnPolicy: {
    type: String,
    required: true,
  },
  price_id: {
    type: String,
  },
  sourceOfMaterial: {
    type: String,
  },
  percentageDiscount: {
    type: Number,
    default: 0,
  },
  ratingAvg: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

productSchema.virtual('reviews', {
  ref: 'ProductReview',
  localField: '_id',
  foreignField: 'product',
  justOne: false,
})

// productSchema.index({ name: 1, mainPhoto: 1, unitPrice: 1 })
// productSchema.index({ name: 1, category: 1 })

productSchema.set('toObject', { virtuals: true })
productSchema.set('toJSON', { virtuals: true })

// productSchema.methods.calculateAverageRating = async function (defaultRating) {
//   let productReviewsAvg = await ProductReview.db
//     .model('ProductReview')
//     .aggregate([
//       { $match: { product: this._id } },
//       {
//         $group: {
//           _id: null,
//           ratingAvg: { $avg: '$rating' },
//         },
//       },
//     ])

//   if (productReviewsAvg.length === 0) {
//     this.ratingAvg = defaultRating
//     await this.save()
//   } else {
//     this.ratingAvg = productReviewsAvg[0].ratingAvg
//     await this.save()
//   }
// }

module.exports = model('Product', productSchema)
